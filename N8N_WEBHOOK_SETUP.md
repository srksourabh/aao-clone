
# n8n Webhook Integration Guide

## Overview
AaoCab booking form can automatically send all booking data to your n8n workflow via webhook. This allows you to:
- Store bookings in a database
- Send notifications to your team
- Trigger automated workflows
- Integrate with other services
- Generate analytics and reports

## Setup Instructions

### Step 1: Create n8n Webhook
1. Log in to your n8n instance
2. Create a new workflow
3. Add a "Webhook" trigger node
4. Set method to `POST`
5. Copy the webhook URL (e.g., `https://your-n8n-instance.com/webhook/aaocab-bookings`)

### Step 2: Configure Environment Variable
1. Open your `.env.local` file
2. Add the webhook URL:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/aaocab-bookings
   ```
3. Save the file
4. Restart your Next.js development server

### Step 3: Test Integration
1. Fill out the booking form on your website
2. Click "Book Now"
3. Check your n8n workflow - you should see the webhook trigger with booking data

## Webhook Payload Structure

The booking form sends a comprehensive JSON payload with the following structure:

```json
{
  "timestamp": "2025-11-19T17:30:00.000Z",
  "tripType": "One-Way",
  "bookingDetails": {
    "from": "Delhi Airport",
    "to": "Shimla",
    "date": "2025-11-20",
    "time": "15:00",
    "passengers": 4,
    "carType": "SUV"
  },
  "customerDetails": {
    "name": "John Doe",
    "phone": "9876 543 210"
  },
  "specialRequirements": {
    "babyOnBoard": false,
    "patientOnBoard": false,
    "petOnBoard": true
  },
  "locationDetails": {
    "pickup": {
      "address": "Indira Gandhi International Airport, New Delhi, Delhi, India",
      "latitude": 28.5562,
      "longitude": 77.1000,
      "placeId": "ChIJQbc4YKX_DDkRq6k0TKZ2VX0"
    },
    "drop": {
      "address": "Shimla, Himachal Pradesh, India",
      "latitude": 31.1048,
      "longitude": 77.1734,
      "placeId": "ChIJK_WbpxWvBDkRUFN_7VmPZos"
    }
  },
  "metadata": {
    "source": "AaoCab Website",
    "userAgent": "Mozilla/5.0...",
    "formVersion": "1.0"
  }
}
```

## Field Descriptions

### bookingDetails
- **from**: User-entered pickup location text
- **to**: User-entered drop location text
- **date**: Booking date (YYYY-MM-DD format)
- **time**: Booking time (HH:MM 24-hour format)
- **passengers**: Number of passengers (1-20)
- **carType**: Selected vehicle type (Sedan, SUV, etc.)

### customerDetails
- **name**: Customer's full name
- **phone**: Formatted phone number

### specialRequirements
- **babyOnBoard**: Boolean - Baby seat required
- **patientOnBoard**: Boolean - Medical assistance needed
- **petOnBoard**: Boolean - Pet-friendly vehicle needed

### locationDetails
- **pickup**: Precise GPS coordinates and address for pickup (if user selected from autocomplete)
- **drop**: Precise GPS coordinates and address for drop-off (if user selected from autocomplete)
- Each location includes:
  - **address**: Full formatted address
  - **latitude**: GPS latitude coordinate
  - **longitude**: GPS longitude coordinate
  - **placeId**: Google Places API place identifier

### metadata
- **timestamp**: ISO 8601 timestamp of submission
- **source**: Always "AaoCab Website"
- **userAgent**: Browser/device information
- **formVersion**: Form version for tracking changes

## Sample n8n Workflow Ideas

### 1. Save to Database
```
Webhook → Set Node (format data) → Postgres/MySQL Node
```

### 2. Send Email Notification
```
Webhook → Set Node → Send Email Node (Gmail/SMTP)
```

### 3. Update Google Sheets
```
Webhook → Google Sheets Node (Append Row)
```

### 4. Multi-Channel Notifications
```
Webhook → 
  ├─ Send Email
  ├─ Slack Notification
  └─ SMS via Twilio
```

### 5. CRM Integration
```
Webhook → HTTP Request Node → Your CRM API
```

## Error Handling

The booking form will:
- ✅ Continue to WhatsApp even if webhook fails
- ✅ Log errors to browser console for debugging
- ✅ Skip webhook if URL is not configured
- ✅ Never block user experience due to webhook issues

## Testing

To test without an n8n instance:
1. Use a service like webhook.site to get a test URL
2. Add it to your `.env.local`
3. Submit a booking
4. View the payload structure at webhook.site

## Security Notes

- ✅ Webhook URL is exposed to client (NEXT_PUBLIC_*)
- ✅ Implement authentication in your n8n workflow if needed
- ✅ Validate incoming data in your n8n workflow
- ✅ Use HTTPS for production webhooks
- ✅ Rate limit your webhook endpoint

## Troubleshooting

**Webhook not receiving data?**
- Check that `.env.local` has the correct URL
- Verify the URL is accessible from your browser
- Check n8n workflow is active
- Look for errors in browser console

**Data missing in payload?**
- Ensure all form fields are filled
- Check that Google Places API is working for location details
- Verify the form was submitted successfully

**Performance concerns?**
- Webhook call is non-blocking (async)
- User experience is not affected by slow webhooks
- Failed webhooks don't prevent booking flow

## Production Checklist

- [ ] n8n instance is production-ready and reliable
- [ ] Webhook URL is using HTTPS
- [ ] Authentication is implemented in n8n workflow
- [ ] Error monitoring is set up
- [ ] Webhook endpoint has rate limiting
- [ ] Data is being validated and sanitized in n8n
- [ ] Backup/fallback mechanism is in place
- [ ] Privacy policy mentions data collection
- [ ] GDPR compliance is verified (if applicable)

## Support

For issues with:
- **AaoCab website**: Contact your development team
- **n8n setup**: Visit https://docs.n8n.io
- **Webhook payload**: Refer to this document

---

**Last Updated**: November 2025
**Version**: 1.0
