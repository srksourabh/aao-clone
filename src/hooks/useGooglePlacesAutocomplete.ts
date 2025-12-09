
import { useState, useEffect, useCallback, useRef } from "react";
import { loadGoogleMapsScript } from "@/lib/googleMapsLoader";

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export function useGooglePlacesAutocomplete() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to .env.local");
      setIsLoading(false);
      console.error("❌ Missing API Key");
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          
          const mapDiv = document.createElement("div");
          const map = new window.google.maps.Map(mapDiv);
          placesServiceRef.current = new window.google.maps.places.PlacesService(map);
          
          geocoderRef.current = new window.google.maps.Geocoder();

          setIsReady(true);
          setIsLoading(false);
          setError(null);
          console.log("✅ Google Places Autocomplete ready");
        } else {
          throw new Error("Google Maps Places library not available");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to initialize Google Places:", err);
        setError(err.message || "Failed to load Google Places API. You can still enter locations manually.");
        setIsLoading(false);
        setIsReady(false);
      });
  }, []);

  const getSuggestionsDebounced = useCallback(
    (input: string): Promise<PlaceSuggestion[]> => {
      return new Promise((resolve) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        if (!input || input.length < 2) {
          setSuggestions([]);
          setIsLoadingSuggestions(false);
          resolve([]);
          return;
        }

        const autocompleteService = autocompleteServiceRef.current;
        if (!isReady || !autocompleteService) {
          console.warn("⚠️ Google Places not ready yet - manual input available");
          setIsLoadingSuggestions(false);
          resolve([]);
          return;
        }

        setIsLoadingSuggestions(true);

        debounceTimerRef.current = setTimeout(async () => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          abortControllerRef.current = new AbortController();

          try {
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error("Request timeout")), 5000);
            });

            const fetchPromise = new Promise<google.maps.places.AutocompletePrediction[]>(
              (resolveAPI, rejectAPI) => {
                autocompleteService.getPlacePredictions(
                  {
                    input,
                    componentRestrictions: { country: "in" },
                    types: ["geocode", "establishment"],
                  },
                  (predictions, status) => {
                    if (abortControllerRef.current?.signal.aborted) {
                      rejectAPI(new Error("Request cancelled"));
                      return;
                    }

                    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                      resolveAPI(predictions);
                    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                      resolveAPI([]);
                    } else {
                      rejectAPI(new Error(`Places API error: ${status}`));
                    }
                  }
                );
              }
            );

            const results = await Promise.race([fetchPromise, timeoutPromise]);

            const formattedSuggestions: PlaceSuggestion[] = results.map((prediction) => ({
              placeId: prediction.place_id,
              description: prediction.description,
              mainText: prediction.structured_formatting.main_text,
              secondaryText: prediction.structured_formatting.secondary_text || "",
            }));

            setSuggestions(formattedSuggestions);
            setIsLoadingSuggestions(false);
            console.log(`✅ Found ${formattedSuggestions.length} suggestions for "${input}"`);
            resolve(formattedSuggestions);
          } catch (err: unknown) {
            console.error("❌ Error fetching suggestions:", err);
            const errorMessage = err instanceof Error ? err.message : "";
            if (errorMessage !== "Request cancelled") {
              setSuggestions([]);
              setIsLoadingSuggestions(false);
            }
            resolve([]);
          }
        }, 300);
      });
    },
    [isReady]
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceDetails | null> => {
      const placesService = placesServiceRef.current;
      if (!isReady || !placesService) {
        console.warn("⚠️ Places service not ready");
        return null;
      }

      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), 5000);
        });

        const fetchPromise = new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
          placesService.getDetails(
            {
              placeId,
              fields: ["name", "formatted_address", "geometry", "address_components"],
            },
            (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                resolve(result);
              } else {
                reject(new Error(`Place details error: ${status}`));
              }
            }
          );
        });

        const place = await Promise.race([fetchPromise, timeoutPromise]);

        if (!place.geometry?.location) {
          throw new Error("No geometry data available");
        }

        const addressComponents = place.address_components || [];
        const getComponent = (type: string) => {
          const component = addressComponents.find((comp) => comp.types.includes(type));
          return component?.long_name;
        };

        const details: PlaceDetails = {
          placeId,
          formattedAddress: place.formatted_address || "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          name: place.name || "",
          city: getComponent("locality") || getComponent("administrative_area_level_2"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          postalCode: getComponent("postal_code"),
        };

        console.log("✅ Retrieved place details:", details);
        return details;
      } catch (err) {
        console.error("❌ Error fetching place details:", err);
        return null;
      }
    },
    [isReady]
  );

  const getCurrentLocation = useCallback(async (): Promise<PlaceDetails | null> => {
    if (!navigator.geolocation) {
      console.warn("⚠️ Geolocation not supported");
      return null;
    }

    const geocoder = geocoderRef.current;
    if (!isReady || !geocoder) {
      console.warn("⚠️ Geocoder not ready");
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      console.log(`📍 Got current location: ${latitude}, ${longitude}`);

      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === "OK" && results && results.length > 0) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding error: ${status}`));
            }
          }
        );
      });

      const place = results[0];
      const addressComponents = place.address_components || [];
      const getComponent = (type: string) => {
        const component = addressComponents.find((comp) => comp.types.includes(type));
        return component?.long_name;
      };

      const details: PlaceDetails = {
        placeId: place.place_id,
        formattedAddress: place.formatted_address,
        latitude,
        longitude,
        name: "Current Location",
        city: getComponent("locality") || getComponent("administrative_area_level_2"),
        state: getComponent("administrative_area_level_1"),
        country: getComponent("country"),
        postalCode: getComponent("postal_code"),
      };

      console.log("✅ Reverse geocoded current location:", details);
      return details;
    } catch (err) {
      console.error("❌ Error getting current location:", err);
      return null;
    }
  }, [isReady]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setIsLoadingSuggestions(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    isReady,
    isLoading,
    error,
    suggestions,
    isLoadingSuggestions,
    getSuggestions: getSuggestionsDebounced,
    getPlaceDetails,
    getCurrentLocation,
    clearSuggestions,
  };
}
