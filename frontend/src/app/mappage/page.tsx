"use client"

import dynamic from "next/dynamic";
import { useMemo, useState } from 'react';
import Blik from '../components/Blik/Blik'; // Import the Blik component
import Image from 'next/image';
import BlikSvg from '../public/images/blik.svg'; // Adjust the path as necessary

export default function MapPage() {
  const [isBlikVisible, setIsBlikVisible] = useState(true);
	
  const Map = useMemo(() => dynamic(
    () => import('../components/Map/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const toggleBlikVisibility = () => {
    setIsBlikVisible(!isBlikVisible);
  };

  return (
    <div>
      { /* <h1>Główna strona z mapą</h1> */ }
      <Map />
	  <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        backgroundColor: 'white',
        padding: isBlikVisible ? '15px' : '0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000, // Added z-index
      }}>
        <button onClick={toggleBlikVisibility} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: isBlikVisible ? '0' : '-50px',
          right: '0',
          padding: '10px',
		  color: 'black',
        }}>
          {isBlikVisible ? 'Close' : <Image src={BlikSvg} alt="Show Blik" width={100} height={24} />}
        </button>
        {isBlikVisible && <Blik />} {/* Conditionally render the Blik component */}
      </div>
    </div>
  );
}
