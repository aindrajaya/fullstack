import { useState } from "react";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import type { ProductDTO } from "@repo/shared";

interface CartItem {
  product: ProductDTO;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = "budi@example.com"; // Sesuaikan dengan user ID dari database

  const handleAddToCart = (product: ProductDTO, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif"
    }}>
      <header style={{
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        <h1>🛍️ Toko Online - Order & Kalkulasi Pajak</h1>
        <p>User ID: {userId}</p>
      </header>

      <div style={{
        display: "flex",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{ flex: 2 }}>
          <ProductList onAddToCart={handleAddToCart} />
        </div>
        <div style={{ flex: 1 }}>
          <Cart
            items={cartItems}
            userId={userId}
            onRemoveItem={handleRemoveItem}
            onOrderSuccess={handleOrderSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default App;