
'use client'
import React, { useEffect, useState, useCallback } from 'react';

const Hero = React.memo(() => {
  const [order_length, set_order_length] = useState(0);
  const [product_length, set_product_length] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/get_length_order_product`, {
        cache: 'no-store', // Désactive le cache pour avoir des données fraîches à chaque requête
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      set_order_length(data?.order);
      set_product_length(data?.produit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center gap-4 md:gap-20 mt-[6rem] mb-[3rem]">
      <div className="px-6 py-5 bg-white rounded-lg border w-[150px] shadow-lg transition-all hover:scale-110">
        <p className="text-black text-center">
          <span className="font-bold">{order_length}</span> orders
        </p>
      </div>

      <div className="px-6 py-5 bg-white rounded-lg border w-[150px] shadow-lg transition-all hover:scale-110">
        <p className="text-black text-center">
          <span className="font-bold">{product_length}</span> Produit
        </p>
      </div>

      <div className="px-6 py-5 bg-white rounded-lg border w-[150px] shadow-lg transition-all hover:scale-110">
        <p className="text-black text-center">
          <span className="font-bold">5</span> Categories
        </p>
      </div>
    </div>
  );
});

export default Hero;
