"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "i18n/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { category } from "assets/les_variable";

// Import Icons
import {
  Truck,
  CreditCard,
  Headphones,
  Filter,
  X,
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  Grid3X3,
  List,
  ArrowUpDown,
} from "lucide-react";

// Lazy load slider component
import dynamic from "next/dynamic";
// const Slider = dynamic(() => import("react-slick"), { ssr: false });
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const ChildPage = ({ initialData }) => {
  const t = useTranslations("HomePage");
  const locale = useLocale();

  // États principaux
  const [data, setData] = useState(initialData || []);
  const [filteredData, setFilteredData] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(false);

  // États de filtrage
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 100000],
    searchTerm: "",
    sortBy: "name",
  });

  // États d'interface
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  // Configuration du slider
const slides = [
  {
    img: "/category_image/1755129659494.webp",
    title: "Mercerie",
    subtitle: "Notre collection complète, vous y trouverez tout ce dont vous avez besoin pour une couture confortable",
    cta: "Voir la collection",
    title_ar: "لوازم الخياطة",
    subtitle_ar: "مجموعتنا المتكاملة، تجدون فيها كل ما تحتاجونه لخياطة مريحة",
    cta_ar: "أنظر المجموعة",
    link_url: "Mercerie"
  },
  {
    img: "/category_image/1755302316240.webp",
    title: "Offres exceptionnelles",
    subtitle: "Une variété de pierres à des prix très compétitifs",
    cta: "Choisir ici",
    title_ar: "عروض استثنائية",
    subtitle_ar: "مجموعة متنوعة من الأحجار وبأسعار جد تنافسية",
    cta_ar: "إختر هنا",
    link_url: "Pierres"
  },
  {
    img: "/category_image/1755305612414.webp",
    title: "Accessories inoxydable",
    subtitle: "La meilleure qualité disponible sur le marché",
    cta: "Découvrez la collection",
    title_ar: "أكسيسوار مقاوم للصدأ",
    subtitle_ar: "أحسن نوعية واحسن جودة متواجدة في السوق",
    cta_ar: "اكتشفوا المجموعة",
    link_url: "PlaqueOr"
  },
];

  // Fonctions utilitaires
  const calculerPourcentageReduction = useCallback((ancienPrix, prix) => {
    if (ancienPrix <= 0 || prix <= 0 || ancienPrix <= prix) return 0;
    return Math.round(((ancienPrix - prix) / ancienPrix) * 100);
  }, []);

  const getMinMaxPrices = useMemo(() => {
    if (!data.length) return [0, 100000];
    const prices = data.map((item) => item.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [data]);

  // Fonction de filtrage principale
  const applyFilters = useCallback(() => {
    let filtered = [...data];

    // Filtrage par catégorie
    if (filters.category) {
      filtered = filtered.filter((item) => item.categorie === filters.category);
    }

    // Filtrage par terme de recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        (locale === "ar" ? item.title.ar : item.title.fr)
          .toLowerCase()
          .includes(searchLower)
      );
    }

    // Filtrage par prix
    filtered = filtered.filter(
      (item) =>
        item.price >= filters.priceRange[0] &&
        item.price <= filters.priceRange[1]
    );

    // Tri
    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => {
          const nameA = locale === "ar" ? a.title.ar : a.title.fr;
          const nameB = locale === "ar" ? b.title.ar : b.title.fr;
          return nameA.localeCompare(nameB);
        });
        break;
      default:
        // Garde l'ordre original pour "relevance"
        break;
    }

    setFilteredData(filtered);
  }, [data, filters, locale]);

  // Gestionnaires d'événements
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      priceRange: getMinMaxPrices,
      searchTerm: "",
      sortBy: "name",
    });
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        // toast.success("Retiré des favoris");
      } else {
        newFavorites.add(productId);
        // toast.success("Ajouté aux favoris");
      }
      return newFavorites;
    });
  };



  const scrollContainer = (direction) => {
    const container = document.getElementById("categories-scroll");
    const scrollAmount = 300;

    // Vérifier la direction du texte dans le conteneur
    const isRTL = locale === "ar";

    let newPosition;

    if (isRTL) {
      // En RTL, les directions sont inversées
      newPosition =
        direction === "right"
          ? scrollPosition + scrollAmount
          : Math.min(0, scrollPosition - scrollAmount);
    } else {
      // En LTR, comportement normal
      newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
    }

    container.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  // Effets
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (data.length > 0) {
      const [min, max] = getMinMaxPrices;
      setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
    }
  }, [data, getMinMaxPrices]);

    const optimizeCloudinaryUrl = (url) => {
  
    return url.replace('/upload/', '/upload/q_auto:good,f_webp/');
  };

  return (
    <div className="border py-4 sm:py-8 px-3 sm:px-6 md:rounded-lg dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Section Slider Héro */}
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden mb-8 sm:mb-12 lg:mb-16 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl">
        <div className="absolute inset-0">
        {slides.map((slide, index) => (
  <div
    key={index}
    className={`absolute inset-0 transition-all duration-1000 ${
      index === currentSlide
        ? "opacity-100 scale-100"
        : "opacity-0 scale-105"
    }`}
  >
  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/70 via-gray-800/50 to-gray-800/70 z-10 rounded-lg sm:rounded-2xl"></div>
    <Image
      src={slide.img}
      alt={slide.title}
      className="w-full h-full object-cover rounded-lg sm:rounded-2xl"
      style={{ 
        objectFit: "cover",
        objectPosition: "center center",
        display: "block",
        margin: "0 auto"
      }}
      quality={80}
        fill
      
    />

    <div className="absolute inset-0 z-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl lg:max-w-2xl">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight text-white bg-clip-text">
            {locale === "fr" ? slide.title : slide.title_ar}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 lg:mb-8 font-light ">
            {locale === "fr" ? slide.subtitle : slide.subtitle_ar}
          </p>
          
          <Link
            href={`/product_category/${slides[currentSlide].link_url}`} // Utilise correctement slide de l'itération courante
            className="bg-gradient-to-r from-[var(--or_color)] via-[var(--or_color2)] to-yellow-600 text-white px-4 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg sm:shadow-2xl text-xs sm:text-sm lg:text-base font-semibold hover:shadow-yellow-500/25"
            style={{
              "--or_color": "#D4AF37",
              "--or_color2": "#FFD700",
            }}
          >
            {locale === "fr" ? slide.cta : slide.cta_ar}
          </Link>
        </div>
      </div>
    </div>
  </div>
))}
        </div>

        {/* Indicateurs du slider */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#D4AF37] scale-125 shadow-lg shadow-yellow-500/50"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Section Services */}
      {/*
      <section className="py-4 sm:py-8 lg:py-10 mb-3.5 sm:mb-5 lg:mb-7">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Headphones,
                title: "Support en ligne",
                desc: "Assistance disponible à tout moment",
                title_ar: "دعم عبر الإنترنت",
                desc_ar: "المساعدة متاحة في أي وقت",
              },
              {
                icon: CreditCard,
                title: "Paiement à la livraison",
                desc: "Transactions 100% sécurisées",
                title_ar: "الدفع عند التسليم",
                desc_ar: "معاملات آمنة بنسبة 100%",
              },
              {
                icon: Truck,
                title: "Livraison Rapide",
                desc: "Livraison rapide et sécurisée",
                title_ar: "توصيل سريع",
                desc_ar: "تسليم سريع وآمن",
              },
            ].map((service, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-yellow-600 rounded-full mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:shadow-yellow-500/25">
                  <service.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold mb-1 sm:mb-2 lg:mb-3 dark:text-white group-hover:text-[#D4AF37] transition-colors">
                  {locale === "fr" ? service.title : service.title_ar}
                </h3>
                
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Section Catégories */}
      <div className="py-8 sm:py-12 lg:py-16 mb-8 sm:mb-12 lg:mb-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-24 sm:max-w-48 lg:max-w-xs"></div>
            <span className="mx-3 sm:mx-4 lg:mx-6 text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#D4AF37] dark:text-[#FFD700] px-2 sm:px-4">
              {t("popularCategories")}
            </span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-24 sm:max-w-48 lg:max-w-xs"></div>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollContainer("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg sm:shadow-xl rounded-full p-2 sm:p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:scale-110 -ml-4 sm:-ml-6"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <button
              onClick={() => scrollContainer("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg sm:shadow-xl rounded-full p-2 sm:p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:scale-110 -mr-4 sm:-mr-6"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div
              id="categories-scroll"
              className="flex gap-3 sm:gap-4 lg:gap-6 xl:gap-8 overflow-x-auto scrollbar-hide pb-4 sm:pb-6 px-6 sm:px-8 lg:px-12"
            >
              {category.map((cat, index) => (
                <Link
                  key={index}
                  href={`/product_category/${cat.name_search}`}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 transform  border border-gray-100 dark:border-gray-700 min-w-[120px] sm:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px] group-hover:border-[#D4AF37]/50">
                    <div className="relative">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ring-2 sm:ring-4 ring-gray-200 dark:ring-gray-600 group-hover:ring-[#D4AF37] group-hover:scale-110">
                        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900 dark:to-orange-800 flex items-center justify-center">
                          <Image
                            src={cat.img_url}
                            alt={cat.name}
                            fill
                            quality={65}
                            sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 112px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                      
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-xs sm:text-sm lg:text-base text-gray-800 dark:text-gray-200 group-hover:text-[#D4AF37] dark:group-hover:text-[#FFD700] transition-colors duration-300 text-center">
                        {locale === "ar" ? cat.name_ar : cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Filtres et Produits */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* En-tête avec filtres */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#D4AF37] dark:text-[#FFD700]">
              {t("plusvendus")}
            </h2>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {filteredData.length} {t("products")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Barre de recherche */}
            <div className="relative order-2 sm:order-1">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder={t("Rechercher")}
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all w-full sm:w-48 lg:w-64 text-sm sm:text-base"
              />
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-3 order-1 sm:order-2">
              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  showFilters
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t("Filtres")}</span>
              </button>

                {/* Filtre par tri */}
              <div>
                {/* <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                  {t("sortBy")}
                </label> */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] text-xs sm:text-sm"
                >
                  <option value="name">{t("NomAZ")}</option>
                  {/* <option value="relevance"> {t("relevance")}</option> */}
                  <option value="price-asc"> {t("priceHighToLow")} </option>
                  <option value="price-desc"> {t("priceLowToHigh")}</option>
              
                </select>
              </div>

              {/* Sélecteur de vue */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 sm:p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 shadow"
                      : ""
                  }`}
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 sm:p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 shadow"
                      : ""
                  }`}
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 shadow-md sm:shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {/* Filtre par catégorie */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                  {t("Catégorie")}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] text-xs sm:text-sm"
                >
                  <option value=""> {t("Touteslescatégories")}</option>
                  {category.map((cat, index) => (
                    <option key={index} value={cat.name_search}>
                      {locale === "ar" ? cat.name_ar : cat.name}
                    </option>
                  ))}
                </select>
              </div>

            

              {/* Filtre par prix */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                  {t("Prix")}
                </label>
                <div className="space-y-2">
                  <div className="flex gap-1 sm:gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          +e.target.value,
                          filters.priceRange[1],
                        ])
                      }
                      className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          filters.priceRange[0],
                          +e.target.value,
                        ])
                      }
                      className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                onClick={resetFilters}
                className="px-3 sm:px-6 py-1.5 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
              >
                {t("Réinitialiser")}
              </button>
            </div>
          </div>
        )}

        {/* Grille de produits */}
        {isLoading ? (
          <div
            className={`grid gap-3 sm:gap-4 lg:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl overflow-hidden shadow animate-pulse ${
                  viewMode === "list"
                    ? "flex h-32 sm:h-40"
                    : "h-48 sm:h-56 md:h-64"
                }`}
              />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-3 sm:gap-4 lg:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const reduction = calculerPourcentageReduction(
                  item.ancien_price,
                  item.price
                );
                const isFavorite = favorites.has(item._id);
                const hasSecondImage = item.array_ProductImg[1]?.secure_url;

                return (
                    <Link
                    key={index}
                      href={`/product_detail/${item._id}`}
                      className={` bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group  ${
                        viewMode === "list"
                          ? "flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4"
                          : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list"
                            ? "w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-full flex-shrink-0"
                            : "pt-[100%]"
                        }`}
                      >
                        {/* Image principale */}
                        <Image
                          src={optimizeCloudinaryUrl(item.array_ProductImg[0]?.secure_url) || "/images/gg1.webp"}
                          alt={locale === "ar" ? item.title.ar : item.title.fr}
                          fill
                          sizes={
                            viewMode === "list"
                              ? "(max-width: 640px) 100vw, 192px"
                              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          }
                          className={`object-cover transition-all duration-500 ease-in-out ${
                            viewMode === "list" ? "rounded-lg" : ""
                          } ${
                            hasSecondImage 
                              ? "group-hover:opacity-0 group-hover:scale-110" 
                              : "group-hover:scale-105"
                          }`}
                          loading={index < 4 ? "eager" : "lazy"}
                  
                        />

                        {/* Image au hover (seulement si elle existe) */}
                        {hasSecondImage && (
                          <Image
                            src={item.array_ProductImg[1].secure_url}
                              src={optimizeCloudinaryUrl(item.array_ProductImg[1].secure_url)}
                            alt={locale === "ar" ? item.title.ar : item.title.fr}
                            fill
                            sizes={
                              viewMode === "list"
                                ? "(max-width: 640px) 100vw, 192px"
                                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            }
                            className={`object-cover transition-all duration-500 ease-in-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-105 ${
                              viewMode === "list" ? "rounded-lg" : ""
                            }`}
                            loading="lazy"
                        
                          />
                        )}

                        {reduction > 0 && (
                          <div
                            className={`absolute top-2 ${
                              locale === "ar" ? "left-2" : "right-2"
                            } bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow transition-all duration-300 group-hover:scale-110`}
                          >
                            -{reduction}%
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(item._id);
                          }}
                          className={`absolute top-2 ${
                            locale === "ar" ? "right-2" : "left-2"
                          } p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isFavorite
                              ? "bg-red-500 text-white shadow-md"
                              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
                              isFavorite ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div 
                        className={`p-2 sm:p-3 ${
                          viewMode === "list" ? "flex-1" : ""
                        }`}
                      >
                        <div className="block">
                          <h3
                            className={`font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 ${
                              viewMode === "list"
                                ? "text-sm sm:text-base"
                                : "text-xs sm:text-sm min-h-[3em]"
                            }`}
                          >
                            {locale === "ar" ? item.title.ar : item.title.fr}
                          </h3>

                          <div className="flex items-center gap-1 sm:gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#D4AF37] text-[#D4AF37] transition-transform duration-300 group-hover:scale-110" />
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {item.rating || 4.5}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {item.ancien_price > 0 && (
                              <span className="line-through text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                {item.ancien_price.toLocaleString()} DZD
                              </span>
                            )}
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#D4AF37] transition-colors duration-300">
                              {item.price.toLocaleString()} DZD
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {/* <Link
                            href={`/product_detail/${item._id}`}
                            className="flex-1"
                          > */}
                            <button className="flex justify-center items-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white py-1.5 sm:py-2 px-3 rounded-lg hover:from-[#C9A227] hover:to-[#E6C200] transition-all duration-300 font-medium text-xs sm:text-sm hover:shadow-md hover:shadow-yellow-500/25 transform hover:scale-[1.02] active:scale-[0.98]">
                              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
                              {t("viewDetails")}
                            </button>
                          {/* </Link> */}
                        </div>
                      </div>
                    </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t("AucunProduit")}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                    {t("EssayezModifierFiltrage")}
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#D4AF37] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#C9A227] transition-colors text-sm sm:text-base"
                  >
                    {t("Réinitialiser")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination (optionnelle) */}
        {filteredData.length > 15 && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                {t("Précédent")}
              </button>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D4AF37] text-white rounded-lg text-xs sm:text-sm">
                1
              </span>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                2
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                3
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                {t("Suivant")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Styles personnalisés */}
      <style jsx global>{`
        :root {
          --or_color: #d4af37;
          --or_color2: #ffd700;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ChildPage;
