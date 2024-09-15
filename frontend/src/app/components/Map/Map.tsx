'use client'

import {MapResize} from '@/app/components/Map/MapResize'
import { RoutingControl } from '@/app/components/Map/RoutingControl'
import {getApiUrl} from '@/app/helpers/getApiUrl'
import React, {useState, useEffect, Dispatch, SetStateAction, useRef} from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import CurrentUserPositionIcon from "./CurrentUserPositionIcon";
import MedKitPlaceIcon from "./MedKitPlaceIcon";

type LatLng = {
  latitude: number
  longitude: number
}

type Coords = [number, number];

const getCurrentUserPosition = (setPositionCallback: (pos: Coords) => void) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const pos = position ?? [49.768535, 19.038870]
    setPositionCallback([pos.coords.latitude, pos.coords.longitude]);
  });
};

const getNearestKits = (res: { data: any; }) => {
  const nearestKits = res.data;
  return nearestKits.map(({ attributes: { lat, long }} : any) => [lat, long]);
}

type MapProps = {
  defaultSize?: [number, number]
}

const defaultSizeProp: MapProps['defaultSize'] = [600, 600];
const DISTANCE = 10000;

const convertRouteCoords = (startingPoint: Coords | null, destinationPoint: Coords | null) => {
  const [latitude, longitude] = startingPoint ?? [0, 0]
  const start: LatLng = {
    latitude,
    longitude
  }
  const [destLat, destLon] = destinationPoint ?? [0, 0]
  const dest: LatLng = {
    latitude: destLat,
    longitude: destLon
  }
  const isReady = latitude && longitude && destLat && destLon;
  return {
    isReady,
    start,
    dest
  }
}

const Map: React.FC<MapProps> = ({
    defaultSize = defaultSizeProp,
  }) => {
  const [currentUserPosition, setCurrentUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [selectedKit, setSelectedKit] = useState<any | null>(null);
  const [nearestKits, setNearestKits] = useState<any[] | null>(null);
  useEffect(() => {
    setScreenSize([window.innerWidth, window.innerHeight]);
    getCurrentUserPosition((latLng) => {
      setCurrentUserPosition(latLng)
      setTimeout(() => {
        const url = getApiUrl('med-kit/closest', {
          lat: latLng[0],
          long: latLng[1],
          distance: DISTANCE
        })
        fetch(url)
          .then((data) => data.json())
          .then((res) => {
            const _nearestKits = getNearestKits(res);
            setNearestKits(_nearestKits);
        })
      }, 0)
    });
  }, []);

  const [screenSize, setScreenSize] = useState<[number, number]>(defaultSize);
  const { start, dest, isReady } = convertRouteCoords(currentUserPosition, destination)

  const handleMarkerClick = (position: Coords, index: number) => {
    const kit = nearestKits?.[index];
    if (kit) {
      setSelectedKit(kit)
      setDestination(position);
    }
  }

  return (
    (currentUserPosition) && (
    <MapContainer
      center={currentUserPosition}
      zoom={15}
      scrollWheelZoom={true}
      key={screenSize.toString()}
      style={{ width: `${screenSize[0]}px`, height: `${screenSize[1]}px` }}
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
      {nearestKits && nearestKits.map((position, index) => (
        <Marker
          position={position}
          icon={MedKitPlaceIcon}
          eventHandlers={{
            click: () => handleMarkerClick(position, index),
          }}
        >
          <Popup>
            This Marker icon is displayed correctly with <i>leaflet-defaulticon-compatibility</i>.
          </Popup>
        </Marker>
      ))}
      {isReady &&
        (<RoutingControl start={start} destination={dest} />)
      }
      <MapResize onResize={() => {
        setScreenSize([window.innerWidth, window.innerHeight]);
      }} />
    </MapContainer>
  )
  );
}

export default Map;
