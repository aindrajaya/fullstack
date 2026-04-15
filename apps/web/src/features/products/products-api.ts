import { queryOptions } from '@tanstack/react-query'
import type { ProductsDTO } from '@repo/shared'

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '/api'

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function productsQueryOptions() {
  return queryOptions({
    queryKey: ['products'],
    queryFn: ({ signal }) => requestJson<ProductsDTO[]>(`${apiBaseUrl}/products`, signal),
    staleTime: 30_000,
  })
}