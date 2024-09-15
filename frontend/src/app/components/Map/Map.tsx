'use client'

import {Filter} from '@/app/components/Filter/Filter'
import {MapResize} from '@/app/components/Map/MapResize'
import {RoutingControl} from '@/app/components/Map/RoutingControl'
import {useMapData, Coords} from '@/app/components/Map/useMapData'
import {useMedKitPooling} from '@/app/components/Map/useMedkitPooling'
import {MedKitContents} from '@/app/components/MedkitContents/MedkitContents'
import {OpenButton} from '@/app/components/OpenButton/OpenButton'
import DangerousEventCaller from '@/app/components/Map/DangerousEventCaller'
import React from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import CurrentUserPositionIcon from "./CurrentUserPositionIcon";
import MedKitPlaceIcon, { MedKitPlaceIconEm } from "./MedKitPlaceIcon";
import {Map as MapType} from 'leaflet'
import {PopUp as ErrorPopup} from '@/app/components/PopUp/PopUp'
import styles from "./Map.module.css"

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
    navigateTo,
    setNavigateTo,
    nearestKits,
    nearestMedKits,
    screenSize,
    setScreenSize,
    filterValue,
    setFilterValue,
    routeWaypoints: {
      isReady,
      start,
      dest
    },
    assignments
  } = useMapData(defaultSize)

  const [poolingError, resetPoolingError] = useMedKitPooling(navigateTo, filterValue, assignments);

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
    console.log('Send open medkit request...')
  }

  return (<>{
    (currentUserPosition) && (
    <MapContainer
      center={currentUserPosition}
      zoom={15}
      scrollWheelZoom={true}
      key={screenSize.toString()}
      style={{ width: `${screenSize[0]}px`, height: `${screenSize[1]}px` }}
      className={styles.mapContainer}
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
          icon={
            position.join('') === `${navigateTo?.attributes.lat}${navigateTo?.attributes.long}`
              ? MedKitPlaceIconEm
              : MedKitPlaceIcon
          }
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

      <DangerousEventCaller currentUserPosition={currentUserPosition} />
    </MapContainer>
    )}
    <OpenButton
      onOpenClick={handleOpenClick}
      distantCoords={currentUserPosition}
      list={nearestMedKits}
    />
    <Filter
      setFilter={setFilterValue}
      filterValue={filterValue}
      assignments={assignments}
    />
    <ErrorPopup
      opened={!!poolingError}
      onClose={() => {
        resetPoolingError();
        setFilterValue('');
      }}
      style={{
        background: '#950000',
        border: '3p solid #ff0000',
        color: '#ffffff'
      }}
    >{poolingError}</ErrorPopup>
  </>);
}

export default Map;
