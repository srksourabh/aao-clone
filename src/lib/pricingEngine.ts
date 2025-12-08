// src/lib/pricingEngine.ts

interface PriceParams {
  distanceKm: number;
  durationMins: number;
  carType: string;
  tripDate: string;
  tripTime: string;
  tripType: string;
  hasPet: boolean;
  hasChild: boolean;
  hasPatient: boolean;
}

export const calculateCompetitivePrice = (params: PriceParams) => {
  const { distanceKm, carType, tripTime, tripType, hasPet, hasChild, hasPatient } = params;

  // 1. Market Base Rates (Per KM)
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

  // 2. Temporal Logic (Night vs Day)
  const hour = parseInt(tripTime.split(':')[0]);
  const isNight = hour >= 22 || hour < 6;
  
  // Night Surge (Rate multiplier)
  if (isNight) {
    ratePerKm *= 1.15; // 15% rate hike at night
  }

  // 3. Cost Components
  // Minimum chargeable distance (e.g., 10km for local, 80km for rental)
  const minDistance = tripType === 'rental' ? 80 : 15;
  const chargeableDistance = Math.max(distanceKm, minDistance);
  
  const baseFare = Math.round(chargeableDistance * ratePerKm);
  
  // DRIVER ALLOWANCE LOGIC: Only charge at night
  // Day: 0, Night: 300 (or 500 for very long trips)
  let driverAllowance = 0;
  if (isNight) {
    driverAllowance = distanceKm > 250 ? 500 : 300;
  }

  // PET LOGIC: Fixed charge
  const petCharge = hasPet ? 600 : 0;

  // 4. Calculate Total
  let subTotal = baseFare + driverAllowance + petCharge;
  const gst = Math.round(subTotal * 0.05); // 5% GST
  let finalTotal = subTotal + gst;

  // 5. The "AaoCab Advantage" (Competitive Undercutting)
  // We calculate a theoretical "Market Price" (what Ola/Uber might charge) to show savings
  // Market usually charges day driver allowance or higher surges
  const theoreticalMarketPrice = Math.round(finalTotal * 1.12); // Assume market is ~12% higher
  const discount = theoreticalMarketPrice - finalTotal;

  // 6. Generate "Perks" List for the receipt
  const perks = [];
  if (hasChild) perks.push("complimentary_chocolates");
  if (hasPatient) perks.push("priority_dispatch");

  return {
    distanceKm: distanceKm.toFixed(1),
    ratePerKm: ratePerKm.toFixed(2),
    baseFare,
    driverAllowance, // Will be 0 during day
    petCharge,
    gst,
    marketPrice: theoreticalMarketPrice,
    discount,
    finalTotal,
    perks
  };
};