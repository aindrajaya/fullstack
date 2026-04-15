import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Cart } from './components/Cart';
import { ProductList } from './components/ProductList';
import type { ProductDTO } from '@repo/shared';
import { useState } from 'react';
import { useUsers } from './lib/queries';

const queryClient = new QueryClient();

interface CartItem {
  product: ProductDTO;
  quantity: number;
}

function AppContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { data: users } = useUsers();
  const userId = users?.[0]?.id ?? '';

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Online Store</h1>
      
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3">
          <ProductList onAddToCart={handleAddToCart} />
        </div>
        <div className="col-span-1">
          <Cart
            userId={userId}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}