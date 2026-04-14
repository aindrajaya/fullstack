import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import type { ProductDTO, UserDTO } from "@repo/shared";

interface CartItem {
  product: ProductDTO;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<UserDTO[]> => {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (!selectedUserId && usersQuery.data?.length) {
      setSelectedUserId(usersQuery.data[0].id);
    }
  }, [selectedUserId, usersQuery.data]);

  const selectedUser =
    usersQuery.data?.find((user) => user.id === selectedUserId) ?? null;

  const handleAddToCart = (product: ProductDTO, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { product, quantity }];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7f2e8_0%,_#eef2f4_100%)] text-stone-900">
      <header className="border-b border-stone-200/80 bg-stone-950 text-stone-50 shadow-[0_14px_40px_rgba(17,24,39,0.18)]">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
            Storefront
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Coffee Roastery Ordering Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
            Build customer orders, monitor live stock, and submit purchases with automatic tax calculation.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:max-w-md">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">
              Customer
            </label>
            <select
              className="rounded-2xl border border-stone-700 bg-stone-900/70 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              disabled={usersQuery.isLoading || !!usersQuery.error || !usersQuery.data?.length}
              onChange={(event) => setSelectedUserId(event.target.value)}
              value={selectedUserId}
            >
              {!usersQuery.data?.length ? (
                <option value="">
                  {usersQuery.isLoading ? "Loading users..." : "No users available"}
                </option>
              ) : null}
              {usersQuery.data?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {selectedUser ? (
              <div className="inline-flex rounded-full border border-stone-700 bg-stone-900/70 px-4 py-2 text-sm text-stone-200">
                User ID:
                <span className="ml-2 font-semibold text-amber-300">{selectedUser.id}</span>
              </div>
            ) : null}
            {usersQuery.isError ? (
              <p className="text-sm text-red-300">
                {usersQuery.error instanceof Error ? usersQuery.error.message : "Failed to load users"}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start">
        <div className="rounded-[2rem] border border-stone-200/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(84,65,24,0.08)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">
                Products
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                Pick coffee items for the order
              </h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
              {cartItems.length} item
            </span>
          </div>
          <ProductList onAddToCart={handleAddToCart} />
        </div>

        <aside className="rounded-[2rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(84,65,24,0.08)] backdrop-blur lg:sticky lg:top-6">
          <div className="mb-5 border-b border-stone-200 pb-4">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">
              Cart
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              Order summary
            </h2>
          </div>
          <Cart
            items={cartItems}
            userId={selectedUserId}
            onRemoveItem={handleRemoveItem}
            onOrderSuccess={handleOrderSuccess}
          />
        </aside>
      </section>
    </main>
  );
}

export default App;
