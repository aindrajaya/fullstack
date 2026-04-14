import { useState } from "react";
import { ProductDTO, CreateOrderDTO } from "@repo/shared";

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

  // 🎯 Kalkulasi subtotal (tanpa pajak)
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // 🎯 Kalkulasi total pajak
  const totalTax = items.reduce((sum, item) => {
    const itemSubtotal = item.product.price * item.quantity;
    return sum + (itemSubtotal * item.product.tax);
  }, 0);

  // 🎯 Kalkulasi total akhir
  const totalPrice = subtotal + totalTax;

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Keranjang kosong!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: CreateOrderDTO = {
        userId,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal membuat order");
      }

      alert("✅ Order berhasil dibuat!");
      onOrderSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", borderLeft: "1px solid #ddd", flex: 1 }}>
      <h2>🛒 Keranjang Belanja</h2>

      {items.length === 0 ? (
        <p style={{ color: "#999" }}>Keranjang kosong...</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            {items.map(item => {
              const itemSubtotal = item.product.price * item.quantity;
              const itemTax = itemSubtotal * item.product.tax;
              const itemTotal = itemSubtotal + itemTax;

              return (
                <div key={item.product.id} style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                  marginBottom: "10px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <strong>{item.product.name}</strong>
                      <p>Qty: {item.quantity} × Rp {item.product.price.toLocaleString("id-ID")}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      ❌ Hapus
                    </button>
                  </div>
                  <div style={{ fontSize: "0.9em", color: "#666", marginTop: "5px" }}>
                    <p>Subtotal: Rp {itemSubtotal.toLocaleString("id-ID")}</p>
                    <p style={{ color: "#ff6b6b" }}>
                      Pajak ({(item.product.tax * 100).toFixed(0)}%): Rp {itemTax.toLocaleString("id-ID")}
                    </p>
                    <p style={{ fontWeight: "bold", color: "#28a745" }}>
                      Total: Rp {itemTotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Subtotal:</span>
              <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#ff6b6b" }}>
              <span>Total Pajak:</span>
              <strong>Rp {totalTax.toLocaleString("id-ID")}</strong>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "10px",
              borderTop: "2px solid #ddd",
              fontSize: "1.2em",
              color: "#28a745"
            }}>
              <span>TOTAL:</span>
              <strong>Rp {totalPrice.toLocaleString("id-ID")}</strong>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>❌ {error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1em",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "⏳ Processing..." : "✅ Checkout Pesanan"}
          </button>
        </>
      )}
    </div>
  );
}