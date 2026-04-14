import { useQuery } from '@tanstack/react-query'
import type { UserDTO } from '@repo/shared'

function App() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserDTO[]> => {
      const response = await fetch('/api/users')

      if (!response.ok) {
        throw new Error(`Failed to load users (${response.status})`)
      }

      return response.json()
    },
  })

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1e7,_#f2eee7_40%,_#e6edf2)] px-6 py-12 text-stone-900">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/80 shadow-[0_24px_80px_rgba(63,48,28,0.12)] backdrop-blur">
        <div className="border-b border-stone-200/80 px-8 py-10 sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
            Qiki Pay Interview
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            This screen fetches users through TanStack Query and uses Tailwind utility classes
            for layout and styling.
          </p>
        </div>

        <div className="px-8 py-8 sm:px-12">
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-stone-950 px-5 py-4 text-stone-50">
            <div>
              <p className="text-sm text-stone-300">Query Status</p>
              <p className="text-lg font-medium capitalize">{usersQuery.status}</p>
            </div>
            <button
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-medium transition hover:border-amber-400 hover:text-amber-300"
              onClick={() => usersQuery.refetch()}
              type="button"
            >
              Refetch
            </button>
          </div>

          {usersQuery.isLoading ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-stone-500">
              Loading users...
            </div>
          ) : null}

          {usersQuery.isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              Error: {usersQuery.error instanceof Error ? usersQuery.error.message : 'Unknown error'}
            </div>
          ) : null}

          {usersQuery.data ? (
            <ul className="grid gap-4">
              {usersQuery.data.map((user) => (
                <li
                  key={user.id}
                  className="rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium text-stone-900">
                        {user.name || 'Unnamed user'}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                      {user.role}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default App
