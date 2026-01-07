"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Initialiser depuis localStorage après le montage
  useEffect(() => {
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      setCartCount(parseInt(savedCount));
    }
  }, []);

  // Synchroniser avec localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cartCount', cartCount.toString());
  }, [cartCount]);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const incrementCartCount = (quantity = 1) => {
    setCartCount(prev => prev + quantity);
  };

  const decrementCartCount = (quantity = 1) => {
    setCartCount(prev => Math.max(0, prev - quantity));
  };

  const syncCartCount = async (id_user) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/get_cart_client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch cart");
      
      const data = await res.json();
      const count = data.length;
      setCartCount(count);
      
      return count;
    } catch (error) {
      console.error('Error syncing cart count:', error);
      return cartCount;
    }
  };

  return (
    <CartContext.Provider value={{
      cartCount,
      updateCartCount,
      incrementCartCount,
      decrementCartCount,
      syncCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};