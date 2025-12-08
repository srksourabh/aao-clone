import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar, Clock, Users, Car, Baby, Stethoscope, Dog, Phone, MapPin, Navigation, Sparkles, Plus, Minus, Mic, MicOff, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { BookingFormData, CAR_TYPES, ParsedBookingData } from "@/types/booking";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";

interface BookingFormProps {
  title: string;
  subtitle: string;
  isRoundTrip?: boolean;
  onTabChange: (tab: string, data: ParsedBookingData) => void;
  initialData?: ParsedBookingData;
}

export function BookingForm({ title, subtitle, isRoundTrip = false, onTabChange, initialData }: BookingFormProps) {
  const [formData, setFormData] = useState({
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
  });

  // UI States
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [priceData, setPriceData] = useState<any>(null);

  // Hook for Google Places (Using your existing hook)
  const {
    isReady,
    suggestions,
    getSuggestions,
    clearSuggestions
  } = useGooglePlacesAutocomplete();

  // Handle Location selection
  const handleLocationInput = (field: 'from' | 'to', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setActiveField(field);
    if (value.length > 2 && isReady) getSuggestions(value);
    else clearSuggestions();
  };

  const selectLocation = (field: 'from' | 'to', description: string) => {
    setFormData((prev) => ({ ...prev, [field]: description }));
    clearSuggestions();
    setActiveField(null);
  };

  const adjustPassengers = (change: number) => {
    const newValue = formData.passengers + change;
    if (newValue >= 1 && newValue <= 20) setFormData({ ...formData, passengers: newValue });
  };

  // --- STEP 1: CALCULATE PRICE ---
  const handleGetEstimate = async () => {
    if (!formData.from || !formData.to || !formData.date || !formData.time) {
      alert("Please fill in locations, date, and time.");
      return;
    }
    
    setIsCalculating(true);
    try {
      const res = await fetch('/api/get-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tripType: isRoundTrip ? 'roundtrip' : 'oneway'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPriceData(data.quote);
        setShowPriceModal(true);
      }
    } catch (e) {
      alert("Error calculating price.");
    } finally {
      setIsCalculating(false);
    }
  };

  // --- STEP 2: CONFIRM & SAVE TO SUPABASE ---
  const handleConfirm = async () => {
    if (!formData.name || !formData.phone) {
      alert("Please enter Name and Phone to book.");
      return;
    }

    setIsBooking(true);
    try {
      const res = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          quote: priceData,
          tripType: isRoundTrip ? 'roundtrip' : 'oneway'
        })
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Booking Successful! Our team will contact you shortly.");
        setShowPriceModal(false);
        // Reset form or redirect here
      } else {
        alert("Booking failed: " + data.error);
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-brand-primary/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FROM FIELD */}
            <div className="space-y-2 relative">
              <Label>Pickup Location</Label>
              <div className="relative">
                <Input 
                  value={formData.from}
                  onChange={(e) => handleLocationInput('from', e.target.value)}
                  placeholder="Enter pickup city/area"
                />
                {activeField === 'from' && suggestions.length > 0 && (
                  <div className="absolute z-50 bg-white border rounded shadow-lg w-full mt-1">
                    {suggestions.map((s, i) => (
                      <div key={i} onClick={() => selectLocation('from', s.description)} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TO FIELD */}
            <div className="space-y-2 relative">
              <Label>Drop Location</Label>
              <div className="relative">
                <Input 
                  value={formData.to}
                  onChange={(e) => handleLocationInput('to', e.target.value)}
                  placeholder="Enter drop city/area"
                />
                {activeField === 'to' && suggestions.length > 0 && (
                  <div className="absolute z-50 bg-white border rounded shadow-lg w-full mt-1">
                    {suggestions.map((s, i) => (
                      <div key={i} onClick={() => selectLocation('to', s.description)} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Passengers</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => adjustPassengers(-1)}><Minus className="w-4 h-4"/></Button>
                <div className="flex-1 text-center font-bold">{formData.passengers}</div>
                <Button type="button" variant="outline" size="icon" onClick={() => adjustPassengers(1)}><Plus className="w-4 h-4"/></Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Car Type</Label>
              <Select value={formData.carType} onValueChange={(val) => setFormData({...formData, carType: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CAR_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGetEstimate} 
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-6 text-lg"
            disabled={isCalculating}
          >
            {isCalculating ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="w-5 h-5 mr-2"/>}
            Get Price Estimate
          </Button>
        </CardContent>
      </Card>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={showPriceModal} onOpenChange={setShowPriceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-brand-primary">Review Your Trip</DialogTitle>
            <DialogDescription>Competitive pricing calculated just for you.</DialogDescription>
          </DialogHeader>

          {priceData && (
            <div className="space-y-4">
              {/* Price Breakdown Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Total Distance</span>
                  <span className="font-semibold">{priceData.distanceKm} km</span>
                </div>
                <div className="border-b my-2"></div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Base Fare</span><span>₹{priceData.baseFare}</span></div>
                  <div className="flex justify-between"><span>Driver Allowance</span><span>₹{priceData.driverAllowance}</span></div>
                  {priceData.nightSurge > 0 && (
                    <div className="flex justify-between text-orange-600"><span>Night Charge</span><span>+₹{priceData.nightSurge}</span></div>
                  )}
                  <div className="flex justify-between"><span>GST (5%)</span><span>₹{priceData.gst}</span></div>
                  <div className="flex justify-between text-green-600 font-bold"><span>AaoCab Discount</span><span>-₹{priceData.discount}</span></div>
                </div>
                <div className="border-t border-slate-300 mt-3 pt-2 flex justify-between text-lg font-bold text-brand-primary">
                  <span>Total</span>
                  <span>₹{priceData.finalTotal}</span>
                </div>
              </div>

              {/* User Details Inputs */}
              <div className="space-y-3">
                <Label>Enter Details to Confirm</Label>
                <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPriceModal(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 w-full" onClick={handleConfirm} disabled={isBooking}>
              {isBooking ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle2 className="w-4 h-4 mr-2"/>}
              Accept & Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}