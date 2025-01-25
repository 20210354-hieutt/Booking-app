// Map.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = ({
  initialLocation,
  onLocationSelect,
  height = "400px",
}) => {
  const [position, setPosition] = useState({
    lat: initialLocation.latitude || 21.0278, // Default latitude
    lng: initialLocation.longitude || 105.8342, // Default longitude
  });

  useEffect(() => {
    if (initialLocation.latitude && initialLocation.longitude) {
      setPosition({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude,
      });
    }
  }, [initialLocation]);

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        if (onLocationSelect) {
          onLocationSelect({ lat, lng });
        }
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={markerIcon}></Marker>
    );
  };

  return (
    <div style={{ height }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
