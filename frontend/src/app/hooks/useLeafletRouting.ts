import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Custom hook to add routing control to a Leaflet map.
 *
 * @param map - The Leaflet map instance.
 * @param start - Starting point with latitude and longitude.
 * @param destination - Destination point with latitude and longitude.
 */
export const useLeafletRouting = (map: L.Map | null, start: LatLng, destination: LatLng) => {
  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.latitude, start.longitude),
        L.latLng(destination.latitude, destination.longitude)
      ],
      router: new L.Routing.OSRMv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot',
      }),
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      if (map) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, destination]);
};
