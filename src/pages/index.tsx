
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Phone, Facebook, MessageCircle, Shield, Users, Clock, Briefcase, Star, Award, MapPin, Navigation, Car, Plus, Minus, Sparkles, Mic, MicOff, Calendar as CalendarIcon } from "lucide-react";
import { CookieConsent } from "@/components/CookieConsent";
import { MobileMenu } from "@/components/MobileMenu";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { ParsedBookingData } from "@/types/booking";

const testimonials = [
  {
    name: "Ananya Das, 34",
    location: "Kolkata, West Bengal",
    text: "Exceptional service during our family trip to Darjeeling. The driver was patient with my elderly parents and made the mountain journey comfortable. Highly recommend AaoCab!",
    rating: 5
  },
  {
    name: "Rajesh Sharma, 42",
    location: "Delhi, North India",
    text: "Used AaoCab for our corporate event in Agra. The fleet management was impeccable - all 15 vehicles arrived on time. Professional drivers and well-maintained cars.",
    rating: 5
  },
  {
    name: "Lakshmi Iyer, 29",
    location: "Chennai, South India",
    text: "Booked for my wedding functions across Chennai and Mahabalipuram. The coordination was seamless and drivers were very respectful. Made our special day stress-free!",
    rating: 5
  },
  {
    name: "Arjun Mehta, 38",
    location: "Mumbai, Maharashtra",
    text: "Reliable service for daily airport transfers. Always punctual, clean vehicles, and courteous drivers. AaoCab has become my go-to cab service in Mumbai.",
    rating: 5
  },
  {
    name: "Priya Gupta, 31",
    location: "Pune, Maharashtra",
    text: "Outstanding experience with their Shimla package. Everything was well-organized from start to finish. Will definitely book again!",
    rating: 5
  }
];

const features = [
  {
    icon: Shield,
    title: "Quality Rides",
    description: "Well-maintained vehicles with regular servicing and safety checks"
  },
  {
    icon: Users,
    title: "Trained Drivers",
    description: "Professional, courteous drivers with extensive experience"
  },
  {
    icon: Clock,
    title: "Timely Arrivals",
    description: "Punctual service ensuring you reach on time, every time"
  },
  {
    icon: Briefcase,
    title: "Corporate & Conference Fleet",
    description: "Large-scale event management and corporate transportation solutions"
  }
];

const carImages = [
  "/BPqrNyn0bv_KD8JfPbvG3.jpg",
  "/kBIK-88wqWP6GOjVAqb2t.jpg",
  "/nMIHr7n01gD_A84DEEqgt_1_.jpg"
];

