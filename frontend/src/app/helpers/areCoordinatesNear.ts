/**
 * Calculate the Haversine distance between two points
 * @param coords1 - [lat, lng] format
 * @param coords2 - [lat, lng] format
 * @returns Distance in meters
 */
function haversineDistance(coords1: [number, number], coords2: [number, number]): number {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371000; // Earth radius in meters
  const lat1Rad = (lat1 * Math.PI) / 180; // lat1, lon1 in radians
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLonRad = ((lon1 - lon2) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   // in meters
  return R * c;
}

/**
 * Check if the two coordinates are within a specified range
 * @param coords1 - [lat, lng] format
 * @param coords2 - [lat, lng] format
 * @param range - Range in meters (default is 10 meters)
 * @returns True if within range, otherwise false
 */
export function areCoordinatesNear(coords1: [number, number], coords2: [number, number], range: number = 250): boolean {
  const distance = haversineDistance(coords1, coords2);
  return distance <= range;
}

