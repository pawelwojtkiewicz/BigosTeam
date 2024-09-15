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

  useLeafletRouting(map, start, destination);
  return null;
};
