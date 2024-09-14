import {BAD_API_RESPONSE_CODE, BAD_REQUEST_CODE} from '@/app/constants/api'
import { getApiUrl } from '@/app/helpers/getApiUrl'
import { getUrlParamAfter } from '@/app/helpers/getUrlParamAfter'
import {isOffValue} from '@/app/helpers/isOffValue'
import {simplifyResponse} from '@/app/helpers/simplifyResponse'
import { NextRequest, NextResponse } from 'next/server';

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
  codes: string[],
  qty: number,
  name: string
}

export async function GET(request: NextRequest) {

  const id = getUrlParamAfter(request.url, 'contents');
  const { searchParams } = new URL(request.url);
  const codesDisabled = isOffValue(searchParams.get('codes'));

  const medKitId = parseInt(id ?? '');
  if (isNaN(medKitId)) {
    return NextResponse.json(
      { message: 'Incorrect id' },
    { status: BAD_REQUEST_CODE }
    );
  }

  try {

    const requestUrl = getApiUrl('supplies', {
      "filters[medKit][$eq]": medKitId,
      "fields[0]": "id",
      "fields[1]": "code",
      "populate[product][fields][0]": "id",
      "populate[product][fields][1]": "name"
    })
    const response = await fetch(requestUrl)
    const json = await response.json()

    const data = simplifyResponse(json) as SimpleSuppliesItem[];

    const result = data.reduce((result, suppliesItem) => {
      const { code, product: { name, id } } = suppliesItem
      const existingResult = result?.[id]
      const incResult: SimpleResultItem = existingResult
        ? {
          ...existingResult,
          qty: existingResult.qty + 1,
          codes: codesDisabled ? [] : [...existingResult.codes, code]
        }
        : {
          productId: id,
          name,
          codes: codesDisabled ? [] : [code],
          qty: 1,
        }

        return {
          ...result,
          [id]: incResult
        }
    }, {} as Record<number, SimpleResultItem>)

    return NextResponse.json(Object.values(result))

  } catch (error) {
    return NextResponse.json(
      { message: 'Error occurred', error },
      { status: BAD_API_RESPONSE_CODE }
    );
  }
}

