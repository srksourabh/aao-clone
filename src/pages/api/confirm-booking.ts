import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { formData, quote, tripType } = req.body;

  try {
    // 1. Insert into your specific 'bookings' table schema
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          // Existing columns from your schema
          name: formData.name,
          phone: formData.phone,
          // email: formData.email, // Uncomment if you collect email
          from_location: formData.from,
          to_location: formData.to,
          trip_date: formData.date,
          trip_time: formData.time,
          passengers: parseInt(formData.passengers),
          car_type: formData.carType,
          baby_on_board: formData.babyOnBoard,
          patient_on_board: formData.patientOnBoard,
          pet_on_board: formData.petOnBoard,
          status: 'pending',
          source: 'website',
          
          // New columns added in Phase 1
          trip_type: tripType,
          distance_km: quote.distanceKm,
          total_amount: quote.finalTotal,
          price_metadata: quote // Stores the full breakdown JSON
        }
      ])
      .select();

    if (error) throw error;

    // 2. Trigger n8n Webhook (Emails/WhatsApp)
    if (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      // We don't await this to keep the UI snappy
      fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "NEW_BOOKING",
          bookingId: data[0]?.id,
          ...req.body
        }),
      }).catch(err => console.error("Webhook failed", err));
    }

    res.status(200).json({ success: true, bookingId: data[0]?.id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Supabase Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}