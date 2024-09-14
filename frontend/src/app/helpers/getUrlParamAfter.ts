export const getUrlParamAfter = (url: string, paramKey: string): string | null => {
  const parts = url.split('/')
  const keyIndex = parts.indexOf(paramKey)
  return keyIndex !== -1 && keyIndex + 1 < parts.length
    ? parts[keyIndex + 1]
    : null;
}
