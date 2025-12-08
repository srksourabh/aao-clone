// src/lib/pricingEngine.ts

interface PriceParams {
  distanceKm: number;
  durationMins: number;
  carType: string;
  tripDate: string;
  tripTime: string;
  tripType: string;
}

export const calculateCompetitivePrice = (params: PriceParams) => {
  const { distanceKm, carType, tripTime, tripType } = params;

  // 1. Estimated Market Rates (Ola/Uber Intercity Benchmarks)
  const marketRates: Record<string, number> = {
    "Sedan": 14,
    "Sedan XL": 16,
    "SUV": 22,
    "Innova": 26,
    "Tempo Traveller": 36,
    "Mini Bus": 52,
    "Custom": 18
  };

  let ratePerKm = marketRates[carType] || 15;

  // 2. "AI" Factors
  // Night Surge (10 PM - 6 AM)
  const hour = parseInt(tripTime.split(':')[0]);
  const isNight = hour >= 22 || hour < 6;
  const nightSurge = isNight ? 250 : 0;

  // Round Trip Discount logic (if applicable)
  if (tripType === 'roundtrip') {
    ratePerKm *= 0.9; // Slightly cheaper per km for round trips
  }

  // 3. Cost Components
  const minDistance = tripType === 'rental' ? 80 : 20; // Minimum billable km
  const chargeableDistance = Math.max(distanceKm, minDistance);
  
  const baseFare = Math.round(chargeableDistance * ratePerKm);
  const driverAllowance = isNight ? 500 : 300; 
  
  // 4. Calculate Market Total
  let marketTotal = baseFare + driverAllowance + nightSurge;
  const gst = Math.round(marketTotal * 0.05); // 5% GST
  marketTotal += gst;

  // 5. The "AaoCab Advantage" (3% Cheaper than Market)
  const competitiveDiscount = Math.round(marketTotal * 0.03);
  const finalPrice = marketTotal - competitiveDiscount;

  return {
    distanceKm: distanceKm.toFixed(1),
    ratePerKm: ratePerKm.toFixed(2),
    baseFare,
    driverAllowance,
    nightSurge,
    gst,
    marketPrice: marketTotal,
    discount: competitiveDiscount,
    finalTotal: finalPrice
  };
};