const indianCities = [
  "Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Shimla", "Manali", "Dharamshala", "Mussoorie", "Nainital", "Spiti Valley"
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("oneway");
  const [parsedData, setParsedData] = useState<ParsedBookingData>({});

  const handleTabChangeWithData = (newTab: string, data: ParsedBookingData) => {
    setParsedData(data);
    setActiveTab(newTab);
  };

  return (
    <>
      <Head>
        <title>AaoCab - Premium Advance Booking Cab Service | Corporate & Outstation Rides</title>
        <meta name="description" content="Book quality cabs in advance for your journey. Corporate events, outstation trips, conference transportation, and reliable rides with trained professional drivers. Available 24/7." />
        <meta name="keywords" content="cab booking, advance booking, corporate transportation, outstation cabs, conference fleet, trained drivers, quality rides, AaoCab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta property="og:title" content="AaoCab - Premium Advance Booking Cab Service" />
        <meta property="og:description" content="Book quality cabs in advance for your journey. Corporate events, outstation trips, and reliable transportation with trained drivers." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/Aao_Logo_Final_Aao_Cab_Colour.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AaoCab - Premium Advance Booking Cab Service" />
        <meta name="twitter:description" content="Book quality cabs in advance for your journey. Corporate events, outstation trips, and reliable transportation." />
        
        <link rel="canonical" href="https://aaocab.com" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-brand-light to-white">
        <header className="header-gradient shadow-lg sticky top-0 z-50 border-b border-white/20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/Aao_Logo_Final_Aao_Cab_White.jpg"
                alt="AaoCab Logo"
                width={160}
                height={80}
                className="object-contain drop-shadow-lg"
                priority
                style={{ margin: "0px", padding: "0px", borderRadius: "8px" }}
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-end">
              <Link href="/#services" className="text-sm font-medium text-white hover:text-white/80 transition drop-shadow-md">
                Services
              </Link>
              <Link href="/corporate" className="text-sm font-medium text-white hover:text-white/80 transition drop-shadow-md">
                Corporate
              </Link>
              <Link href="/#gallery" className="text-sm font-medium text-white hover:text-white/80 transition drop-shadow-md">
                Gallery
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium text-white hover:text-white/80 transition drop-shadow-md">
                Testimonials
              </Link>
              <a
                href="tel:+917890302302"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium text-white hover:bg-white/30 transition border border-white/30 drop-shadow-lg"
              >
                <Phone className="w-4 h-4" />
                +91 7890 302 302
              </a>
            </nav>
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </header>

        <section className="relative py-20 px-4 overflow-hidden min-h-[70vh] flex items-center justify-center">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute z-0 w-full h-full object-cover"
                src="/UxYpZkagxYTwVKoWEESPX_output.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-10"></div>
          
            <div className="container mx-auto max-w-6xl relative z-20">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                Your Trusted Ride,
                <span className="text-indigo-300"> Anytime</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-lg">
                Premium advance booking cab service for corporate events, outstation trips, and reliable daily commutes
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6 mt-8">
              <TabButton active={activeTab === "oneway"} onClick={() => setActiveTab("oneway")}>
                One-Way Trip
              </TabButton>
              <TabButton active={activeTab === "roundtrip"} onClick={() => setActiveTab("roundtrip")}>
                Round Trip
              </TabButton>
              <TabButton active={activeTab === "rental"} onClick={() => setActiveTab("rental")}>
                Rental
              </TabButton>
              <TabButton active={activeTab === "package"} onClick={() => setActiveTab("package")}>
                Package
              </TabButton>
            </div>

            <div className="animate-slide-up">
              {activeTab === "oneway" && (
                <BookingForm 
                  title="Book Your One-Way Trip"
                  subtitle="Enter your journey details below"
                  onTabChange={handleTabChangeWithData}
                  initialData={parsedData}
                />
              )}

              {activeTab === "roundtrip" && (
                <BookingForm 
                  title="Book Your Round Trip"
                  subtitle="Same location for departure and return"
                  isRoundTrip={true}
                  onTabChange={handleTabChangeWithData}
                  initialData={parsedData}
                />
              )}

              {activeTab === "rental" && (
                <BookingForm />
              )}

              {activeTab === "package" && (
                <BookingForm />
              )}
            </div>
          </div>
        </section>

        <section id="services" className="py-20 px-4 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/BPqrNyn0bv_KD8JfPbvG3.jpg"
              alt="Beautiful roads"
              fill
              className="object-cover"
            />
          </div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose AaoCab?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the difference with our commitment to quality, safety, and customer satisfaction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-brand-primary/10"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-brand-light rounded-full flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                      <feature.icon className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-white to-brand-light/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Fleet & Service
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Well-maintained vehicles and professional drivers at your service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-4 border-brand-primary/20">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/UxYpZkagxYTwVKoWEESPX_output.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                  <p className="text-white font-semibold text-lg drop-shadow-lg">Professional Service on Every Journey</p>
                </div>
              </div>
              
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-4 border-brand-secondary/20">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/8GUpZNZpZqQvckzdrl0fs_EZwCLTLD.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                  <p className="text-white font-semibold text-lg drop-shadow-lg">Quality Vehicles, Quality Experience</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {carImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <Image
                    src={image}
                    alt={`AaoCab Fleet ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real experiences from satisfied customers across India
              </p>
            </div>

            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full border-brand-primary/10">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 flex-grow text-sm">{testimonial.text}</p>
                        <div>
                          <p className="font-semibold text-brand-primary">{testimonial.name}</p>
                          <p className="text-xs text-gray-500">{testimonial.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        <section className="py-20 px-4 header-gradient text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
              Ready to Book Your Ride?
            </h2>
            <p className="text-lg mb-8 opacity-95 drop-shadow-md">
              Contact us now for advance bookings, corporate events, or outstation trips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/917890302302" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl hover:shadow-2xl">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </Button>
              </a>
              <a href="tel:+917890302302">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-brand-primary hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </a>
              <Link href="/corporate">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-brand-primary hover:bg-gray-100 shadow-xl hover:shadow-2xl">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Corporate Bookings
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <Image
                  src="/Aao_Logo_Final_Aao_Cab_White.jpg"
                  alt="AaoCab"
                  width={150}
                  height={50}
                  className="h-10 w-auto mb-4"
                />
                <p className="text-gray-400 text-sm">
                  Premium advance booking cab service for all your transportation needs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-white transition">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund" className="text-gray-400 hover:text-white transition">
                      Refund & Cancellation
                    </Link>
                  </li>
                  <li>
                    <Link href="/accessibility" className="text-gray-400 hover:text-white transition">
                      Accessibility
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+917890302302" className="text-gray-400 hover:text-white transition">
                      +91 7890 302 302
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <a href="https://wa.me/917890302302" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                      WhatsApp
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    <a href="https://www.facebook.com/aaocab" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>© {new Date().getFullYear()} AaoCab. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      <CookieConsent />
    </>
  );
}

function RentalTab({ onTabChange, initialData }: { onTabChange: (tab: string, data: ParsedBookingData) => void; initialData?: ParsedBookingData }) {
  const [rentalData, setRentalData] = useState({
    location: initialData?.location || initialData?.from || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    carType: initialData?.carType || "Sedan",
    passengers: initialData?.passengers || 1,
    name: "",
    phone: ""
  });

  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [showNLParsed, setShowNLParsed] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setRentalData(prev => ({
        ...prev,
        location: initialData.location || initialData.from || prev.location,
        date: initialData.date || prev.date,
        time: initialData.time || prev.time,
        carType: initialData.carType || prev.carType,
        passengers: initialData.passengers || prev.passengers
      }));
    }
  }, [initialData]);

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

  const handleLocationInput = (value: string) => {
    setRentalData({ ...rentalData, location: value });
    
    if (value.length > 0) {
      const filtered = indianCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (city: string) => {
    setRentalData({ ...rentalData, location: city });
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            
            const location = data.address.city || data.address.town || data.address.village || data.address.state || "Current Location";
            setRentalData({ ...rentalData, location });
            setGettingLocation(false);
          } catch (error) {
            console.error("Error getting location name:", error);
            setRentalData({ ...rentalData, location: "Current Location" });
            setGettingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter it manually.");
          setGettingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setGettingLocation(false);
    }
  };

  const parseNaturalLanguage = () => {
    const input = naturalLanguageInput.toLowerCase();
    const newData: ParsedBookingData = {};
    
    const locationPatterns = [
      /(?:in|at|from|location)\s+([a-z\s]+?)(?:\s+for|\s+on|\s+at\s+\d|\s+tomorrow|\s+today|$)/i,
      /(?:rental|cab|car)\s+(?:in|at|from)\s+([a-z\s]+?)(?:\s+for|\s+on|\s+at\s+\d|\s+tomorrow|\s+today|$)/i,
      /^([a-z\s]+?)\s+(?:rental|cab|car)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const location = match[1].trim().replace(/\s+/g, " ");
        if (location.length > 2) {
          newData.location = location;
          break;
        }
      }
    }
    
    const timeMatch = input.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] || "00";
      const meridiem = timeMatch[3].toLowerCase();
      
      if (meridiem === "pm" && hour !== 12) hour += 12;
      if (meridiem === "am" && hour === 12) hour = 0;
      
      newData.time = `${hour.toString().padStart(2, "0")}:${minute}`;
    }
    
    const dateKeywords = input.match(/\b(today|tomorrow)\b/i);
    if (dateKeywords) {
      const keyword = dateKeywords[1].toLowerCase();
      const today = new Date();
      
      if (keyword === "today") {
        newData.date = today.toISOString().split("T")[0];
      } else if (keyword === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        newData.date = tomorrow.toISOString().split("T")[0];
      }
    }
    
    const dateMatch = input.match(/(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const month = dateMatch[2].toLowerCase();
      const monthMap: { [key: string]: number } = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
      };
      
      const date = new Date();
      date.setMonth(monthMap[month]);
      date.setDate(day);
      
      if (date < new Date()) {
        date.setFullYear(date.getFullYear() + 1);
      }
      
      newData.date = date.toISOString().split("T")[0];
    }
    
    const passengerMatch = input.match(/(\d+)\s+(?:passenger|people|person|pax)/i);
    if (passengerMatch) {
      newData.passengers = Math.min(20, Math.max(1, parseInt(passengerMatch[1])));
    }
    
    setRentalData(prev => ({ ...prev, ...newData }));
    setShowNLParsed(true);
    setTimeout(() => setShowNLParsed(false), 3000);
  };

  const adjustPassengers = (change: number) => {
    const newValue = rentalData.passengers + change;
    if (newValue >= 1 && newValue <= 20) {
      setRentalData({ ...rentalData, passengers: newValue });
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
    setRentalData({ ...rentalData, phone: formatted });
  };

  const handleBookNow = () => {
    if (!rentalData.location || !rentalData.date || !rentalData.time || !rentalData.name || !rentalData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const message = encodeURIComponent(
      `Hi AaoCab — I would like to book a rental.\n\nLocation: ${rentalData.location}\nDate: ${rentalData.date}\nTime: ${rentalData.time}\nPassengers: ${rentalData.passengers}\nCar type: ${rentalData.carType}\n\nName: ${rentalData.name}\nContact: ${rentalData.phone}`
    );
    
    const whatsappUrl = `https://wa.me/917890302302?text=${message}`;
    const newWindow = window.open(whatsappUrl, "_blank");
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      window.location.href = `tel:+917890302302`;
    }
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
                Type naturally like: &quot;I need a rental in Delhi for 4 passengers tomorrow at 3 PM&quot;
              </p>
              <div className="relative">
                <Textarea
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  placeholder="I need a rental in... for... passengers"
                  className="min-h-[80px] resize-none border-indigo-300 focus:border-indigo-500 bg-white pr-12"
                />
                <Button
                  type="button"
                  onClick={toggleVoiceInput}
                  variant="ghost"
                  size="icon"
                  className={`absolute bottom-2 right-2 ${isListening ? "text-red-600 animate-pulse" : "text-indigo-600"}`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
              <Button
                onClick={parseNaturalLanguage}
                disabled={!naturalLanguageInput.trim()}
                className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Fill Form
              </Button>
              {showNLParsed && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Form auto-filled! Review and complete remaining details below.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-brand-primary/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Rental Booking</h2>
            <p className="text-gray-600">Rent a vehicle for your desired duration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 relative md:col-span-2">
              <Label htmlFor="rental-location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary" />
                Location
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="rental-location"
                    placeholder="Enter location"
                    value={rentalData.location}
                    onChange={(e) => handleLocationInput(e.target.value)}
                    onFocus={() => rentalData.location && setShowSuggestions(true)}
                    className="border-brand-primary/30 focus:border-brand-primary"
                    required
                  />
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {locationSuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLocation(city)}
                          className="w-full px-4 py-2 text-left hover:bg-indigo-50 transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental-date" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-primary" />
                Date
              </Label>
              <Input
                id="rental-date"
                type="date"
                value={rentalData.date}
                onChange={(e) => setRentalData({ ...rentalData, date: e.target.value })}
                className="border-brand-primary/30 focus:border-brand-primary"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" />
                Time
              </Label>
              <Input
                id="rental-time"
                type="time"
                value={rentalData.time}
                onChange={(e) => setRentalData({ ...rentalData, time: e.target.value })}
                className="border-brand-primary/30 focus:border-brand-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental-car-type" className="flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-primary" />
                Car Type
              </Label>
              <Select
                value={rentalData.carType}
                onValueChange={(value) => setRentalData({ ...rentalData, carType: value })}
              >
                <SelectTrigger className="border-brand-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Sedan XL">Sedan XL</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Innova">Innova</SelectItem>
                  <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                  <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                </SelectContent>
              </Select>
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
                  className="hover:bg-red-50 border-brand-primary/30"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="px-8 py-2 font-semibold bg-gray-50 border border-brand-primary/30 rounded-md min-w-[80px] text-center text-lg">
                  {rentalData.passengers}
                </div>
                <Button
                  type="button"
                  onClick={() => adjustPassengers(1)}
                  variant="outline"
                  size="icon"
                  className="hover:bg-green-50 border-brand-primary/30"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental-name">Your Name</Label>
              <Input
                id="rental-name"
                placeholder="Full name"
                value={rentalData.name}
                onChange={(e) => setRentalData({ ...rentalData, name: e.target.value })}
                className="border-brand-primary/30 focus:border-brand-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-primary" />
                Contact Number
              </Label>
              <Input
                id="rental-phone"
                type="tel"
                placeholder="9876 543 210"
                value={rentalData.phone}
                onChange={handlePhoneChange}
                className="border-brand-primary/30 focus:border-brand-primary"
                maxLength={12}
                required
              />
            </div>
          </div>

          <Button
            onClick={handleBookNow}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            size="lg"
          >
            Book Rental Now
          </Button>

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            Flexible rental durations • Quality vehicles • Trained drivers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PackageTab({ onTabChange, initialData }: { onTabChange: (tab: string, data: ParsedBookingData) => void; initialData?: ParsedBookingData }) {
  const [packageData, setPackageData] = useState({
    packageType: initialData?.packageType || "spiti",
    passengers: initialData?.passengers || 1,
    name: "",
    phone: ""
  });

  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [showNLParsed, setShowNLParsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setPackageData(prev => ({
        ...prev,
        packageType: initialData.packageType || prev.packageType,
        passengers: initialData.passengers || prev.passengers
      }));
    }
  }, [initialData]);

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

  const parseNaturalLanguage = () => {
    const input = naturalLanguageInput.toLowerCase();
    const newData: ParsedBookingData = {};
    
    if (input.includes("spiti") || input.includes("winter") || input.includes("expedition")) {
      newData.packageType = "spiti";
    } else if (input.includes("wedding") || input.includes("marriage")) {
      newData.packageType = "wedding";
    }
    
    const passengerMatch = input.match(/(\d+)\s+(?:passenger|people|person|pax)/i);
    if (passengerMatch) {
      newData.passengers = Math.min(20, Math.max(1, parseInt(passengerMatch[1])));
    }
    
    setPackageData(prev => ({ ...prev, ...newData }));
    setShowNLParsed(true);
    setTimeout(() => setShowNLParsed(false), 3000);
  };

  const adjustPassengers = (change: number) => {
    const newValue = packageData.passengers + change;
    if (newValue >= 1 && newValue <= 20) {
      setPackageData({ ...packageData, passengers: newValue });
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
    setPackageData({ ...packageData, phone: formatted });
  };

  const handleBookNow = () => {
    if (!packageData.name || !packageData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const packageName = packageData.packageType === "spiti" ? "Winter Spiti Expedition" : "Wedding Package";
    const message = encodeURIComponent(
      `Hi AaoCab — I would like to book the ${packageName}.\n\nPassengers: ${packageData.passengers}\n\nName: ${packageData.name}\nContact: ${packageData.phone}`
    );
    
    const whatsappUrl = `https://wa.me/917890302302?text=${message}`;
    const newWindow = window.open(whatsappUrl, "_blank");
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      window.location.href = `tel:+917890302302`;
    }
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
                Type naturally like: &quot;I want to book Spiti expedition for 4 people&quot;
              </p>
              <div className="relative">
                <Textarea
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  placeholder="I want to book... for... people"
                  className="min-h-[80px] resize-none border-indigo-300 focus:border-indigo-500 bg-white pr-12"
                />
                <Button
                  type="button"
                  onClick={toggleVoiceInput}
                  variant="ghost"
                  size="icon"
                  className={`absolute bottom-2 right-2 ${isListening ? "text-red-600 animate-pulse" : "text-indigo-600"}`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
              <Button
                onClick={parseNaturalLanguage}
                disabled={!naturalLanguageInput.trim()}
                className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Fill Form
              </Button>
              {showNLParsed && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Form auto-filled! Review and complete remaining details below.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-brand-primary/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Package Bookings</h2>
            <p className="text-gray-600">Choose from our special packages</p>
          </div>

          <div className="space-y-4">
            <div 
              onClick={() => setPackageData({ ...packageData, packageType: "spiti" })}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                packageData.packageType === "spiti"
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-white shadow-lg"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Winter Spiti Expedition</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Experience the breathtaking beauty of Spiti Valley in winter. Complete package with accommodation and guided tours.
                  </p>
                </div>
                <Award className="w-8 h-8 text-indigo-600 flex-shrink-0" />
              </div>
            </div>
            
            <div 
              onClick={() => setPackageData({ ...packageData, packageType: "wedding" })}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                packageData.packageType === "wedding"
                  ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-white shadow-lg"
                  : "border-gray-200 hover:border-yellow-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Wedding Package</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Special transportation solutions for your big day
                  </p>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm">
                    <p className="font-medium mb-1">Currently unavailable</p>
                    <p>Please call us for custom wedding transportation arrangements:</p>
                    <a 
                      href="tel:+917890302302" 
                      className="inline-flex items-center gap-2 text-yellow-900 font-semibold mt-2 hover:text-yellow-800"
                    >
                      <Phone className="w-4 h-4" />
                      +91 7890 302 302
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {packageData.packageType === "spiti" && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
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
                    className="hover:bg-red-50 border-brand-primary/30"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="px-8 py-2 font-semibold bg-gray-50 border border-brand-primary/30 rounded-md min-w-[80px] text-center text-lg">
                    {packageData.passengers}
                  </div>
                  <Button
                    type="button"
                    onClick={() => adjustPassengers(1)}
                    variant="outline"
                    size="icon"
                    className="hover:bg-green-50 border-brand-primary/30"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package-name">Your Name</Label>
                  <Input
                    id="package-name"
                    placeholder="Full name"
                    value={packageData.name}
                    onChange={(e) => setPackageData({ ...packageData, name: e.target.value })}
                    className="border-brand-primary/30 focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-primary" />
                    Contact Number
                  </Label>
                  <Input
                    id="package-phone"
                    type="tel"
                    placeholder="9876 543 210"
                    value={packageData.phone}
                    onChange={handlePhoneChange}
                    className="border-brand-primary/30 focus:border-brand-primary"
                    maxLength={12}
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                size="lg"
              >
                Book Winter Spiti Expedition
              </Button>

              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                All-inclusive package • Experienced guides • Premium accommodation
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
        active
          ? "bg-white text-brand-primary scale-105 shadow-xl"
          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
      }`}
    >
      {children}
    </button>
  );
}
