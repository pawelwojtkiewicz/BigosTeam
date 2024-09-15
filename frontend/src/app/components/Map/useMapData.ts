import getCurrentUserPosition from '@/app/components/Map/getCurrentUserPosition'
import {MedKit} from '@/app/components/MedkitContents/MedkitContents'
import {getApiUrl} from '@/app/helpers/getApiUrl'
import {Dispatch, useEffect, useMemo, useRef, useState} from 'react'

const DISTANCE = 10000;

export type Coords = [number, number];

export type LatLng = {
  latitude: number
  longitude: number
}

export type RouteWaypoints = {
  start: LatLng
  dest: LatLng
  isReady: boolean
}

export type SimpleAssignment = {
  id: number
  name: string
  quantity: number
}

export type Assignments = Record<number, SimpleAssignment>

type SimpleAsgItem = {
  id: number,
  quantity: number,
  product: {
    data: {
      id: number,
      attributes: {
        name: string
      }
    }
  }
}

type UseMapDataResult = {
  currentUserPosition: [number, number] | null
  setCurrentUserPosition: Dispatch<UseMapDataResult['currentUserPosition']>
  destination: [number, number] | null
  setDestination: Dispatch<UseMapDataResult['destination']>
  selectedKit: MedKit | null
  setSelectedKit: Dispatch<UseMapDataResult['selectedKit']>
  navigateTo: MedKit | null
  setNavigateTo: Dispatch<UseMapDataResult['navigateTo']>
  nearestMedKits: MedKit[] | null
  setNearestMedKits: Dispatch<UseMapDataResult['nearestMedKits']>
  nearestKits: Coords[]
  screenSize: [number, number]
  setScreenSize: Dispatch<UseMapDataResult['screenSize']>
  routeWaypoints: RouteWaypoints
  assignments: Assignments | null
  setAssignments: Dispatch<UseMapDataResult['assignments']>
  filterValue: string
  setFilterValue: Dispatch<UseMapDataResult['filterValue']>
}

const convertRouteCoords = (startingPoint: Coords | null, destinationPoint: Coords | null): RouteWaypoints => {
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
  const isReady = !!(latitude && longitude && destLat && destLon);
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

const assignmentsRequestUrl = getApiUrl('product-assignment', {
  "populate[0]": 'entries',
  "populate[1]": 'entries.product'
});

export const useMapData = (defaultSize: [number, number]): UseMapDataResult => {
  const [currentUserPosition, setCurrentUserPosition] = useState<UseMapDataResult['currentUserPosition']>(null);
  const [destination, setDestination] = useState<UseMapDataResult['destination']>(null);
  const [selectedKit, setSelectedKit] = useState<UseMapDataResult['selectedKit']>(null);
  const [nearestMedKits, setNearestMedKits] = useState<UseMapDataResult['nearestMedKits']>(null);
  const [navigateTo, setNavigateTo] = useState<UseMapDataResult['navigateTo']>(null)
  const [assignments, setAssignments] = useState<UseMapDataResult['assignments']>(null);
  const [filterValue, setFilterValue] = useState<UseMapDataResult['filterValue']>("");

  const nearestKits = useMemo<UseMapDataResult['nearestKits']>(() => {
    return (nearestMedKits?? []).map(({ attributes: { lat, long }} : any) => [lat, long]);
  }, [nearestMedKits])

  useEffect(() => {
    setScreenSize([window.innerWidth, window.innerHeight]);
  }, []);

  useEffect(() => {
    getCurrentUserPosition((latLng) => {
      setCurrentUserPosition(latLng);
      setTimeout(() => {
        const commonParams = {
          lat: latLng[0],
          long: latLng[1],
          distance: DISTANCE
        }
        const url = getApiUrl('med-kit/closest', commonParams);
        // product/1/medKitsEquippedWith?lat=0&long=0&distance=1000
        const filterUrl = getApiUrl(`product/${filterValue}/medKitsEquippedWith`, commonParams);

        const dataUrl = !!filterValue
          ? filterUrl
          : url;

        fetch(dataUrl)
            .then((data) => data.json())
            .then((res) => {
              setNearestMedKits(res.data);
            })
        }, 0)


        fetch(assignmentsRequestUrl)
          .then((data) => data.json())
          .then((json) => {
            const entries = (json?.data?.attributes?.entries ?? []) as SimpleAsgItem[];

            const assignments = entries.reduce((result, { quantity, product: { data } }) => {
              return {
                ...result,
                [data.id]: {
                  id: data.id,
                  name: data.attributes.name,
                  quantity
                }
              }
            }, {} as Assignments);
            setAssignments(assignments);

          })
    });
  }, [filterValue]);

  const [screenSize, setScreenSize] = useState<UseMapDataResult['screenSize']>(defaultSize);
  const routeDest = destination ?? getCoordsFromKit(navigateTo)
  const routeWaypoints = convertRouteCoords(currentUserPosition, routeDest);

  return {
    currentUserPosition,
    setCurrentUserPosition,
    destination,
    setDestination,
    selectedKit,
    setSelectedKit,
    navigateTo,
    setNavigateTo,
    nearestKits,
    setNearestMedKits,
    nearestMedKits,
    screenSize,
    setScreenSize,
    routeWaypoints,
    assignments,
    setAssignments,
    filterValue,
    setFilterValue
  }
}
