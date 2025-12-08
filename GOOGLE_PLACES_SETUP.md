
# Google Places API Setup Guide

This guide will help you set up Google Places API for precise location autocomplete with geocoding data.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "AaoCab Location Services")
4. Click "Create"

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for and enable the following APIs:
   - **Places API**
   - **Geocoding API**
   - **Maps JavaScript API**

## Step 3: Create API Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the generated API key
4. Click **Edit API key** (or the pencil icon)

## Step 4: Restrict Your API Key (Recommended for Production)

### Application Restrictions:
- Choose **HTTP referrers (web sites)**
- Add your domains:
  - `http://localhost:3000/*` (for development)
  - `https://yourdomain.com/*` (for production)
  - `https://*.vercel.app/*` (if using Vercel)

### API Restrictions:
- Select **Restrict key**
- Choose only the APIs you enabled:
  - Places API
  - Geocoding API
  - Maps JavaScript API

## Step 5: Add API Key to Your Project

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add your API key:

```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

3. Restart your development server

## Step 6: Verify Setup

1. Start your development server: `npm run dev`
2. Navigate to the booking form
3. Type in a location field
4. You should see Google Places autocomplete suggestions
5. Check the browser console for "Location Details" logs when selecting locations

## Cost Considerations

### Free Tier:
- Google provides $200 monthly credit
- Autocomplete: $2.83 per 1,000 requests (without Place Details)
- Place Details: $17 per 1,000 requests
- Geocoding: $5 per 1,000 requests

### Cost Optimization:
- Use session tokens (implemented in the hook)
- Cache frequently searched locations
- Set up billing alerts in Google Cloud Console

## Troubleshooting

### "Places API not loaded" Error
- Ensure the API key is correct in `.env.local`
- Verify Places API is enabled in Google Cloud Console
- Check browser console for specific error messages

### No Autocomplete Suggestions
- Verify API key restrictions allow your domain
- Check that Places API quota hasn't been exceeded
- Ensure proper internet connection

### "This API project is not authorized to use this API"
- Enable the required APIs in Google Cloud Console
- Wait 5-10 minutes for changes to propagate
- Clear browser cache and reload

## 🐛 Common Issues & Solutions

### "Network request failed" for gen_204
**Issue:** You see a network error for `https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true`

**Explanation:** This is a **non-critical diagnostic request** that Google Maps automatically performs to test Content Security Policy (CSP) compliance. It's completely normal and expected behavior.

**Impact:** None - Your location autocomplete works perfectly despite this error

**Action Required:** None - You can safely ignore this error. It doesn't affect functionality.

**Why it happens:** Google Maps tests if your website's security headers allow their services. The test request intentionally has no response body.

## Security Best Practices

1. **Never commit API keys to version control**
   - Add `.env.local` to `.gitignore`
   - Use environment variables

2. **Restrict API keys**
   - Set HTTP referrer restrictions
   - Limit to only required APIs

3. **Monitor usage**
   - Set up billing alerts
   - Review API usage regularly in Google Cloud Console

4. **Rotate keys periodically**
   - Generate new keys every 90 days
   - Update across all environments

## Next Steps: Distance Calculation

Once location data is captured, you can implement:

1. **Distance Matrix API**: Calculate distance and time between locations
2. **Directions API**: Get turn-by-turn directions
3. **Dynamic Pricing**: Calculate fare based on distance
4. **Route Optimization**: Optimize multi-stop routes

Example code for future distance calculation:

```typescript
const calculateDistance = async (
  fromLocation: LocationData,
  toLocation: LocationData
) => {
  const service = new google.maps.DistanceMatrixService();
  
  const result = await service.getDistanceMatrix({
    origins: [{ lat: fromLocation.latitude, lng: fromLocation.longitude }],
    destinations: [{ lat: toLocation.latitude, lng: toLocation.longitude }],
    travelMode: google.maps.TravelMode.DRIVING,
  });
  
  const distance = result.rows[0].elements[0].distance.value; // meters
  const duration = result.rows[0].elements[0].duration.value; // seconds
  
  return { distance, duration };
};
```

## Support

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
