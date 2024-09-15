'use client'

import {areCoordinatesNear} from '@/app/helpers/areCoordinatesNear'
import React from 'react';
import { useMapEvent } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useLeafletRouting } from '@/app/hooks/useLeafletRouting'

interface LatLng {
  latitude: number;
  longitude: number;
}

interface MapProps {
  start: LatLng;
  destination: LatLng;
}

export const RoutingControl: React.FC<MapProps> = ({ start, destination }) => {
  const map = useMapEvent('load', () => {});

  const isNear = areCoordinatesNear(
    [start.latitude, start.longitude],
    [destination.latitude, destination.longitude],
  )
  useLeafletRouting(isNear ? null : map, start, destination);
  return null;
};
