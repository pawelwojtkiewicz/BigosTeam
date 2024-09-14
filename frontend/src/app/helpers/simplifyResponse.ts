type Pagination	 = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

type StrapiResponse<T = any> = {
  data: T[],
  meta: {
    pagination: Pagination
  }
}

export const simplifyResponse = (response: StrapiResponse) => {
  return response.data.map((entry) => {
    return simplify(entry)
  })
}

const isAttributesData = (item: Record<string, any>) => !!item && (item.hasOwnProperty('id') && item.hasOwnProperty('attributes'))

type AnyEntry = Record<string, any>

export const simplify = (item: AnyEntry): AnyEntry => {
  if ((typeof item === 'object' && item !== null) &&
    (isAttributesData(item) || isAttributesData(item.data))) {
    const attrs = item.data?.attributes ?? item.attributes
    return {
      id: item.data?.id ?? item.id,
      ...(Object.entries(attrs).reduce((result, [key, attrItem]) => ({
        ...result,
        [key]: simplify(attrItem as AnyEntry)
      }), {} as AnyEntry))
    }
  }
  return item
}
