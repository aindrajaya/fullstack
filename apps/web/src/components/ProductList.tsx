import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProductDTO } from "@repo/shared";

interface ProductListProps {
  onAddToCart: (product: ProductDTO, quantity: number) => void;
}

export function ProductList({ onAddToCart }: ProductListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ProductDTO[]> => {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      return response.json();
    },
  });

  const handleQuantityChange = (productId: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty),
    }));
  };

  const handleAddToCart = (product: ProductDTO) => {
    const qty = quantities[product.id] || 1;
    if (qty > 0) {
      onAddToCart(product, qty);
      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    }
  };

  if (productsQuery.isLoading) {
    return <div className="px-6 py-10 text-sm text-stone-500">Loading products...</div>;
  }

  if (productsQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        Error: {productsQuery.error instanceof Error ? productsQuery.error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {productsQuery.data?.map((product) => (
          <div
            key={product.id}
            className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 shadow-sm"
          >
            <div className="flex min-h-32 flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-900">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{product.description}</p>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-semibold text-stone-900">
                  Price: Rp {product.price.toLocaleString("id-ID")}
                </p>
                <p className="text-stone-500">Tax: {(product.tax * 100).toFixed(0)}%</p>
                <p className={product.stock > 0 ? "text-emerald-700" : "text-red-600"}>
                  Stock: {product.stock}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <input
                className="w-20 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-500"
                max={product.stock}
                min="1"
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                type="number"
                value={quantities[product.id] || 1}
              />
              <button
                className="flex-1 rounded-xl bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                disabled={product.stock === 0}
                onClick={() => handleAddToCart(product)}
                type="button"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
