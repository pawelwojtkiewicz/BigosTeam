import {DISABLED_PARAM_VALUES} from '@/app/constants/api'

export const isOffValue = (value: string | null) => DISABLED_PARAM_VALUES.includes(value ? value.toLowerCase() : '')
