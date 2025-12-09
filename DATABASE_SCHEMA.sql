-- AaoCab Booking System Database Schema
-- This SQL script creates the necessary tables in your Supabase database

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    -- Primary key
    id BIGSERIAL PRIMARY KEY,

    -- Customer Information
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),

    -- Trip Details
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    trip_date DATE NOT NULL,
    return_date DATE,
    trip_time TIME NOT NULL,
    trip_type VARCHAR(50) DEFAULT 'oneway', -- oneway, roundtrip, rental, package

    -- Vehicle & Passengers
    car_type VARCHAR(100) DEFAULT 'Sedan',
    passengers INTEGER DEFAULT 1,
    rental_package VARCHAR(50),
    waiting_time VARCHAR(10),

    -- Special Requirements
    baby_on_board BOOLEAN DEFAULT FALSE,
    patient_on_board BOOLEAN DEFAULT FALSE,
    pet_on_board BOOLEAN DEFAULT FALSE,

    -- Pricing Information (NEW)
    distance_km DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    price_metadata JSONB, -- Stores full pricing breakdown

    -- Status & Metadata
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, pending_confirmation, call_requested
    source VARCHAR(50) DEFAULT 'website', -- website, phone, whatsapp
    admin_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_trip_date ON bookings(trip_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for booking form)
CREATE POLICY "Allow public insert" ON bookings
FOR INSERT TO anon
WITH CHECK (true);

-- Create policy to allow authenticated users to view all bookings (for admin)
CREATE POLICY "Allow authenticated read" ON bookings
FOR SELECT TO authenticated
USING (true);

-- Create policy to allow authenticated users to update bookings (for admin)
CREATE POLICY "Allow authenticated update" ON bookings
FOR UPDATE TO authenticated
USING (true);

-- Sample query to view bookings
-- SELECT id, name, phone, from_location, to_location, trip_date, trip_time,
--        car_type, passengers, total_amount, status, created_at
-- FROM bookings
-- ORDER BY created_at DESC;
