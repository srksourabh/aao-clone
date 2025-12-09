
import type { NextApiRequest, NextApiResponse } from "next";
import { BookingFormData } from "@/types/booking";
import { supabase } from "@/lib/supabase";
import { env } from "@/env.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BookingRecord extends BookingFormData {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const bookingData: BookingFormData = req.body;
    
    if (!bookingData.from || !bookingData.to || !bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBooking = {
      id: `BK${Date.now()}`,
      from: bookingData.from,
      to: bookingData.to,
      date: bookingData.date,
      time: bookingData.time,
      passengers: bookingData.passengers,
      car_type: bookingData.carType,
      baby_on_board: bookingData.babyOnBoard,
      patient_on_board: bookingData.patientOnBoard,
      pet_on_board: bookingData.petOnBoard,
      name: bookingData.name,
      phone: bookingData.phone,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([newBooking])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: "Failed to create booking", details: error.message });
    }

    return res.status(201).json({ success: true, booking: data });
  }

  if (req.method === "GET") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (token !== env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
    }

    return res.status(200).json({ bookings });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
