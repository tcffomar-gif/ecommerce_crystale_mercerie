"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const RelatedProducts = ({ productId, currentProductCategory }) => {
  const locale = useLocale();
  const t = useTranslations("relatedProducts");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MY_URL}/api/get_related_products?id=${productId}&limit=8`
        );
        if (res.ok) {
          const data = await res.json();
          setRelatedProducts(data);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();

    // Charger les favoris depuis localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, [productId]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify([...newFavorites]));
  };

  const optimizeCloudinaryUrl = (url) => {
    return url?.replace('/upload/', '/upload/q_auto:good,f_webp,w_300,c_fill/') || "/images/gg1.webp";
  };

  const calculerPourcentageReduction = (ancienPrix, prix) => {
    if (!ancienPrix || ancienPrix <= 0 || !prix || prix <= 0 || ancienPrix <= prix) return 0;
    return Math.round(((ancienPrix - prix) / ancienPrix) * 100);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= relatedProducts.length - 3 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, relatedProducts.length - 4) : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="mt-12 animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg dark:shadow-gray-700">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#3e3e3e] dark:text-white">
        {t("relatedProducts") || "Produits similaires"}
      </h2>

      {/* Version Desktop - Carousel */}
      <div className="hidden md:block relative">
        {relatedProducts.length > 4 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              aria-label="Next products"
            >
              <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
          </>
        )}
        
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                locale={locale}
                t={t}
                calculerPourcentageReduction={calculerPourcentageReduction}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                optimizeCloudinaryUrl={optimizeCloudinaryUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Version Mobile - Grid */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {relatedProducts.slice(0, 4).map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            locale={locale}
            t={t}
            calculerPourcentageReduction={calculerPourcentageReduction}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            optimizeCloudinaryUrl={optimizeCloudinaryUrl}
          />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ item, locale, t, calculerPourcentageReduction, toggleFavorite, favorites, optimizeCloudinaryUrl }) => {
  const isFavorite = favorites.has(item._id);
  const reduction = calculerPourcentageReduction(item.ancien_price, item.price);
  const hasSecondImage = item.array_ProductImg[1]?.secure_url;

  return (
    <Link
      href={`/product_detail/${item._id}`}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex-shrink-0 w-full md:w-[calc(25%-12px)]"
    >
      <div className="relative pt-[100%] overflow-hidden">
        <Image
          unoptimized={true}
          src={optimizeCloudinaryUrl(item.array_ProductImg[0]?.secure_url)}
          alt={locale === "ar" ? item.title.ar : item.title.fr}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className={`object-cover transition-all duration-500 ${
            hasSecondImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />

        {hasSecondImage && (
          <Image
            src={optimizeCloudinaryUrl(item.array_ProductImg[1].secure_url)}
            alt={locale === "ar" ? item.title.ar : item.title.fr}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-all duration-500 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
            unoptimized={true}
          />
        )}

        {reduction > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -{reduction}%
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(item._id);
          }}
          className={`absolute top-2 left-2 p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 ${
            isFavorite
              ? "bg-red-500 text-white shadow-md"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 min-h-[2.5em] group-hover:text-[#D4AF37] transition-colors">
          {locale === "ar" ? item.title.ar : item.title.fr}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {item.rating || 4.5}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {item.ancien_price > 0 && (
            <span className="line-through text-gray-500 dark:text-gray-400 text-xs">
              {item.ancien_price.toLocaleString()} DZD
            </span>
          )}
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#D4AF37]">
            {item.price.toLocaleString()} DZD
          </span>
        </div>

        <button className="flex justify-center items-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white py-2 px-3 rounded-lg hover:from-[#C9A227] hover:to-[#E6C200] transition-all duration-300 text-sm font-medium hover:shadow-md transform hover:scale-[1.02]">
          <ShoppingCart className="w-4 h-4" />
          {t("viewDetails") || "Voir détails"}
        </button>
      </div>
    </Link>
  );
};

export default RelatedProducts;