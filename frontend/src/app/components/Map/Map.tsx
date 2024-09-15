'use client'

import {MapResize} from '@/app/components/Map/MapResize'
import { RoutingControl } from '@/app/components/Map/RoutingControl'
import {MedKitContents, MedKit} from '@/app/components/MedkitContents/MedkitContents'
import {OpenButton} from '@/app/components/OpenButton/OpenButton'
import DangerousEventCaller from '@/app/components/Map/DangerousEventCaller';
import {getApiUrl} from '@/app/helpers/getApiUrl'
import React, {useState, useEffect, Dispatch, SetStateAction, useRef, useMemo} from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import CurrentUserPositionIcon from "./CurrentUserPositionIcon";
import MedKitPlaceIcon from "./MedKitPlaceIcon";
import {Map as MapType} from 'leaflet'

type LatLng = {
  latitude: number
  longitude: number
}

type Coords = [number, number];

// const testCoords: Coords = [ 49.78162, 19.04727 ];

const getCurrentUserPosition = (setPositionCallback: (pos: Coords) => void) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const pos = position ?? [49.768535, 19.038870]
    // setPositionCallback(testCoords);
    setPositionCallback([pos.coords.latitude, pos.coords.longitude]);
  });
};


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

const getCoordsFromKit = (kit: MedKit | null): null | Coords => {
  if (!kit) return null;
  return [kit.attributes.lat, kit.attributes.long];
}

const Map: React.FC<MapProps> = ({
    defaultSize = defaultSizeProp,
  }) => {
  const [currentUserPosition, setCurrentUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [selectedKit, setSelectedKit] = useState<any | null>(null);
  const [nearestMedKits, setNearestMedKits] = useState<any[] | null>(null);
  const [navigateTo, setNavigateTo] = useState<MedKit | null>(null)

  const nearestKits = useMemo<Coords[]>(() => {
    return (nearestMedKits?? []).map(({ attributes: { lat, long }} : any) => [lat, long]);
  }, [nearestMedKits])

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
            setNearestMedKits(res.data);
        })
      }, 0)
    });
  }, []);

  const [screenSize, setScreenSize] = useState<[number, number]>(defaultSize);
  const routeDest = destination ?? getCoordsFromKit(navigateTo)
  const { start, dest, isReady } = convertRouteCoords(currentUserPosition, routeDest);

  const handleMarkerClick = (position: Coords, index: number) => {
    const kit = nearestMedKits?.[index];
    console.log(position)
    if (kit) {
      setSelectedKit(kit)
      setDestination(position);
    }
  }

  const handlePopupClose = () => {
    setSelectedKit(false);
    setDestination(null);
  }

  const handleStartNavigation = (map: MapType) => {
    setNavigateTo(selectedKit);
    map.closePopup();
  }

  const handleOpenClick = () => {

  }

  return (<>{
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
        zIndexOffset={-1}
      >
      </Marker>
      {(nearestKits ?? []).map((position, index) => (
        <Marker
          zIndexOffset={2}
          position={position}
          icon={MedKitPlaceIcon}
          eventHandlers={{
            click: () => handleMarkerClick(position, index),
            popupclose: () => handlePopupClose()
          }}
        >
          <Popup
            minWidth={180}
            maxWidth={320}
          >
            <MedKitContents
              distantCoords={currentUserPosition}
              medKit={selectedKit}
              onNavClick={handleStartNavigation}
              onOpenClick={handleOpenClick}
            />
          </Popup>
        </Marker>
      ))}
      {isReady &&
        (<RoutingControl start={start} destination={dest} />)
      }
      <MapResize onResize={() => {
        setScreenSize([window.innerWidth, window.innerHeight]);
      }} />

      <DangerousEventCaller currentUserPosition={currentUserPosition}/>
    </MapContainer>
    )}
    <OpenButton onOpenClick={handleOpenClick} distantCoords={currentUserPosition} list={nearestMedKits} />
  </>);
}

export default Map;
