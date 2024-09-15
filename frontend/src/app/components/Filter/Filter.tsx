import {Assignments} from '@/app/components/Map/useMapData'
import React from 'react'
import styles from "./Filter.module.css"

type FilterProps = {
  assignments: Assignments | null
  filterValue: string
  setFilter: (value: string) => void
}
export const Filter: React.FC<FilterProps> = ({assignments, filterValue, setFilter}) => {

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setFilter(event.target.value);
  }

  return !assignments
    ? null
    : <>
      <select onChange={handleChange} className={styles.filterSelect}>
        <option value="" selected={filterValue === null}>Dowolny</option>
        {Object.values(assignments).map((assignment) =>
          <option value={assignment.id} selected={filterValue === `${assignment.id}`}>{assignment.name}</option>
        )}
      </select>
    </>
}
