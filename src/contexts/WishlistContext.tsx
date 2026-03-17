import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject } from '@/types/lms';
import { mockSubjects } from '@/data/mockData';

interface WishlistContextType {
  wishlistItems: string[];
  addToWishlist: (subjectId: string) => void;
  removeFromWishlist: (subjectId: string) => void;
  toggleWishlist: (subjectId: string) => void;
  isInWishlist: (subjectId: string) => boolean;
  getWishlistSubjects: () => Subject[];
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  toggleWishlist: () => {},
  isInWishlist: () => false,
  getWishlistSubjects: () => [],
  wishlistCount: 0,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>(() => {
    const stored = localStorage.getItem('lms-wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('lms-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (subjectId: string) => {
    setWishlistItems(prev => prev.includes(subjectId) ? prev : [...prev, subjectId]);
  };

  const removeFromWishlist = (subjectId: string) => {
    setWishlistItems(prev => prev.filter(id => id !== subjectId));
  };

  const toggleWishlist = (subjectId: string) => {
    setWishlistItems(prev =>
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  const isInWishlist = (subjectId: string) => wishlistItems.includes(subjectId);

  const getWishlistSubjects = () =>
    wishlistItems.map(id => mockSubjects.find(s => s.id === id)).filter(Boolean) as Subject[];

  return (
    <WishlistContext.Provider value={{
      wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist,
      isInWishlist, getWishlistSubjects, wishlistCount: wishlistItems.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
