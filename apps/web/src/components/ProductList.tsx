import { useEffect, useState } from "react";
import { ProductDTO } from "@repo/shared";

interface ProductListProps {
  onAddToCart: (product: ProductDTO, quantity: number) => void;
}

export function ProductList({ onAddToCart }: ProductListProps) {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) throw new Error("Gagal mengambil produk");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, qty)
    }));
  };

  const handleAddToCart = (product: ProductDTO) => {
    const qty = quantities[product.id] || 1;
    if (qty > 0) {
      onAddToCart(product, qty);
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    }
  };

  if (loading) return <div>⏳ Loading produk...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Daftar Produk</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div style={{ marginBottom: "10px" }}>
              <strong>Harga: Rp {product.price.toLocaleString("id-ID")}</strong>
              <p style={{ color: "#666" }}>Pajak: {(product.tax * 100).toFixed(0)}%</p>
              <p style={{ color: product.stock > 0 ? "green" : "red" }}>
                Stok: {product.stock}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                style={{ width: "60px", padding: "5px" }}
              />
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                style={{
                  padding: "8px 15px",
                  backgroundColor: product.stock > 0 ? "#007bff" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: product.stock > 0 ? "pointer" : "not-allowed"
                }}
              >
                🛒 Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}