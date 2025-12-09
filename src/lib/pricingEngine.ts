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
  weather?: 'clear' | 'rain' | 'storm' | 'extreme_heat' | 'extreme_cold';
}

// Indian Festival/Holiday Calendar - Major festivals that affect pricing
const FESTIVAL_DATES = [
  // Diwali (varies, typically Oct-Nov)
  { name: 'Diwali', dates: ['2025-10-20', '2025-10-21', '2025-10-22', '2025-10-23', '2025-10-24'] },
  // Holi (varies, typically Feb-Mar)
  { name: 'Holi', dates: ['2025-03-14', '2025-03-15'] },
  // Durga Puja (varies, typically Sep-Oct)
  { name: 'Durga Puja', dates: ['2025-09-30', '2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04', '2025-10-05'] },
  // Christmas & New Year
  { name: 'Christmas', dates: ['2025-12-24', '2025-12-25', '2025-12-26'] },
  { name: 'New Year', dates: ['2025-12-31', '2026-01-01', '2026-01-02'] },
  // Eid (varies based on lunar calendar - approximate)
  { name: 'Eid', dates: ['2025-04-01', '2025-04-02', '2025-04-03'] },
  // Republic Day
  { name: 'Republic Day', dates: ['2025-01-26'] },
  // Independence Day
  { name: 'Independence Day', dates: ['2025-08-15'] },
];

// Check if date is a festival
const isFestivalDate = (dateString: string): { isFestival: boolean; festivalName?: string } => {
  for (const festival of FESTIVAL_DATES) {
    if (festival.dates.includes(dateString)) {
      return { isFestival: true, festivalName: festival.name };
    }
  }
  return { isFestival: false };
};

// Competitor pricing estimator (Ola, Uber, Rapido)
const estimateCompetitorPrices = (distanceKm: number, carType: string, isNight: boolean, isFestival: boolean) => {
  // Base rates are typically higher for competitors
  const competitorBaseRates: Record<string, { ola: number; uber: number; rapido: number }> = {
    "Sedan": { ola: 15.5, uber: 16, rapido: 14.5 },
    "Sedan XL": { ola: 17.5, uber: 18, rapido: 16.5 },
    "SUV": { ola: 24, uber: 25, rapido: 23 },
    "Innova": { ola: 28, uber: 29, rapido: 27 },
    "Tempo Traveller": { ola: 38, uber: 40, rapido: 36 },
    "Mini Bus": { ola: 55, uber: 57, rapido: 53 },
    "Custom": { ola: 20, uber: 21, rapido: 19 }
  };

  const rates = competitorBaseRates[carType] || { ola: 17, uber: 18, rapido: 16 };

  // Apply surcharges
  let olaSurge = 1.0;
  let uberSurge = 1.0;
  let rapidoSurge = 1.0;

  if (isNight) {
    olaSurge += 0.25; // 25% night surge for Ola
    uberSurge += 0.30; // 30% night surge for Uber
    rapidoSurge += 0.20; // 20% night surge for Rapido
  }

  if (isFestival) {
    olaSurge += 0.35; // 35% festival surge for Ola
    uberSurge += 0.40; // 40% festival surge for Uber
    rapidoSurge += 0.30; // 30% festival surge for Rapido
  }

  return {
    ola: Math.round(distanceKm * rates.ola * olaSurge * 1.05), // +5% GST
    uber: Math.round(distanceKm * rates.uber * uberSurge * 1.05),
    rapido: Math.round(distanceKm * rates.rapido * rapidoSurge * 1.05),
  };
};

export const calculateCompetitivePrice = (params: PriceParams) => {
  const { distanceKm, carType, tripTime, tripDate, tripType, hasPet, hasChild, hasPatient, weather } = params;

  // 1. Market Base Rates (Per KM) - Our competitive rates
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

  // 3. Festival Detection
  const festivalCheck = isFestivalDate(tripDate);
  const isFestival = festivalCheck.isFestival;

  // 4. Weather Conditions Surcharge
  let weatherSurcharge = 0;
  let weatherFactor = '';
  if (weather) {
    switch (weather) {
      case 'rain':
        weatherSurcharge = Math.round(distanceKm * 2); // ₹2/km extra
        weatherFactor = 'Rain conditions';
        break;
      case 'storm':
        weatherSurcharge = Math.round(distanceKm * 4); // ₹4/km extra
        weatherFactor = 'Storm conditions';
        break;
      case 'extreme_heat':
        weatherSurcharge = Math.round(distanceKm * 1.5); // ₹1.5/km extra
        weatherFactor = 'Extreme heat';
        break;
      case 'extreme_cold':
        weatherSurcharge = Math.round(distanceKm * 1.5); // ₹1.5/km extra
        weatherFactor = 'Extreme cold';
        break;
    }
  }

  // 5. Dynamic Pricing - Night Surge
  if (isNight) {
    ratePerKm *= 1.15; // 15% rate hike at night
  }

  // 6. Festival Surge (Lower than competitors but present)
  if (isFestival) {
    ratePerKm *= 1.20; // 20% festival surge (vs 35-40% for competitors)
  }

  // 7. Cost Components
  // Minimum chargeable distance (e.g., 15km for local, 80km for rental)
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

  // 8. Calculate Total
  let subTotal = baseFare + driverAllowance + petCharge + weatherSurcharge;
  const gst = Math.round(subTotal * 0.05); // 5% GST
  const finalTotal = subTotal + gst;

  // 9. Competitor Analysis - Get real competitor prices
  const competitorPrices = estimateCompetitorPrices(distanceKm, carType, isNight, isFestival);

  // Calculate average market price
  const avgMarketPrice = Math.round((competitorPrices.ola + competitorPrices.uber + competitorPrices.rapido) / 3);
  const ourSavings = Math.max(0, avgMarketPrice - finalTotal);

  // 10. Generate "Perks" List for the receipt
  const perks = [];
  if (hasChild) perks.push("Complimentary chocolates for kids");
  if (hasPatient) perks.push("Priority dispatch & careful driving");
  if (distanceKm > 100) perks.push("Free water bottles");

  // 11. Pricing breakdown for transparency
  const breakdown = {
    baseRate: `₹${ratePerKm.toFixed(2)}/km`,
    distance: `${distanceKm.toFixed(1)} km`,
    baseFare,
    driverAllowance,
    petCharge,
    weatherSurcharge,
    gst,
    ...(isNight && { nightSurge: '15%' }),
    ...(isFestival && { festivalSurge: `20% (${festivalCheck.festivalName})` }),
    ...(weatherFactor && { weatherCondition: weatherFactor }),
  };

  return {
    // Price details
    distanceKm: distanceKm.toFixed(1),
    durationMins: params.durationMins,
    ratePerKm: ratePerKm.toFixed(2),
    baseFare,
    driverAllowance,
    petCharge,
    weatherSurcharge,
    gst,
    finalTotal,

    // Competitive analysis
    competitorPrices,
    avgMarketPrice,
    ourPrice: finalTotal,
    savings: ourSavings,
    savingsPercent: avgMarketPrice > 0 ? Math.round((ourSavings / avgMarketPrice) * 100) : 0,

    // Special factors
    isNight,
    isFestival,
    festivalName: festivalCheck.festivalName,
    weatherCondition: weatherFactor,

    // Extras
    perks,
    breakdown,

    // Display message
    competitiveMessage: ourSavings > 0
      ? `You save ₹${ourSavings} compared to average market price!`
      : 'Best value advance booking service!',
  };
};