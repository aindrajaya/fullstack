import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsQueryOptions } from './products-api'

export function ProductsListPage() {
  const productsQuery = useQuery(productsQueryOptions())

  if (productsQuery.isPending) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-stone-500">
        Loading products...
      </div>
    )
  }

  if (productsQuery.isError) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Error: {productsQuery.error instanceof Error ? productsQuery.error.message : 'Unknown error'}
        </div>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-500"
          onClick={() => productsQuery.refetch()}
          type="button"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <ul className="grid gap-4">
      {productsQuery.data.map((product) => (
        <li key={product.id} className="rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-stone-900">{product.title}</p>
              <p className="mt-1 text-sm leading-6 text-stone-600">{product.description}</p>
            </div>
            <Link
              className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:border-stone-500"
              to={`/products/${product.id}`}
            >
              Details
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}