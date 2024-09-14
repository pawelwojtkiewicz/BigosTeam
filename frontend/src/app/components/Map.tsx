'use client'
import { useState, useEffect } from 'react';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const getCurrentUserPosition = (setPositionCallback) => {
  navigator.geolocation.getCurrentPosition((position) => {
    setPositionCallback([position.coords.latitude, position.coords.longitude]);
  });
};

export default function Map() {
  const [currentUserPosition, setCurrentUserPosition] = useState(null);
  useEffect(() => {
    getCurrentUserPosition(setCurrentUserPosition);
  }, []);
  
  const randomPositionForPin = [49.768535, 19.038870]

  return (
    currentUserPosition && (
    <MapContainer
        center={currentUserPosition}
        zoom={100}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "600px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={randomPositionForPin}>
        <Popup>
          This Marker icon is displayed correctly with <i>leaflet-defaulticon-compatibility</i>.
        </Popup>
      </Marker>
    </MapContainer>
  )
  );
}