import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateOrderDTO, ProductDTO } from "@repo/shared";

interface CartItem {
  product: ProductDTO;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  userId: string;
  onRemoveItem: (productId: string) => void;
  onOrderSuccess: () => void;
}

export function Cart({ items, userId, onRemoveItem, onOrderSuccess }: CartProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const totalTax = items.reduce((sum, item) => {
    const itemSubtotal = item.product.price * item.quantity;
    return sum + itemSubtotal * item.product.tax;
  }, 0);

  const totalPrice = subtotal + totalTax;

  const handleCheckout = async () => {
    if (!userId) {
      setError("Select a user before checkout");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: CreateOrderDTO = {
        userId,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create order");
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onOrderSuccess();
      alert("Order created successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Shopping Cart</h3>
        <p className="mt-1 text-sm text-stone-500">Review totals, tax, and complete the order.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-sm text-stone-500">
          Your cart is empty.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const itemSubtotal = item.product.price * item.quantity;
              const itemTax = itemSubtotal * item.product.tax;
              const itemTotal = itemSubtotal + itemTax;

              return (
                <div
                  key={item.product.id}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-stone-900">{item.product.name}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        Qty: {item.quantity} x Rp {item.product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      onClick={() => onRemoveItem(item.product.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-stone-600">
                    <p>Subtotal: Rp {itemSubtotal.toLocaleString("id-ID")}</p>
                    <p>Tax ({(item.product.tax * 100).toFixed(0)}%): Rp {itemTax.toLocaleString("id-ID")}</p>
                    <p className="font-semibold text-emerald-700">
                      Total: Rp {itemTotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-950 p-5 text-stone-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-300">Subtotal</span>
              <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-amber-300">
              <span>Total Tax</span>
              <strong>Rp {totalTax.toLocaleString("id-ID")}</strong>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-stone-700 pt-4 text-lg font-semibold">
              <span>Total</span>
              <strong>Rp {totalPrice.toLocaleString("id-ID")}</strong>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            disabled={loading}
            onClick={handleCheckout}
            type="button"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
