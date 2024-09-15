import {Assignments} from '@/app/components/Map/useMapData'
import {ContentsItem, fetchContents, MedKit} from '@/app/components/MedkitContents/MedkitContents'
import {useEffect, useRef, useState} from 'react'

const PULLING_INTERVAL = 1000
export const useMedKitPooling = (destMedKit: MedKit | null, filterValue: string, assignments: Assignments | null): string => {
  const pulling = useRef<NodeJS.Timeout>()
  const [error, setError] = useState<string>('');
  useEffect(() => {
    if (destMedKit && filterValue && assignments) {
      clearTimeout(pulling.current);
      const queueRequest = () => {
        pulling.current = setTimeout(async () => {
          fetchContents(destMedKit.id)
            .then((contents: Record<string, ContentsItem>) => {
              if (!!contents[filterValue]?.qty) {
                const prodName = (assignments as Record<string, { name: string}>)[filterValue].name
                setError(`Uwaga! ${prodName} nie jest dostępny!`)
              }
            })
          queueRequest();
        }, PULLING_INTERVAL)
      }

      queueRequest();
    }
    return () => {
      clearTimeout(pulling.current);
      setError('');
    }
  }, [destMedKit, filterValue, assignments]);

  return error;
}
