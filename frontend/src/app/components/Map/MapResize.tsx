import {useResizeMap} from '@/app/hooks/useResizeMap'
import {useMap} from 'react-leaflet'
import React from 'react'

type MapResizeProps = {
  onResize: () => void
}
export const MapResize: React.FC<MapResizeProps> = ({onResize}) => {
  const map = useMap();
  useResizeMap(map, onResize);
  return null;
}
