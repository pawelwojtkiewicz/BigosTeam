'use client'

import {MapResize} from '@/app/components/Map/MapResize'
import {RoutingControl} from '@/app/components/Map/RoutingControl'
import {useMapData, Coords} from '@/app/components/Map/useMapData'
import {MedKitContents} from '@/app/components/MedkitContents/MedkitContents'
import {OpenButton} from '@/app/components/OpenButton/OpenButton'
import React from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import CurrentUserPositionIcon from "./CurrentUserPositionIcon";
import MedKitPlaceIcon from "./MedKitPlaceIcon";
import {Map as MapType} from 'leaflet'

type MapProps = {
  defaultSize?: [number, number]
}

const defaultSizeProp: MapProps['defaultSize'] = [600, 600];

const Map: React.FC<MapProps> = ({
    defaultSize = defaultSizeProp,
  }) => {

  const {
    currentUserPosition,
    setDestination,
    selectedKit,
    setSelectedKit,
    setNavigateTo,
    nearestKits,
    nearestMedKits,
    screenSize,
    setScreenSize,
    routeWaypoints: {
      isReady,
      start,
      dest
    },
    assignments
  } = useMapData(defaultSize)

  const handleMarkerClick = (position: Coords, index: number) => {
    const kit = nearestMedKits?.[index];
    if (kit) {
      setSelectedKit(kit)
      setDestination(position);
      setNavigateTo(null);
    }
  }

  const handlePopupClose = () => {
    setSelectedKit(null);
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
              assignments={assignments}
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
    </MapContainer>
    )}
    <OpenButton onOpenClick={handleOpenClick} distantCoords={currentUserPosition} list={nearestMedKits} />
  </>);
}

export default Map;
