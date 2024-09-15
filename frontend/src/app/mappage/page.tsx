import dynamic from "next/dynamic";
import { useMemo } from 'react';
import Blik from '../components/Blik/Blik'; // Import the Blik component

export default async function MapPage() {
  const Map = useMemo(() => dynamic(
    () => import('../components/Map/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  return (
    <div>
      { /* <h1>Główna strona z mapą</h1> */ }
      <Map />
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000, // Added z-index
      }}>
        <Blik /> {/* Add the Blik component here */}
      </div>
    </div>
  );
}
