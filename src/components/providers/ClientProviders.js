"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "contexts/CartContext";

export function ClientProviders({ children, session }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}