import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CartProvider, useCart } from '../../context/CartContext';
import type { Product } from '../../types';

const mockProduct: Product = {
  id: 'prod-uuid-1',
  name_ru: 'Maillot FC Dynamo',
  price: 89.99,
  stock: 10,
  is_customizable: false,
  category_store: 'maillots',
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  test('démarre vide', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  test('addItem ajoute un produit au panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 1 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(1);
  });

  test('addItem même produit cumule la quantité', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 1 });
    });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 2 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(3);
  });

  test('calcule le total correctement', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 2 });
    });
    expect(result.current.total).toBeCloseTo(179.98, 1);
  });

  test('removeItem supprime le produit', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 1 });
    });
    act(() => {
      result.current.removeItem(mockProduct.id);
    });
    expect(result.current.items).toHaveLength(0);
  });

  test('clearCart vide le panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 3 });
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  test('persiste le panier dans localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ product: mockProduct, quantity: 1 });
    });
    const stored = JSON.parse(localStorage.getItem('fc_cart') ?? '[]') as unknown[];
    expect(stored).toHaveLength(1);
  });
});
