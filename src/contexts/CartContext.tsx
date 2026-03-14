import React, { createContext, useContext, useState } from 'react';
import { mockSubjects } from '@/data/mockData';
import { Subject } from '@/types/lms';

interface CartContextType {
  cartItems: string[]; // subjectIds
  purchasedItems: string[]; // subjectIds (enrolled after payment)
  addToCart: (subjectId: string) => void;
  removeFromCart: (subjectId: string) => void;
  isInCart: (subjectId: string) => boolean;
  isPurchased: (subjectId: string) => boolean;
  getCartSubjects: () => Subject[];
  getPurchasedSubjects: () => Subject[];
  clearCart: () => void;
  completePurchase: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  purchasedItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  isInCart: () => false,
  isPurchased: () => false,
  getCartSubjects: () => [],
  getPurchasedSubjects: () => [],
  clearCart: () => {},
  completePurchase: () => {},
  cartCount: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const addToCart = (subjectId: string) => {
    setCartItems(prev => prev.includes(subjectId) ? prev : [...prev, subjectId]);
  };

  const removeFromCart = (subjectId: string) => {
    setCartItems(prev => prev.filter(id => id !== subjectId));
  };

  const isInCart = (subjectId: string) => cartItems.includes(subjectId);
  const isPurchased = (subjectId: string) => purchasedItems.includes(subjectId);

  const getCartSubjects = () =>
    cartItems.map(id => mockSubjects.find(s => s.id === id)!).filter(Boolean);

  const getPurchasedSubjects = () =>
    purchasedItems.map(id => mockSubjects.find(s => s.id === id)!).filter(Boolean);

  const clearCart = () => setCartItems([]);

  const completePurchase = () => {
    setPurchasedItems(prev => [...new Set([...prev, ...cartItems])]);
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      purchasedItems,
      addToCart,
      removeFromCart,
      isInCart,
      isPurchased,
      getCartSubjects,
      getPurchasedSubjects,
      clearCart,
      completePurchase,
      cartCount: cartItems.length,
    }}>
      {children}
    </CartContext.Provider>
  );
};
