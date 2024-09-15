'use client'

import {areCoordinatesNear} from '@/app/helpers/areCoordinatesNear'
import {getApiUrl} from '@/app/helpers/getApiUrl'
import {simplifyResponse} from '@/app/helpers/simplifyResponse'
import React, {useEffect, useMemo, useState} from 'react'
import {useMap} from 'react-leaflet'
import {Map} from 'leaflet'
import styles from "./MedkitContents.module.css"

export type MedKit = {
  id: number,
  attributes: {
    lat: number,
    long: number,
    name: string
  }
}

type MedKitContentsProps = {
  medKit: MedKit | null,
  onNavClick?: (map: Map) => void,
  onOpenClick?: (id: number) => void,
  distantCoords?: [number, number]
}

type SimpleSuppliesItem = {
  id: number,
  code: string,
  product: {
    id: number,
    name: string
  }
}

type SimpleResultItem = {
  productId: number,
  qty: number,
  name: string
}

type Contents = Record<number, SimpleResultItem>

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

type SimpleAssignment = {
  id: number
  name: string
  quantity: number
}

type Assignments = Record<number, SimpleAssignment>

export const MedKitContents: React.FC<MedKitContentsProps> = ({
    medKit,
    onNavClick,
    onOpenClick,
    distantCoords
  }) => {
  const [contents, setContents] = useState<Contents | null>(null);
  const [assignments, setAssignments] = useState<Assignments | null>(null);
  const map = useMap();

  const id = medKit?.id ?? 0
  useEffect(() => {
    if (id) {
      setContents(null);
      setAssignments(null);
      const contentsRequestUrl = getApiUrl('supplies', {
        "filters[medKit][$eq]": id,
        "fields[0]": "id",
        "fields[1]": "code",
        "populate[product][fields][0]": "id",
        "populate[product][fields][1]": "name"
      })
      fetch(contentsRequestUrl)
        .then((data) => data.json())
        .then((json) => {

          const data = simplifyResponse(json) as SimpleSuppliesItem[];
          const contents = data.reduce((result, suppliesItem) => {
            const { product: { name, id } } = suppliesItem;
            const existingResult = result?.[id];
            const incResult: SimpleResultItem = existingResult
              ? {
                ...existingResult,
                qty: existingResult.qty + 1,
              }
              : {
                productId: id,
                name,
                qty: 1,
              }

            return {
              ...result,
              [id]: incResult
            }
          }, {} as Record<number, SimpleResultItem>)

          setContents(contents)
        })

      const assignmentsRequestUrl = getApiUrl('product-assignment', {
        "populate[0]": 'entries',
        "populate[1]": 'entries.product'
      });
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
    }
  }, [id]);

  useEffect(() => {
    if (contents && assignments) {

    }
  }, [assignments, contents]);

  const isNear = useMemo(() => !!distantCoords && !!medKit
    ? areCoordinatesNear(
        distantCoords,
        [medKit.attributes.lat, medKit.attributes.long]
      )
    : false
    , [distantCoords, medKit])

  return !contents || !assignments
    ? '...'
    : <div className={styles.popupContent}>
        <ol>
          {Object.values(assignments).map(({id, name, quantity: expectedQty}) => {
            const existingQty = contents[id]?.qty ?? 0
            return <li className={!existingQty ? styles.supplyFail : styles.supplyOk} key={id}>
              <strong>{name}</strong>
              {' '}({existingQty} / {expectedQty})
            </li>
          })}
        </ol>
        <br />
          {(isNear && medKit?.id)
            ? <button
              onClick={() => onOpenClick && onOpenClick(medKit.id)}
              className={styles.openTrigger}
            >{` OTWÓRZ `}</button>
            : <button
              onClick={() => onNavClick && onNavClick(map)}
              className={styles.navTrigger}
            >{` NAWIGUJ `}</button>
          }
          </div>
        }
