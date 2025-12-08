import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, Car, Baby, Stethoscope, Dog, Phone, MapPin, Navigation, Sparkles, Plus, Minus, Mic, MicOff, Loader2, CheckCircle2, MapPinned, AlertCircle } from "lucide-react";
import { BookingFormData, CAR_TYPES, ParsedBookingData, PlaceDetails } from "@/types/booking";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";

interface BookingFormProps {
  title: string;
  subtitle: string;
  isRoundTrip?: boolean;
  onTabChange: (tab: string, data: ParsedBookingData) => void;
  initialData?: ParsedBookingData;
}

interface ExtendedBookingFormData extends BookingFormData {
  fromLocation?: PlaceDetails;
  toLocation?: PlaceDetails;
}

export function BookingForm({ title, subtitle, isRoundTrip = false, onTabChange, initialData }: BookingFormProps) {
  const [formData, setFormData] = useState<ExtendedBookingFormData>({
    from: initialData?.from || "",
    to: initialData?.to || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    passengers: initialData?.passengers || 1,
    carType: initialData?.carType || "Sedan",
    babyOnBoard: false,
    patientOnBoard: false,
    petOnBoard: false,
    name: "",
    phone: "",
    fromLocation: undefined,
    toLocation: undefined
  });

  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [showNLParsed, setShowNLParsed] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const {
    isReady,
    isLoading: isApiLoading,
    error: apiError,
    suggestions,
    isLoadingSuggestions,
    getSuggestions,
    getPlaceDetails,
    getCurrentLocation: getCurrentLocationFromApi,
    clearSuggestions
  } = useGooglePlacesAutocomplete();

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        from: initialData.from || prev.from,
        to: initialData.to || prev.to,
        date: initialData.date || prev.date,
        time: initialData.time || prev.time,
        passengers: initialData.passengers || prev.passengers,
        carType: initialData.carType || prev.carType
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const savedData = localStorage.getItem("aaocab-booking");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (!initialData) {
          setFormData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved booking data");
      }
    }
  }, [initialData]);

  useEffect(() => {
    localStorage.setItem("aaocab-booking", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-IN";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNaturalLanguageInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{4})(\d{0,3})(\d{0,3})/, (match, p1, p2, p3) => {
        let result = p1;
        if (p2) result += " " + p2;
        if (p3) result += " " + p3;
        return result;
      }).trim();
    }
    return cleaned.substring(0, 10).replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleLocationInput = (field: 'from' | 'to', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value, [`${field}Location`]: undefined }));
    setActiveField(field);
    if (value.length > 2 && isReady) {
      getSuggestions(value);
    } else {
      clearSuggestions();
    }
  };

  const selectLocation = async (field: 'from' | 'to', placeId: string, description: string) => {
    setFormData((prev) => ({ ...prev, [field]: description }));
    clearSuggestions();
    setActiveField(null);

    const locationDetails = await getPlaceDetails(placeId);
    if (locationDetails) {
      setFormData((prev) => ({ ...prev, [`${field}Location`]: locationDetails }));
      console.log(`${field} Location Details:`, locationDetails);
    }
  };

  const handleGetCurrentLocation = async (field: "from" | "to") => {
    setGettingLocation(true);
    const locationDetails = await getCurrentLocationFromApi();
    if (locationDetails) {
      setFormData((prev) => ({
        ...prev,
        [field]: locationDetails.formattedAddress,
        [`${field}Location`]: locationDetails
      }));
    } else {
      alert("Unable to get your location. Please check your browser permissions and try again, or enter it manually.");
    }
    setGettingLocation(false);
  };


  const parseNaturalLanguage = () => {
    const input = naturalLanguageInput.toLowerCase();
    const parsedData: ParsedBookingData = {};
    let targetTab = isRoundTrip ? "roundtrip" : "oneway";

    if (input.includes("rental") && !input.includes("one") && !input.includes("round")) {
      targetTab = "rental";
    } else if (input.includes("package")) {
      targetTab = "package";
    } else if (input.includes("round trip") || input.includes("roundtrip")) {
      targetTab = "roundtrip";
    }

    const fromPatterns = [/from\s+([a-z\s]+?)(?:\s+to|\s+at|\s+on|\s+for|$)/i, /^([a-z\s]+?)\s+to\s+/i, /start(?:ing)?\s+(?:from|at)\s+([a-z\s]+?)(?:\s+to|\s+at|\s+on|$)/i];
    for (const pattern of fromPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const from = match[1].trim().replace(/\s+/g, " ");
        if (from.length > 2 && !["for", "at", "on", "with"].includes(from.toLowerCase())) {
          parsedData.from = from;
          break;
        }
      }
    }

    const toPatterns = [/to\s+([a-z\s]+?)(?:\s+at|\s+on|\s+for|\s+tomorrow|\s+today|\s+\d+\s*(?:am|pm)|$)/i, /(?:going|travel|headed?)\s+to\s+([a-z\s]+?)(?:\s+at|\s+on|\s+for|$)/i, /destination\s+([a-z\s]+?)(?:\s+at|\s+on|\s+for|$)/i];
    for (const pattern of toPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const to = match[1].trim().replace(/\s+/g, " ");
        if (to.length > 2 && !["for", "at", "on", "with"].includes(to.toLowerCase())) {
          parsedData.to = to;
          break;
        }
      }
    }

    const rentalLocationPatterns = [/(?:in|at|from|location)\s+([a-z\s]+?)(?:\s+for|\s+on|\s+at\s+\d|\s+tomorrow|\s+today|$)/i, /(?:rental|cab|car)\s+(?:in|at|from)\s+([a-z\s]+?)(?:\s+for|\s+on|\s+at\s+\d|\s+tomorrow|\s+today|$)/i];
    for (const pattern of rentalLocationPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        parsedData.location = match[1].trim().replace(/\s+/g, " ");
        break;
      }
    }

    const timeMatch = input.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] || "00";
      const meridiem = timeMatch[3].toLowerCase();
      if (meridiem === "pm" && hour !== 12) hour += 12;
      if (meridiem === "am" && hour === 12) hour = 0;
      parsedData.time = `${hour.toString().padStart(2, "0")}:${minute}`;
    }

    const dateKeywords = input.match(/\b(today|tomorrow)\b/i);
    if (dateKeywords) {
      const keyword = dateKeywords[1].toLowerCase();
      const today = new Date();
      if (keyword === "today") {
        parsedData.date = today.toISOString().split("T")[0];
      } else if (keyword === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        parsedData.date = tomorrow.toISOString().split("T")[0];
      }
    }

    const dateMatch = input.match(/(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const monthName = dateMatch[2].toLowerCase();
      const monthMap: {[key: string]: number;} = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
      const date = new Date();
      date.setMonth(monthMap[monthName]);
      date.setDate(day);
      if (date < new Date()) date.setFullYear(date.getFullYear() + 1);
      parsedData.date = date.toISOString().split("T")[0];
    }

    const passengerMatch = input.match(/(\d+)\s+(?:passenger|people|person|pax)/i);
    if (passengerMatch) {
      parsedData.passengers = Math.min(20, Math.max(1, parseInt(passengerMatch[1])));
    }

    if (input.includes("spiti")) {
      parsedData.packageType = "spiti";
    } else if (input.includes("wedding")) {
      parsedData.packageType = "wedding";
    }

    const currentTab = isRoundTrip ? "roundtrip" : "oneway";
    if (targetTab !== currentTab) {
      onTabChange(targetTab, parsedData);
    } else {
      setFormData((prev) => ({ ...prev, ...parsedData }));
      setShowNLParsed(true);
      setTimeout(() => setShowNLParsed(false), 3000);
    }
  };

  const adjustPassengers = (change: number) => {
    const newValue = formData.passengers + change;
    if (newValue >= 1 && newValue <= 20) {
      setFormData({ ...formData, passengers: newValue });
    }
  };

  const generateWhatsAppMessage = () => {
    const options = [];
    if (formData.babyOnBoard) options.push("Baby on board");
    if (formData.patientOnBoard) options.push("Patient on board");
    if (formData.petOnBoard) options.push("Pet on board");

    const optionsText = options.length > 0 ? options.join(", ") : "None";

    let locationInfo = "";
    if (formData.fromLocation) {
      locationInfo += `\n\nPickup Location Details:\n📍 ${formData.fromLocation.formattedAddress}\n🌐 Coordinates: ${formData.fromLocation.latitude.toFixed(6)}, ${formData.fromLocation.longitude.toFixed(6)}`;
      if (formData.fromLocation.placeId) {
        locationInfo += `\n🆔 Place ID: ${formData.fromLocation.placeId}`;
      }
    }
    if (formData.toLocation) {
      locationInfo += `\n\nDrop Location Details:\n📍 ${formData.toLocation.formattedAddress}\n🌐 Coordinates: ${formData.toLocation.latitude.toFixed(6)}, ${formData.toLocation.longitude.toFixed(6)}`;
      if (formData.toLocation.placeId) {
        locationInfo += `\n🆔 Place ID: ${formData.toLocation.placeId}`;
      }
    }

    return encodeURIComponent(
      `Hi AaoCab — I would like to book a cab.\n\nTrip Type: ${isRoundTrip ? "Round Trip" : "One-Way"}\nFrom: ${formData.from}\nTo: ${formData.to}\nDate: ${formData.date}\nTime: ${formData.time}\nPassengers: ${formData.passengers}\nCar type: ${formData.carType}\nOptions: ${optionsText}${locationInfo}\n\nName: ${formData.name}\nContact: ${formData.phone}`
    );
  };

  const sendToN8nWebhook = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.trim() === "") {
      console.log("n8n webhook URL not configured - skipping webhook send");
      return { success: true, skipped: true };
    }

    try {
      const webhookPayload = {
        timestamp: new Date().toISOString(),
        tripType: isRoundTrip ? "Round Trip" : "One-Way",
        bookingDetails: {
          from: formData.from,
          to: formData.to,
          date: formData.date,
          time: formData.time,
          passengers: formData.passengers,
          carType: formData.carType
        },
        customerDetails: {
          name: formData.name,
          phone: formData.phone
        },
        specialRequirements: {
          babyOnBoard: formData.babyOnBoard,
          patientOnBoard: formData.patientOnBoard,
          petOnBoard: formData.petOnBoard
        },
        preciseLocationData: {
          pickupLocation: formData.fromLocation ? {
            formattedAddress: formData.fromLocation.formattedAddress,
            coordinates: {
              latitude: formData.fromLocation.latitude,
              longitude: formData.fromLocation.longitude
            },
            placeId: formData.fromLocation.placeId || null,
            googleMapsUrl: `https://www.google.com/maps?q=${formData.fromLocation.latitude},${formData.fromLocation.longitude}`
          } : {
            textInput: formData.from,
            coordinates: null,
            placeId: null,
            note: "Precise location not captured - user entered text only"
          },
          dropLocation: formData.toLocation ? {
            formattedAddress: formData.toLocation.formattedAddress,
            coordinates: {
              latitude: formData.toLocation.latitude,
              longitude: formData.toLocation.longitude
            },
            placeId: formData.toLocation.placeId || null,
            googleMapsUrl: `https://www.google.com/maps?q=${formData.toLocation.latitude},${formData.toLocation.longitude}`
          } : {
            textInput: formData.to,
            coordinates: null,
            placeId: null,
            note: "Precise location not captured - user entered text only"
          }
        },
        metadata: {
          source: "AaoCab Website",
          userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
          formVersion: "2.0",
          hasPickupCoordinates: !!formData.fromLocation,
          hasDropCoordinates: !!formData.toLocation,
          submittedAt: new Date().toISOString()
        }
      };

      console.log("Sending booking data to n8n webhook:", webhookPayload);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      const responseData = await response.json().catch(() => ({}));
      console.log("n8n webhook response:", responseData);

      return { success: true, skipped: false, response: responseData };
    } catch (error) {
      console.error("Error sending to n8n webhook:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  };

  const handleBookNow = async () => {
    if (!formData.from || !formData.to || !formData.date || !formData.time || !formData.name || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    await sendToN8nWebhook();

    const whatsappMessage = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/917890302302?text=${whatsappMessage}`;

    const newWindow = window.open(whatsappUrl, "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      window.location.href = `tel:+917890302302`;
    }
  };

  const renderSuggestions = (field: 'from' | 'to') => {
    return (
      <div className="fixed z-[9999] bg-white border-2 border-indigo-500 rounded-lg shadow-2xl max-h-60 overflow-y-auto mt-1 min-w-[300px]" style={{ width: "calc(100% - 80px)" }}>
        {suggestions.map((suggestion, index) =>
        <button
          key={index}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            selectLocation(field, suggestion.placeId, suggestion.description);
          }}
          className="w-full px-4 py-3 text-left hover:bg-indigo-100 transition-colors border-b last:border-b-0 text-sm flex items-start gap-2">

            <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <span className="flex-1">{suggestion.description}</span>
          </button>
        )}
      </div>);

  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Tell us in your own words
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Type naturally like: &quot;I want a cab from Delhi to Shimla at 3 PM tomorrow&quot;
              </p>
              <div className="relative">
                <Textarea
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  placeholder="I need a cab from... to... at..."
                  className="min-h-[80px] resize-none border-indigo-300 focus:border-indigo-500 bg-white pr-12" />

                <Button
                  type="button"
                  onClick={toggleVoiceInput}
                  variant="ghost"
                  size="icon"
                  className={`absolute bottom-2 right-2 transition-all duration-300 ${
                  isListening ?
                  "text-red-600 animate-bounce scale-110" :
                  "text-indigo-600 hover:text-indigo-800"}`
                  }
                  title={isListening ? "Stop listening" : "Start voice input"}>

                  <div className="relative">
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isListening &&
                    <>
                        <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <span className="absolute inset-0 rounded-full bg-red-300 opacity-50 animate-pulse"></span>
                      </>
                    }
                  </div>
                </Button>
              </div>
              <Button
                onClick={parseNaturalLanguage}
                disabled={!naturalLanguageInput.trim()}
                className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">

                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Fill Form
              </Button>
              {showNLParsed &&
              <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Form auto-filled! Review and complete remaining details below.
                </p>
              }
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-brand-primary/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
            {isApiLoading &&
            <p className="text-sm text-amber-600 mt-2 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading location services...
              </p>
            }
            {apiError &&
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <h4 className="font-bold flex items-center gap-2"><AlertCircle className="w-5 h-5" />Location Service Error</h4>
                  <p className="mt-1 whitespace-pre-wrap">{apiError}</p>
              </div>
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary" />
                Pickup Location
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="from"
                    placeholder="Enter pickup location"
                    value={formData.from}
                    onChange={(e) => handleLocationInput('from', e.target.value)}
                    onFocus={() => {
                      setActiveField('from');
                      if (formData.from) getSuggestions(formData.from);
                    }}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                    className="border-brand-primary/30 focus:border-brand-primary"
                    required
                    disabled={!isReady && !apiError} />

                  {isLoadingSuggestions && activeField === 'from' &&
                  <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-brand-primary" />
                  }
                  {activeField === 'from' && suggestions.length > 0 && renderSuggestions('from')}
                </div>
                <Button
                  type="button"
                  onClick={() => handleGetCurrentLocation("from")}
                  disabled={gettingLocation || !isReady}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  title="Use current location">

                  {gettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                </Button>
              </div>
              
              {formData.fromLocation &&
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
                        <MapPinned className="w-4 h-4" />
                        Precise Location Captured
                      </p>
                      <div className="text-xs text-green-800 space-y-1">
                        <p className="flex items-start gap-1">
                          <span className="font-medium">📍 Address:</span>
                          <span className="flex-1">{formData.fromLocation.formattedAddress}</span>
                        </p>
                        <p>
                          <span className="font-medium">🌐 Coordinates:</span> {formData.fromLocation.latitude.toFixed(6)}, {formData.fromLocation.longitude.toFixed(6)}
                        </p>
                        {formData.fromLocation.placeId &&
                      <p className="truncate">
                            <span className="font-medium">🆔 Place ID:</span> {formData.fromLocation.placeId}
                          </p>
                      }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary" />
                Drop Location
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="to"
                    placeholder="Enter drop location"
                    value={formData.to}
                    onChange={(e) => handleLocationInput('to', e.target.value)}
                    onFocus={() => {
                      setActiveField('to');
                      if (formData.to) getSuggestions(formData.to);
                    }}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                    className="border-brand-primary/30 focus:border-brand-primary"
                    required
                    disabled={!isReady && !apiError} />

                  {isLoadingSuggestions && activeField === 'to' &&
                  <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-brand-primary" />
                  }
                  {activeField === 'to' && suggestions.length > 0 && renderSuggestions('to')}
                </div>
                <Button
                  type="button"
                  onClick={() => handleGetCurrentLocation("to")}
                  disabled={gettingLocation || !isReady}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  title="Use current location">

                  {gettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                </Button>
              </div>
              
              {formData.toLocation &&
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
                        <MapPinned className="w-4 h-4" />
                        Precise Location Captured
                      </p>
                      <div className="text-xs text-green-800 space-y-1">
                        <p className="flex items-start gap-1">
                          <span className="font-medium">📍 Address:</span>
                          <span className="flex-1">{formData.toLocation.formattedAddress}</span>
                        </p>
                        <p>
                          <span className="font-medium">🌐 Coordinates:</span> {formData.toLocation.latitude.toFixed(6)}, {formData.toLocation.longitude.toFixed(6)}
                        </p>
                        {formData.toLocation.placeId &&
                      <p className="truncate">
                            <span className="font-medium">🆔 Place ID:</span> {formData.toLocation.placeId}
                          </p>
                      }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-brand-primary/30 focus:border-brand-primary"
                min={new Date().toISOString().split("T")[0]}
                required />

            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border-brand-primary/30 focus:border-brand-primary"
                required />

            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-primary" />
                Number of Passengers
              </Label>
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  onClick={() => adjustPassengers(-1)}
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-50 border-brand-primary/30">

                  <Minus className="w-4 h-4" />
                </Button>
                <div className="px-8 py-2 font-semibold bg-gray-50 border border-brand-primary/30 rounded-md min-w-[80px] text-center text-lg">
                  {formData.passengers}
                </div>
                <Button
                  type="button"
                  onClick={() => adjustPassengers(1)}
                  variant="outline"
                  size="icon"
                  className="hover:bg-green-50 border-brand-primary/30">

                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carType" className="flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-primary" />
                Car Type
              </Label>
              <Select
                value={formData.carType}
                onValueChange={(value) => setFormData({ ...formData, carType: value })}>

                <SelectTrigger className="border-brand-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAR_TYPES.map((type) =>
                  <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-brand-primary/30 focus:border-brand-primary"
                required />

            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-primary" />
                Contact Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876 543 210"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="border-brand-primary/30 focus:border-brand-primary"
                maxLength={12}
                required />

            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Special Requirements</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="babyOnBoard"
                  checked={formData.babyOnBoard}
                  onCheckedChange={(checked) => setFormData({ ...formData, babyOnBoard: checked as boolean })} />

                <Label htmlFor="babyOnBoard" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Baby className="w-4 h-4 text-brand-primary" />
                  Baby on board
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="patientOnBoard"
                  checked={formData.patientOnBoard}
                  onCheckedChange={(checked) => setFormData({ ...formData, patientOnBoard: checked as boolean })} />

                <Label htmlFor="patientOnBoard" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Stethoscope className="w-4 h-4 text-brand-primary" />
                  Patient on board
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="petOnBoard"
                  checked={formData.petOnBoard}
                  onCheckedChange={(checked) => setFormData({ ...formData, petOnBoard: checked as boolean })} />

                <Label htmlFor="petOnBoard" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Dog className="w-4 h-4 text-brand-primary" />
                  Pet on board
                </Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleBookNow}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            size="lg"
            disabled={!isReady}>Book Now (via Whatsapp)


          </Button>

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            Advance bookings • Corporate events • Outstation specialists • Quality cabs & trained drivers
          </p>
        </CardContent>
      </Card>
    </div>);

}