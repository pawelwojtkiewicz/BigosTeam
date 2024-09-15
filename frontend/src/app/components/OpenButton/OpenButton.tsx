import {MedKit} from '@/app/components/MedkitContents/MedkitContents'
import {areCoordinatesNear} from '@/app/helpers/areCoordinatesNear'
import React, {useMemo} from 'react'
import styles from './OpenButton.module.css'

type Coords = [number, number]

type OpenButtonProps = {
  distantCoords: Coords | null,
  list: MedKit[] | null,
  onOpenClick: (id: number) => void
}
export const OpenButton: React.FC<OpenButtonProps> = ({distantCoords, list, onOpenClick}) => {
  const nearest = useMemo<null | MedKit>(() => {
    return (list ?? []).find((medKit) => areCoordinatesNear(
      distantCoords ?? [0, 0],
      [medKit.attributes.lat, medKit.attributes.long]
    )) ?? null
  }, [distantCoords, list])

  return nearest
    ? <button onClick={() => onOpenClick(nearest.id)} className={styles.openTrigger}>
      Otwórz &laquo;{nearest.attributes.name}&raquo;
    </button>
    : null
}
