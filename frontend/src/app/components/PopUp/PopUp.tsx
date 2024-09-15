import React, {PropsWithChildren} from 'react'
import styles from './PopUp.module.css'

type PopUpProps = PropsWithChildren<{
  opened: boolean
  style?: React.CSSProperties
  closeText?: string
  onClose: () => void
}>
export const PopUp: React.FC<PopUpProps> = ({children, style, onClose, closeText = 'Zamknąć', opened}) => {
  return opened
    ? <div className={styles.popUp} style={style}>
        <div className={styles.popupText}>{children}</div>
        <div className={styles.controls}>
          <button onClick={onClose} className={styles.closeTrigger}>{closeText}</button>
        </div>
      </div>
      : null
 }
