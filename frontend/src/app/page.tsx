"use client";

import {
    UserIcon
} from '@heroicons/react/24/outline';
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import MapPage from './mappage/page';
import Blik from './components/Blik/Blik';
import Image from 'next/image';
import LoginScreen from './login-screen/page';
import { logout } from './components/logout/action';
import BlikSvg from './public/images/blik.svg';

const links = [
  { name: 'Login', href: '/login-screen', icon: UserIcon }
];

export default function Home() {
  const [isBlikVisible, setIsBlikVisible] = useState(true);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  
  const link = links[0]
  const LinkIcon = link.icon;

  useEffect(() => {
    // Check for jwt cookie
	const getJwt = () => {
		const cookies = document.cookie.split('; ');
		const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
		return jwtCookie ? jwtCookie.split('=')[1] : null;
	};

	const jwt = getJwt();
    if (jwt) {
      setIsLoginVisible(false);
	  setIsLogoutVisible(true);
    }
  }, []);

  const toggleBlikVisibility = () => {
    setIsBlikVisible(!isBlikVisible);
  };

  const toggleLoginVisibility = () => {
	setIsLoginVisible(!isLoginVisible);
  }

  const toggleLogoutVisibility = () => {
	logout();
	setIsLogoutVisible(!isLogoutVisible);
  }

  return (
    <div id="main-page" className={styles.page}>
      <Suspense fallback={<div>powolutku ładuje</div>}>
        <MapPage />
      </Suspense>
      {!isLoginVisible && !isLogoutVisible && <button
      onClick={toggleLoginVisibility}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 1000,
        background: '#000055',
        padding: '10px',
        borderRadius: '8px',
      }}
    >
      <LinkIcon className="w-6" />
      <span className="hidden">{link.name}</span>
    </button>}
	{!isLoginVisible && isLogoutVisible && <button onClick={toggleLogoutVisibility} style={{
		position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 1000,
        background: '#000055',
        padding: '10px',
        borderRadius: '8px',
      }}
    >
		<span className="hidden">Log out</span>
	</button>}
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
	  {isLoginVisible && <div style={{position: "absolute", zIndex:1000, padding: "50px 20px", borderRadius:"10px", border: "solid 2px black", background: "white"}}>
	  	<LoginScreen />
	  </div>} {}
    </div>
  )
}

export const dynamic = 'force-dynamic'