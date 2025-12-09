import React, { useEffect } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

export default function LocationInput({ 
  label, 
  onLocationSelect,
  defaultValue = "" // NEW: Allows Smart Agent to set the text
}: { 
  label: string, 
  onLocationSelect: (address: string) => void,
  defaultValue?: string
}) {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
    libraries,
  });

  if (loadError) return <div style={{color: 'red', fontSize: '12px'}}>Map Error</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return <SearchBox label={label} onLocationSelect={onLocationSelect} defaultValue={defaultValue} />;
}

function SearchBox({ label, onLocationSelect, defaultValue }: any) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "in" },
    },
    debounce: 300,
  });

  // NEW: Update the text box if the Smart Agent sends a value
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue, false);
    }
  }, [defaultValue, setValue]);

  const handleInput = (e: any) => setValue(e.target.value);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    onLocationSelect(address);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
          );
          const resultData = await response.json();
          if (resultData.results[0]) {
            const address = resultData.results[0].formatted_address;
            setValue(address, false);
            onLocationSelect(address);
          }
        } catch (error) {
          console.error("Error", error);
        }
      },
      () => alert("Allow location access.")
    );
  };

  return (
    <div style={{ marginBottom: '15px', position: 'relative' }}>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
        {label}
      </label>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search location..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#fff'
          }}
        />
        <button
          type="button"
          onClick={handleCurrentLocation}
          title="Use Current Location"
          style={{
            padding: '12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ➤
        </button>
      </div>

      {status === "OK" && (
        <ul style={{
          position: 'absolute',
          zIndex: 50,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          width: '100%',
          listStyle: 'none',
          padding: '4px 0',
          margin: 0,
          marginTop: '4px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#4b5563',
                borderBottom: '1px solid #f3f4f6'
              }}
            >
              📍 {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}