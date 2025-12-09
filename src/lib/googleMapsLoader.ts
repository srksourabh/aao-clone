declare global {
  interface Window {
    initGoogleMaps?: () => void;
    google?: typeof google;
  }
}

let isLoading = false;
let isLoaded = false;
let loadError: Error | null = null;

export async function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (isLoaded) {
    return;
  }

  if (isLoading) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkInterval);
          resolve();
        } else if (loadError) {
          clearInterval(checkInterval);
          reject(loadError);
        }
      }, 100);
    });
  }

  if (!apiKey) {
    const error = new Error("Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your .env.local file");
    loadError = error;
    console.error("❌ Google Maps API Error:", error.message);
    throw error;
  }

  if (typeof window === "undefined") {
    return;
  }

  if (window.google?.maps?.places) {
    isLoaded = true;
    console.log("✅ Google Maps API already loaded");
    return;
  }

  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );

      if (existingScript) {
        existingScript.remove();
        console.log("🔄 Removed existing Google Maps script");
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&loading=async`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        isLoaded = true;
        isLoading = false;
        console.log("✅ Google Maps API loaded successfully");
        console.log("✅ Places library available:", !!window.google?.maps?.places);
        delete window.initGoogleMaps;
        resolve();
      };

      script.onerror = (error) => {
        isLoading = false;
        const err = new Error(
          "Failed to load Google Maps API. Please check:\n" +
          "1. API key is valid\n" +
          "2. Places API is enabled in Google Cloud Console\n" +
          "3. Domain is not restricted\n" +
          "4. Billing is enabled (required for Places API)\n" +
          "5. No quota limits reached"
        );
        loadError = err;
        console.error("❌ Google Maps API Loading Error:", err.message);
        console.error("Original error:", error);
        reject(err);
      };

      document.head.appendChild(script);
      console.log("🔄 Loading Google Maps API with Places library...");
      console.log("API Key (first 10 chars):", apiKey.substring(0, 10) + "...");

      setTimeout(() => {
        if (!isLoaded && isLoading) {
          isLoading = false;
          const timeoutError = new Error("Google Maps API loading timeout (30s). This usually means:\n" +
            "• API key is invalid\n" +
            "• Required APIs are not enabled\n" +
            "• Network connectivity issue\n" +
            "• Browser blocking the request");
          loadError = timeoutError;
          console.error("❌ Timeout Error:", timeoutError.message);
          reject(timeoutError);
        }
      }, 30000);
    } catch (error) {
      isLoading = false;
      loadError = error as Error;
      console.error("❌ Unexpected error loading Google Maps:", error);
      reject(error);
    }
  });
}

export function isGoogleMapsLoaded(): boolean {
  return isLoaded && !!window.google?.maps?.places;
}

export function getLoadError(): Error | null {
  return loadError;
}
