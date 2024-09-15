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

const POSITION_POOLING_INTERVAL = 10000

export const MyPosition: React.FC<MyPositionProps> = ({current, icon = CurrentUserPositionIcon, onChange}) => {
  const delay = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const run = () => {
      clearTimeout(delay.current);
      delay.current = setTimeout(() => {
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
      clearTimeout(delay.current);
    }
  }, [current, onChange]);

  return  <Marker
    position={current}
    icon={icon}
    zIndexOffset={-1}
  />
}
