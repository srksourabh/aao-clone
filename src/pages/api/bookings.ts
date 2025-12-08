
import type { NextApiRequest, NextApiResponse } from "next";
import { BookingFormData } from "@/types/booking";

interface BookingRecord extends BookingFormData {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const bookings: BookingRecord[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const bookingData: BookingFormData = req.body;
    
    if (!bookingData.from || !bookingData.to || !bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBooking: BookingRecord = {
      ...bookingData,
      id: `BK${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    return res.status(201).json({ success: true, booking: newBooking });
  }

  if (req.method === "GET") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ bookings });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
