import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsQueryOptions } from './products-api'

export function ProductDetailPage() {
  const { productId } = useParams()
  const parsedProductId = Number.parseInt(productId ?? '', 10)
  const isValidProductId = Number.isInteger(parsedProductId) && parsedProductId > 0
  const productsQuery = useQuery(productsQueryOptions())

  const product = useMemo(
    () => productsQuery.data?.find((item) => item.id === parsedProductId),
    [productsQuery.data, parsedProductId],
  )

  if (!isValidProductId) {
    return (
      <div className="space-y-4 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-900">
        <p className="font-medium">Invalid product id.</p>
        <Link className="text-sm underline underline-offset-4" to="/products">
          Back to products
        </Link>
      </div>
    )
  }

  if (productsQuery.isPending) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-stone-500">
        Loading product details...
      </div>
    )
  }

  if (productsQuery.isError) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Error: {productsQuery.error instanceof Error ? productsQuery.error.message : 'Unknown error'}
        </div>
        <Link
          className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-500"
          to="/products"
        >
          Back to products
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-4 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-900">
        <p className="font-medium">Product not found.</p>
        <Link className="text-sm underline underline-offset-4" to="/products">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-6 rounded-2xl border border-stone-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
          Product #{product.id}
        </p>
        <Link
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-500"
          to="/products"
        >
          Back to list
        </Link>
      </div>

      <h1 className="text-2xl font-semibold leading-tight text-stone-900">{product.title}</h1>
      <p className="text-base leading-7 text-stone-700">{product.description}</p>
    </article>
  )
}