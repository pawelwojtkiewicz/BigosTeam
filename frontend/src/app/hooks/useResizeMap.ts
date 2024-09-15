import {useEffect, useRef} from 'react';
import { Map } from 'leaflet';

type OnResize = () => void

/**
 * @param map - The Leaflet map instance.
 */
export const useResizeMap = (map: Map | null, onResize: OnResize) => {
  const timeout = useRef<NodeJS.Timeout>()
  const callback = useRef<OnResize>(onResize)

  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        callback.current();
        map.invalidateSize();
      }, 250);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout.current);
    };
  }, [map]);
};
