import {API_URL} from '@/app/constants/api'

export const getApiUrl = (path: string, params: Record<string, any>) => {
  const baseURL = `${API_URL}/${path.replace(/^\/+/, '')}`
  const url = new URL(baseURL)
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
  return url.toString()
}
