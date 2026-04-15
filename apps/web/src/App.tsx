import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { ProductDetailPage } from './features/products/ProductDetailPage'
import { ProductsListPage } from './features/products/ProductsListPage'

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1e7,_#f2eee7_40%,_#e6edf2)] px-6 py-12 text-stone-900">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/80 shadow-[0_24px_80px_rgba(63,48,28,0.12)] backdrop-blur">
        <div className="border-b border-stone-200/80 px-8 py-8 sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
            Product Catalog
          </p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="max-w-2xl text-base leading-7 text-stone-600">
              Data comes from the backend endpoint and is managed via TanStack Query.
            </p>
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-stone-950 text-stone-50'
                    : 'border border-stone-300 text-stone-700 hover:border-stone-500'
                }`
              }
              to="/products"
            >
              Products
            </NavLink>
          </div>
        </div>

        <div className="px-8 py-8 sm:px-12">
          <Routes>
            <Route element={<Navigate replace to="/products" />} path="/" />
            <Route element={<ProductsListPage />} path="/products" />
            <Route element={<ProductDetailPage />} path="/products/:productId" />
          </Routes>
        </div>
      </section>
    </main>
  )
}

export default App
