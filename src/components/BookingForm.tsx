import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Mic, MicOff, CheckCircle2, User, Phone, Mail, Calendar, Clock, MapPin, Car, Snowflake, Mountain, Landmark, X } from 'lucide-react';
import LocationInput from './LocationInput';

// --- SUPABASE SETUP ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CAR_TYPES = ['Sedan', 'Sedan XL', 'SUV', 'Innova', 'Tempo Traveller', 'Mini Bus'];
const RENTAL_PACKAGES = [
  '4 Hrs / 40 km',
  '5 Hrs / 50 km',
  '6 Hrs / 60 km',
  '7 Hrs / 70 km',
  '8 Hrs / 80 km',
  '9 Hrs / 90 km',
  '10 Hrs / 100 km'
];

// Named Export
export function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // --- TRIP TYPE STATE ---
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'rental' | 'package'>('oneway');

  // --- MODAL STATE (For Pricing) ---
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<any>(null);

  // --- NLP STATE ---
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showNLParsed, setShowNLParsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    from_location: '', 
    to_location: '', 
    trip_date: '', 
    return_date: '', 
    trip_time: '10:00',
    admin_notes: '',
    passengers: 1,
    baby_on_board: false, patient_on_board: false, pet_on_board: false,
    car_type: 'Sedan',
    rental_package: '8 Hrs / 80 km',
    waiting_time: '0' 
  });

  // --- TIME SLOTS ---
  const timeOptions = useMemo(() => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  }, []);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const updateLocation = (field: 'from_location' | 'to_location', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePassengers = (increment: number) => {
    setFormData(prev => ({
      ...prev,
      passengers: Math.max(1, Math.min(20, prev.passengers + increment))
    }));
  };

  // --- 🧠 INTELLIGENT AGENT ---
  const parseNaturalLanguage = () => {
    const input = naturalLanguageInput.toLowerCase();
    const newData = { ...formData };
    
    // 1. Locations
    const fromToMatch = input.match(/from\s+(.*?)\s+to\s+(.*?)(?:\s+at|\s+on|\s+for|\s+tomorrow|\s+today|$)/i);
    if (fromToMatch) {
      if (fromToMatch[1]) newData.from_location = fromToMatch[1].trim();
      if (fromToMatch[2]) newData.to_location = fromToMatch[2].trim();
    }
    // 2. Date/Time
    const today = new Date();
    if (input.includes("tomorrow")) {
      const tmrw = new Date(today);
      tmrw.setDate(today.getDate() + 1);
      newData.trip_date = tmrw.toISOString().split("T")[0];
    } else if (input.includes("today")) {
      newData.trip_date = today.toISOString().split("T")[0];
    }
    // 3. Trip Type Detection
    if (input.includes("round") || input.includes("return")) setTripType('roundtrip');
    if (input.includes("rental")) setTripType('rental');
    
    setFormData(newData);
    setRefreshKey(prev => prev + 1); 
    setShowNLParsed(true);
    setTimeout(() => setShowNLParsed(false), 3000);
  };

  const toggleVoiceInput = () => {
     setIsListening(!isListening);
     if(!isListening) {
         setTimeout(() => {
             setIsListening(false);
             setNaturalLanguageInput("Round Trip from Kolkata to Durgapur tomorrow with 2 hours waiting"); 
         }, 2000);
     }
  };

  // --- PRICING LOGIC ---
  const handleCalculatePrice = (e: any) => {
    e.preventDefault();
    
    if(!formData.from_location || !formData.trip_date || !formData.name || !formData.phone) {
        alert("Please fill in Locations, Date, Name, and Phone number to get a quote.");
        return;
    }
    if ((tripType === 'oneway' || tripType === 'roundtrip') && !formData.to_location) {
        alert("Please select a Drop/Visit location."); 
        return; 
    }

    // Mock Calculation
    let basePrice = tripType === 'rental' ? 1800 : 2500; 
    if(tripType === 'roundtrip') basePrice = 4500;
    
    const gst = Math.round(basePrice * 0.05);
    const total = basePrice + gst;

    setCalculatedPrice({
        base: basePrice,
        gst: gst,
        total: total,
        distance: "Approx 140 km", 
        duration: "3 hrs 20 mins"
    });

    setShowQuoteModal(true);
  };

  // --- FINAL DB SUBMISSION ---
  const handleFinalBooking = async (actionType: 'book' | 'call') => {
    setLoading(true);
    setStatus(null);
    setShowQuoteModal(false); 

    const finalData = { ...formData };
    finalData.trip_type = tripType; 

    // Defaults for Rental/Package
    if (tripType === 'rental') {
      finalData.to_location = `RENTAL: ${formData.rental_package}`; 
      finalData.admin_notes = `Rental. ${formData.admin_notes}`;
    }
    if (tripType === 'package') {
       finalData.to_location = 'PACKAGE REQUEST';
       finalData.passengers = 1;
       finalData.car_type = 'Sedan';
       finalData.admin_notes = `Package Inquiry. ${formData.admin_notes}`;
    }
    
    finalData.admin_notes += ` | Quote: ₹${calculatedPrice?.total || 'N/A'} | Action: ${actionType.toUpperCase()}`;

    const statusVal = actionType === 'book' ? 'pending_confirmation' : 'call_requested';

    try {
      if(tripType === 'roundtrip') {
          finalData.admin_notes += ` | Waiting Time: ${formData.waiting_time} Hours`;
      }

      const { error } = await supabase.from('bookings').insert([{
        ...finalData,
        status: statusVal
      }]);

      if (error) throw error;
      
      setStatus('Success');
      setFormData({
        name: '', phone: '', email: '',
        from_location: '', to_location: '',
        trip_date: '', return_date: '', trip_time: '10:00',
        passengers: 1, baby_on_board: false, patient_on_board: false, pet_on_board: false,
        admin_notes: '', car_type: 'Sedan', rental_package: '8 Hrs / 80 km', waiting_time: '0'
      });
      setNaturalLanguageInput('');
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const sectionTitleStyle = {
    color: '#4c1d95', fontWeight: 'bold', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px'
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '14px', outline: 'none'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* REMOVED: Duplicate floating navigation buttons - now handled by parent page */}

      {/* 2. PURPLE HEADER CARD (Clean, No Tabs Inside) */}
      <div style={{ backgroundColor: '#6d28d9', color: 'white', borderRadius: '16px 16px 0 0', boxShadow: '0 4px 20px rgba(109, 40, 217, 0.3)', overflow: 'hidden' }}>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>Book Your Ride</h1>
          <p style={{ opacity: 0.9, marginTop: '5px' }}>Reliable service for you, your family, and your pets.</p>
        </div>
      </div>

      {/* 3. MAIN BODY */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '0 0 16px 16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>

        {tripType === 'package' ? (
          // ================= PACKAGE UI =================
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ color: '#4c1d95', fontWeight: '800', marginBottom: '25px' }}>Seasonal Packages</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
               <div style={{ backgroundColor: '#f5f3ff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                  <Snowflake size={32} color="#7c3aed" style={{ marginBottom: '10px' }} />
                  <h3 style={{ margin: '0 0 10px 0', color: '#5b21b6', fontSize: '18px' }}>Winter Expedition</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>Special winter tours for physiotherapy groups.</p>
               </div>
               <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <Mountain size={32} color="#059669" style={{ marginBottom: '10px' }} />
                  <h3 style={{ margin: '0 0 10px 0', color: '#065f46', fontSize: '18px' }}>Hill Station</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>Weekend trips to nearest hill stations.</p>
               </div>
               <div style={{ backgroundColor: '#fff7ed', padding: '20px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <Landmark size={32} color="#ea580c" style={{ marginBottom: '10px' }} />
                  <h3 style={{ margin: '0 0 10px 0', color: '#9a3412', fontSize: '18px' }}>Heritage Tour</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>Comfortable tours to historical sites.</p>
               </div>
            </div>

             <div style={{ backgroundColor: '#f0f9ff', padding: '30px', borderRadius: '16px', border: '2px dashed #bae6fd', display: 'inline-block' }}>
               <Phone size={36} color="#0284c7" style={{ marginBottom: '15px' }} />
               <h3 style={{ margin: '0 0 10px 0', color: '#075985', fontSize: '20px' }}>Customize Your Package</h3>
               <p style={{ fontSize: '15px', color: '#444', marginBottom: '15px' }}>Call us to plan your perfect trip:</p>
               <a href="tel:+917890302302" style={{ fontSize: '28px', fontWeight: '900', color: '#0284c7', textDecoration: 'none' }}>+91 7890 302 302</a>
            </div>
          </div>
        ) : (
          // ================= BOOKING FORM =================
          <>
            {/* SMART AGENT */}
            <div style={{ marginBottom: '30px', background: 'linear-gradient(to bottom right, #eef2ff, #fdf4ff)', border: '2px solid #c7d2fe', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Sparkles size={20} color="#4f46e5" />
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>Smart Booking Agent</h3>
              </div>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  placeholder="e.g. Round Trip from Kolkata to Durgapur tomorrow with 2 hours waiting"
                  style={{ width: '100%', minHeight: '60px', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #c7d2fe', fontSize: '14px', resize: 'none' }}
                />
                <button type="button" onClick={toggleVoiceInput} style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: isListening ? '#dc2626' : '#4f46e5' }}>
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                 <button onClick={parseNaturalLanguage} type="button" style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Auto-Fill</button>
              </div>
              {showNLParsed && <div style={{ marginTop: '10px', color: '#166534', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={16} /> Details updated!</div>}
            </div>

            <form onSubmit={handleCalculatePrice}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                
                {/* LOCATION COLUMN */}
                <div style={{ backgroundColor: '#f5f3ff', padding: '20px', borderRadius: '12px' }}>
                  <div style={sectionTitleStyle}><MapPin size={18}/> {tripType === 'rental' ? 'Pickup Details' : 'Trip Route'}</div>
                  <div style={{ marginBottom: '15px' }}>
                     <LocationInput key={`pickup-${refreshKey}`} label="Pickup Location" defaultValue={formData.from_location} onLocationSelect={(addr) => updateLocation('from_location', addr)} />
                  </div>
                  
                  {tripType === 'rental' ? (
                    <div>
                       <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>Select Package</label>
                       <div style={{ position: 'relative' }}>
                         <Clock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                         <select name="rental_package" value={formData.rental_package} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '35px' }}>
                            {RENTAL_PACKAGES.map(p => <option key={p} value={p}>{p}</option>)}
                         </select>
                       </div>
                    </div>
                  ) : (
                    <div>
                       <LocationInput 
                          key={`drop-${refreshKey}`} 
                          label={tripType === 'roundtrip' ? "Visit Location" : "Drop Location"} 
                          defaultValue={formData.to_location} 
                          onLocationSelect={(addr) => updateLocation('to_location', addr)} 
                       />
                    </div>
                  )}
                </div>

                {/* SCHEDULE COLUMN */}
                <div style={{ backgroundColor: '#fff7ed', padding: '20px', borderRadius: '12px' }}>
                  <div style={sectionTitleStyle}><Calendar size={18}/> Schedule</div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#555' }}>
                       {tripType === 'roundtrip' ? 'Start Date' : 'Trip Date'}
                    </label>
                    <input type="date" name="trip_date" value={formData.trip_date} onChange={handleChange} style={inputStyle} required />
                  </div>

                  {tripType === 'roundtrip' && (
                    <>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#555' }}>Return Date</label>
                        <input type="date" name="return_date" value={formData.return_date} onChange={handleChange} style={inputStyle} />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#555' }}>Waiting Time (Approx)</label>
                        <select name="waiting_time" value={formData.waiting_time} onChange={handleChange} style={inputStyle}>
                            <option value="0">No Waiting</option>
                            <option value="1">1 Hour</option>
                            <option value="2">2 Hours</option>
                            <option value="4">4 Hours</option>
                            <option value="6">6 Hours</option>
                            <option value="8">8 Hours</option>
                            <option value="12">12+ Hours</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#555' }}>Pickup Time</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                      <select name="trip_time" value={formData.trip_time} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '35px' }}>
                        {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* VEHICLE & CONTACT (Combined) */}
              {tripType !== 'rental' && tripType !== 'package' && (
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#faf5ff' }}>
                    <div style={sectionTitleStyle}>👥 Vehicle & Passengers</div>
                    {/* Car Type */}
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        {CAR_TYPES.map((type) => (
                          <label key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '8px', border: formData.car_type === type ? '2px solid #6d28d9' : '1px solid #e5e7eb', backgroundColor: formData.car_type === type ? '#f5f3ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <input type="radio" name="car_type" value={type} checked={formData.car_type === type} onChange={handleChange} style={{ display: 'none' }} />
                            <Car size={24} color={formData.car_type === type ? '#6d28d9' : '#9ca3af'} />
                            <span style={{ marginTop: '5px', fontSize: '12px', fontWeight: '600', color: formData.car_type === type ? '#6d28d9' : '#374151' }}>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Passenger Counter */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Total Passengers</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <button type="button" onClick={() => updatePassengers(-1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontSize: '18px' }}>-</button>
                          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#6d28d9', minWidth: '20px', textAlign: 'center' }}>{formData.passengers}</span>
                          <button type="button" onClick={() => updatePassengers(1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontSize: '18px' }}>+</button>
                      </div>
                    </div>
                    {/* Checkboxes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.baby_on_board ? '#eff6ff' : 'white' }}>
                        <input type="checkbox" name="baby_on_board" checked={formData.baby_on_board} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#6d28d9' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Children</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.patient_on_board ? '#fff1f2' : 'white' }}>
                        <input type="checkbox" name="patient_on_board" checked={formData.patient_on_board} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#e11d48' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Patient</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.pet_on_board ? '#f0fdf4' : 'white' }}>
                        <input type="checkbox" name="pet_on_board" checked={formData.pet_on_board} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#16a34a' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Pet</span>
                      </label>
                    </div>
                  </div>
              )}

              {/* RENTAL VEHICLE SECTION */}
              {tripType === 'rental' && (
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#faf5ff' }}>
                    <div style={sectionTitleStyle}><Car size={18}/> Vehicle Type</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                      {CAR_TYPES.map((type) => (
                        <label key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '8px', border: formData.car_type === type ? '2px solid #6d28d9' : '1px solid #e5e7eb', backgroundColor: formData.car_type === type ? '#f5f3ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <input type="radio" name="car_type" value={type} checked={formData.car_type === type} onChange={handleChange} style={{ display: 'none' }} />
                          <Car size={24} color={formData.car_type === type ? '#6d28d9' : '#9ca3af'} />
                          <span style={{ marginTop: '5px', fontSize: '12px', fontWeight: '600', color: formData.car_type === type ? '#6d28d9' : '#374151' }}>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
              )}

              {/* CONTACT DETAILS */}
              <div style={{ backgroundColor: '#f0f9ff', padding: '25px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #bae6fd' }}>
                <div style={{ ...sectionTitleStyle, color: '#0369a1' }}><Phone size={18}/> Contact Details (Required)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                   <div><input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} style={inputStyle} required /></div>
                   <div><input name="phone" type="tel" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} style={inputStyle} required /></div>
                   <div style={{ gridColumn: '1 / -1' }}><input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={inputStyle} required /></div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#6d28d9', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(109, 40, 217, 0.25)' }}>
                View Price & Plan
              </button>
            </form>
          </>
        )}
      </div>

      {/* ================= MODAL: SYNOPSIS & PRICE ================= */}
      {showQuoteModal && calculatedPrice && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
           <div style={{ backgroundColor: 'white', width: '90%', maxWidth: '500px', borderRadius: '16px', padding: '0', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
              {/* Header */}
              <div style={{ backgroundColor: '#6d28d9', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ margin: 0, fontSize: '18px' }}>Proposed Plan</h3>
                 <button onClick={() => setShowQuoteModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24}/></button>
              </div>
              
              <div style={{ padding: '25px' }}>
                 {/* Synopsis */}
                 <div style={{ marginBottom: '20px', color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
                    <strong>Trip Synopsis:</strong><br/>
                    You wish to travel from <strong>{formData.from_location}</strong> 
                    {tripType !== 'rental' && <> to <strong>{formData.to_location}</strong></>} 
                    {tripType === 'rental' && <> using the <strong>{formData.rental_package}</strong> package</>} 
                    on <strong>{formData.trip_date}</strong> at {formData.trip_time}. 
                    {tripType !== 'rental' && <> Traveling with <strong>{formData.passengers} people</strong>.</>}
                    {formData.pet_on_board && " (Pets Included)"}
                 </div>

                 {/* Price Breakup */}
                 <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <span>Base Fare ({calculatedPrice.distance})</span>
                        <span>₹{calculatedPrice.base}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <span>GST (5%)</span>
                        <span>₹{calculatedPrice.gst}</span>
                    </div>
                    <div style={{ borderTop: '2px dashed #d1d5db', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#4c1d95' }}>
                        <span>Total Estimate</span>
                        <span>₹{calculatedPrice.total}</span>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' }}>
                    <button onClick={() => handleFinalBooking('call')} style={{ padding: '12px', border: '1px solid #6d28d9', backgroundColor: 'white', color: '#6d28d9', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Call Me</button>
                    <button onClick={() => handleFinalBooking('book')} style={{ padding: '12px', border: 'none', backgroundColor: '#6d28d9', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Accept & Book</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* SUCCESS/ERROR TOAST */}
      {(status === 'Success' || (status && status.includes('Error'))) && (
        <div style={{ 
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
            backgroundColor: status === 'Success' ? '#065f46' : '#991b1b', color: 'white', 
            padding: '15px 30px', borderRadius: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', fontWeight: 'bold', zIndex: 2000 
        }}>
            {status === 'Success' ? '✅ Request Sent Successfully!' : `❌ ${status}`}
        </div>
      )}

    </div>
  );
}

// Default Export (Fixes 'import BookingForm' error)
export default BookingForm;
