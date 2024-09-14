'use client'

import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import CurrentUserPositionIcon from "./CurrentUserPositionIcon";
import MedKitPlaceIcon from "./MedKitPlaceIcon";

const getCurrentUserPosition = (setPositionCallback: Dispatch<SetStateAction<[number, number] | null>>) => {
  navigator.geolocation.getCurrentPosition((position) => {
    setPositionCallback([position.coords.latitude, position.coords.longitude]);
  });
};

const getNearestKits = (res) => {
  const nearestKits = res.data;
  return nearestKits.map(({ attributes: { lat, long }}) => [lat, long]);
}

export default function Map() {
  const [currentUserPosition, setCurrentUserPosition] = useState<[number, number] | null>(null);
  const [nearestKits, setNearestKits] = useState(null);
  useEffect(() => {
    fetch('http://161.35.21.67:1337/api/med-kit/closest?lat=49.768535&long=19.038870&distance=500').then(data => data.json()).then(res => {
      const _nearestKits = getNearestKits(res);
      setNearestKits(_nearestKits);
    })
    getCurrentUserPosition(setCurrentUserPosition);
  }, []);

  return (
    (currentUserPosition) && (
    <MapContainer
        center={currentUserPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "600px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={currentUserPosition}
        icon={CurrentUserPositionIcon}
      >
      </Marker>
      {nearestKits && nearestKits.map((position) => (
        <Marker position={position} icon={MedKitPlaceIcon}>
          <Popup>
            This Marker icon is displayed correctly with <i>leaflet-defaulticon-compatibility</i>.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
  );
}