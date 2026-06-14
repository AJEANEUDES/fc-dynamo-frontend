import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  flocage_name_ru?: string;
  flocage_number?: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'fc_cart';

function itemKey(productId: string, size?: string): string {
  return `${productId}::${size ?? ''}`;
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const key = itemKey(newItem.product.id, newItem.size);
      const idx = prev.findIndex((i) => itemKey(i.product.id, i.size) === key);
      if (idx !== -1) {
        return prev.map((i, n) =>
          n === idx ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(productId: string, size?: string) {
    const key = itemKey(productId, size);
    setItems((prev) => prev.filter((i) => itemKey(i.product.id, i.size) !== key));
  }

  function updateQuantity(productId: string, size: string | undefined, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    const key = itemKey(productId, size);
    setItems((prev) =>
      prev.map((i) => (itemKey(i.product.id, i.size) === key ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
