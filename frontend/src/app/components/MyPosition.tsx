import CurrentUserPositionIcon from '@/app/components/Map/CurrentUserPositionIcon'
import getCurrentUserPosition from '@/app/components/Map/getCurrentUserPosition'
import {Coords} from '@/app/components/Map/useMapData'
import {DivIcon, Icon} from 'leaflet'
import React, {useEffect, useRef} from 'react'
import {Marker} from 'react-leaflet'

type MyPositionProps = {
  current: Coords
  onChange: (coords: Coords) => void
  icon?:  Icon | DivIcon
}

const POSITION_POOLING_INTERVAL = 1000

export const MyPosition: React.FC<MyPositionProps> = ({current, icon = CurrentUserPositionIcon, onChange}) => {
  const timeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const run = () => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        // onChange([current[0] - 0.00005, current[1] - 0.00005])
        getCurrentUserPosition((latLng) => {
          if (latLng.join('') !== current.join('')) {
            onChange(latLng)
          }
          run();
        });
      }, POSITION_POOLING_INTERVAL)
    }

    run();
    return () => {
      clearTimeout(timeout.current);
    }
  }, [current, onChange]);

  return  <Marker
    position={current}
    icon={icon}
    zIndexOffset={-1}
  />
}
