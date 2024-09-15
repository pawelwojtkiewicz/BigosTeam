import dynamic from "next/dynamic";
import { useMemo } from 'react';

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
    </div>
  );
}
