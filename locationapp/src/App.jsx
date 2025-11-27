import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";

export default function App() {
  const [sendTriggered, setSendTriggered] = useState(false);

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
    getPosition, // iOS requires manual trigger
  } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    suppressLocationOnMount: true, // REQUIRED for iOS
    userDecisionTimeout: 15000,
  });

  // Manually request iOS location
  const requestLocation = () => {
    setSendTriggered(true);
    getPosition(); // triggers iOS Safari popup
  };

  // When coords becomes available → send to backend
  useEffect(() => {
    if (coords && sendTriggered) {
      const payload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        timestamp: new Date().toISOString(),
      };

      console.log("📡 Sending location:", payload);

      fetch("https://backend-locationapp.onrender.com/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => console.log("Backend response:", data))
        .catch((err) => console.error("Sending failed:", err));
    }
  }, [coords, sendTriggered]);

  // Error handling
  if (!isGeolocationAvailable) {
    return <div>Your device does not support GPS.</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Turn on location services.</div>;
  }

  if (positionError) {
    return <div>Error: {positionError.message}</div>;
  }

  const googleMapsUrl =
    coords && `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mobile-Compatible Location Sharing</h2>

      {!coords ? (
        <button
          onClick={requestLocation}
          style={{
            padding: "12px 18px",
            background: "#4285F4",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Share My Location
        </button>
      ) : (
        <div>
          <p><strong>Latitude:</strong> {coords.latitude}</p>
          <p><strong>Longitude:</strong> {coords.longitude}</p>
          <p><strong>Accuracy:</strong> {coords.accuracy} meters</p>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 15px",
              marginTop: "10px",
              background: "#34A853",
              color: "white",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}