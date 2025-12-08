import type { NextApiRequest, NextApiResponse } from "next";
import { calculateCompetitivePrice } from "@/lib/pricingEngine";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { from, to, carType, date, time, tripType } = req.body;

  try {
    // 1. Get Distance (Using Google Matrix API)
    // Ensure GOOGLE_MAPS_SERVER_KEY is in your .env.local
    const googleUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&key=${process.env.GOOGLE_MAPS_SERVER_KEY}`;
    
    const googleRes = await fetch(googleUrl);
    const googleData = await googleRes.json();

    let distanceKm = 0;
    let durationMins = 0;

    if (googleData.status === "OK" && googleData.rows[0].elements[0].status === "OK") {
      distanceKm = googleData.rows[0].elements[0].distance.value / 1000;
      durationMins = Math.round(googleData.rows[0].elements[0].duration.value / 60);
    } else {
      // Fallback if API fails or keys aren't set up yet
      console.warn("Google Matrix API failed, using fallback distance.");
      distanceKm = 45; // Mock distance
      durationMins = 60;
    }

    // 2. Run Pricing AI
    const quote = calculateCompetitivePrice({
      distanceKm,
      durationMins,
      carType,
      tripDate: date,
      tripTime: time,
      tripType
    });

    res.status(200).json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ success: false, error: "Calculation failed" });
  }
}