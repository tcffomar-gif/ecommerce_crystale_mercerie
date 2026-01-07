
// // // app/(pages)/product_detail/[id]/P_catgory.jsx
// // "use client";
// // import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
// // import { useTranslations, useLocale } from "next-intl";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { Link } from "i18n/navigation";
// // import Image from "next/image";
// // import { toast } from "react-toastify";
// // import { 
// //   Truck, CreditCard, Headphones, X, Search, SlidersHorizontal, 
// //   Star, Heart, ShoppingCart, Grid3X3, List, ArrowUpDown, 
// //   ChevronLeft, ChevronRight, Check, Filter 
// // } from "lucide-react";
// // import { category } from 'assets/les_variable';

// // // Utilitaires d'optimisation d'images
// // const cloudinaryOptimizer = {
// //   basic: (url) => {
// //     if (!url || !url.includes('cloudinary.com')) return url;
// //     return url.replace('/upload/', '/upload/q_auto:good,f_webp,w_auto,dpr_auto/');
// //   },
  
// //   thumbnail: (url, width = 300) => {
// //     if (!url || !url.includes('cloudinary.com')) return url;
// //     return url.replace('/upload/', `/upload/q_auto:good,f_webp,w_${width},c_fill/`);
// //   },
  
// //   detailed: (url, width = 800) => {
// //     if (!url || !url.includes('cloudinary.com')) return url;
// //     return url.replace('/upload/', `/upload/q_auto:best,f_webp,w_${width}/`);
// //   }
// // };

// // const CategoryHeader = ({ 
// //   currentCategory, 
// //   locale = "fr",
// //   categoryList = category
// // }) => {
// //   const scrollContainerRef = useRef(null);
    
// //   const current = categoryList.find(cat => cat.name_search === currentCategory) || categoryList[0];
// //   const otherCategories = categoryList.filter(cat => cat.name_search !== currentCategory);

// //   const scrollContainer = (direction) => {
// //     const container = scrollContainerRef.current;
// //     if (container) {
// //       const scrollAmount = 200;
// //       container.scrollTo({
// //         left: direction === 'left' 
// //           ? container.scrollLeft - scrollAmount 
// //           : container.scrollLeft + scrollAmount,
// //         behavior: 'smooth'
// //       });
// //     }
// //   };

// //   const t = useTranslations("HomePage");

// //   return (
// //     <div className="relative">
// //       <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-r rounded-t-lg">
// //         <div 
// //           className="absolute inset-0 bg-cover bg-center"
// //           style={{ backgroundImage: `url(${current.img_url})` }}
// //         >
// //           <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-800/40 to-gray-800/50 z-10 rounded-lg sm:rounded-2xl"></div>

// //           <div className="relative z-10 h-full flex items-center justify-center">
// //             <div className="text-center">
// //               <div className="mx-auto mb-4 relative">
// //                 <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm ring-4 ring-white/30 ring-offset-2 ring-offset-amber-400/50">
// //                   <Image
// //                     src={cloudinaryOptimizer.thumbnail(current.img_url, 112)}
// //                     alt={locale === "ar" ? current.name_ar : current.name}
// //                     className="w-full h-full object-cover"
// //                     onError={(e) => {
// //                       e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
// //                     }}
// //                     fill
// //                     sizes="(max-width: 640px) 100vw, 192px"
// //                     loading="lazy"
// //                     unoptimized={false}
// //                   />
// //                 </div>
// //               </div>

// //               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
// //                 {locale === "ar" ? current.name_ar : current.name}
// //               </h1>
              
// //               <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium drop-shadow">
// //                 {t("Découvreznotresélectionpremium")}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //           <div className="flex items-center justify-between mb-4">
// //             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
// //               <Filter className="w-5 h-5 text-amber-500 dark:text-amber-400" />
// //               {t("AutresCatégories")}
// //             </h2>
            
// //             <div className="hidden sm:flex gap-2" dir='ltr'>
// //               <button
// //                 onClick={() => scrollContainer('left')}
// //                 className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all shadow-sm"
// //               >
// //                 <ChevronLeft className="w-5 h-5" />
// //               </button>
// //               <button
// //                 onClick={() => scrollContainer('right')}
// //                 className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all shadow-sm"
// //               >
// //                 <ChevronRight className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>

// //           <div className="relative">
// //             <button
// //               onClick={() => scrollContainer('left')}
// //               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 transition-all border border-gray-200 dark:border-gray-600 -ml-2 sm:hidden hover:bg-amber-50 dark:hover:bg-amber-900/20"
// //             >
// //               <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
// //             </button>

// //             <button
// //               onClick={() => scrollContainer('right')}
// //               className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 transition-all border border-gray-200 dark:border-gray-600 -mr-2 sm:hidden hover:bg-amber-50 dark:hover:bg-amber-900/20"
// //             >
// //               <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
// //             </button>

// //             <div
// //               ref={scrollContainerRef}
// //               className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 px-6 sm:px-0"
// //             >
// //               {otherCategories.map((category) => (
// //                 <Link
// //                   href={`/product_category/${category.name_search}`}
// //                   key={category.name_search}
// //                   className="flex-shrink-0 group cursor-pointer my-0.5"
// //                 >
// //                   <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-700 min-w-[100px] sm:min-w-[120px] hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10">
// //                     <div className="relative">
// //                       <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-300 bg-white dark:bg-gray-700 shadow-[0_0_0_2px_rgba(212,184,20,0.25)] group-hover:shadow-[0_0_0_2px_rgba(237,214,88,1)]">
// //                         <Image
// //                           src={cloudinaryOptimizer.thumbnail(category.img_url, 56)}
// //                           alt={locale === "ar" ? category.name_ar : category.name}
// //                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl"
// //                           onError={(e) => {
// //                             e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
// //                           }}
// //                           fill
// //                           loading="lazy"
// //                           unoptimized={false}
// //                         />
// //                       </div>
// //                       <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-white dark:ring-gray-800 bg-amber-400" />
// //                     </div>

// //                     <div className="text-center">
// //                       <h3 className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 leading-tight group-hover:text-amber-500 dark:group-hover:text-amber-400">
// //                         {locale === "ar" ? category.name_ar : category.name}
// //                       </h3>
// //                     </div>
// //                   </div>
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <style jsx global>{`
// //         .scrollbar-hide {
// //           -ms-overflow-style: none;
// //           scrollbar-width: none;
// //         }
// //         .scrollbar-hide::-webkit-scrollbar {
// //           display: none;
// //         }
// //         .line-clamp-2 {
// //           display: -webkit-box;
// //           -webkit-line-clamp: 2;
// //           -webkit-box-orient: vertical;
// //           overflow: hidden;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // const ProductCard = ({ item, index, locale, t, calculerPourcentageReduction, viewMode = "grid", toggleFavorite, favorites }) => {
// //   const isFavorite = favorites.has(item._id);
// //   const reduction = calculerPourcentageReduction(item.ancien_price, item.price);
// //   const hasSecondImage = item.array_ProductImg[1]?.secure_url;

// //   const getOptimizedImageUrl = (image, isHover = false) => {
// //     if (!image?.secure_url) return "/images/gg1.webp";
    
// //     const width = viewMode === "list" ? 400 : 300;
// //     const quality = isHover ? "auto:low" : "auto:good";
    
// //     return image.secure_url.replace(
// //       '/upload/', 
// //       `/upload/q_${quality},f_webp,w_${width},c_fill/`
// //     );
// //   };

// //   return (
// //     <Link
// //       href={`/product_detail/${item._id}`}
// //       className={`bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group ${
// //         viewMode === "list" ? "flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4" : ""
// //       }`}
// //     >
// //       <div
// //         className={`relative overflow-hidden ${
// //           viewMode === "list" ? "w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-full flex-shrink-0" : "pt-[100%]"
// //         }`}
// //       >
// //         <Image
// //           unoptimized={true}
// //           src={getOptimizedImageUrl(item.array_ProductImg[0], false)}
// //           alt={locale === "ar" ? item.title.ar : item.title.fr}
// //           fill
// //           sizes={
// //             viewMode === "list"
// //               ? "(max-width: 640px) 100vw, 192px"
// //               : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
// //           }
// //           className={`object-cover transition-all duration-500 ease-in-out ${
// //             viewMode === "list" ? "rounded-lg" : ""
// //           } ${hasSecondImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-105"}`}
// //           loading={index < 4 ? "eager" : "lazy"}
// //         />

// //         {hasSecondImage && (
// //           <Image
// //             src={getOptimizedImageUrl(item.array_ProductImg[1], true)}
// //             alt={locale === "ar" ? item.title.ar : item.title.fr}
// //             fill
// //             sizes={
// //               viewMode === "list"
// //                 ? "(max-width: 640px) 100vw, 192px"
// //                 : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
// //             }
// //             className={`object-cover transition-all duration-500 ease-in-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-105 ${
// //               viewMode === "list" ? "rounded-lg" : ""
// //             }`}
// //             loading="lazy"
// //             unoptimized={true}
// //           />
// //         )}

// //         {reduction > 0 && (
// //           <div
// //             className={`absolute top-2 ${
// //               locale === "ar" ? "left-2" : "right-2"
// //             } bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow transition-all duration-300 group-hover:scale-110`}
// //           >
// //             -{reduction}%
// //           </div>
// //         )}

// //         <button
// //           onClick={(e) => {
// //             e.preventDefault();
// //             toggleFavorite(item._id);
// //           }}
// //           className={`absolute top-2 ${
// //             locale === "ar" ? "right-2" : "left-2"
// //           } p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 ${
// //             isFavorite
// //               ? "bg-red-500 text-white shadow-md"
// //               : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
// //           }`}
// //         >
// //           <Heart
// //             className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
// //               isFavorite ? "fill-current" : ""
// //             }`}
// //           />
// //         </button>
// //       </div>

// //       <div className={`p-2 sm:p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
// //         <div className="block">
// //           <h3
// //             className={`font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 ${
// //               viewMode === "list" ? "text-sm sm:text-base" : "text-xs sm:text-sm min-h-[3em]"
// //             }`}
// //           >
// //             {locale === "ar" ? item.title.ar : item.title.fr}
// //           </h3>

// //           <div className="flex items-center gap-1 sm:gap-2 mb-2">
// //             <div className="flex items-center gap-1">
// //               <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#D4AF37] text-[#D4AF37] transition-transform duration-300 group-hover:scale-110" />
// //               <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
// //                 {item.rating || 4.5}
// //               </span>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-2 mb-3">
// //             {item.ancien_price > 0 && (
// //               <span className="line-through text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
// //                 {item.ancien_price.toLocaleString()} DZD
// //               </span>
// //             )}
// //             <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#D4AF37] transition-colors duration-300">
// //               {item.price.toLocaleString()} DZD
// //             </span>
// //           </div>
// //         </div>

// //         <div className="flex gap-2">
// //           <Link href={`/product_detail/${item._id}`} className="flex-1">
// //             <button className="flex justify-center items-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white py-1.5 sm:py-2 px-3 rounded-lg hover:from-[#C9A227] hover:to-[#E6C200] transition-all duration-300 font-medium text-xs sm:text-sm hover:shadow-md hover:shadow-yellow-500/25 transform hover:scale-[1.02] active:scale-[0.98]">
// //               <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
// //               {t("viewDetails")}
// //             </button>
// //           </Link>
// //         </div>
// //       </div>
// //     </Link>
// //   );
// // };

// // const PaginationComponent = ({ pagination, currentPage, onPageChange }) => {
// //   if (!pagination || pagination.totalPages <= 1) return null;

// //   const pages = [];
// //   const maxVisiblePages = 5;
// //   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
// //   let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

// //   if (endPage - startPage + 1 < maxVisiblePages) {
// //     startPage = Math.max(1, endPage - maxVisiblePages + 1);
// //   }

// //   for (let i = startPage; i <= endPage; i++) {
// //     pages.push(i);
// //   }

// //   return (
// //     <div className="flex justify-center items-center mt-8 gap-2">
// //       <button
// //         onClick={() => onPageChange(currentPage - 1)}
// //         disabled={!pagination.hasPrev}
// //         className={`p-2 rounded-lg border ${
// //           !pagination.hasPrev
// //             ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
// //             : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
// //         }`}
// //       >
// //         <ChevronLeft className="w-4 h-4" />
// //       </button>

// //       {pages.map(page => (
// //         <button
// //           key={page}
// //           onClick={() => onPageChange(page)}
// //           className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
// //             currentPage === page
// //               ? 'bg-amber-500 text-white border-amber-500'
// //               : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
// //           }`}
// //         >
// //           {page}
// //         </button>
// //       ))}

// //       <button
// //         onClick={() => onPageChange(currentPage + 1)}
// //         disabled={!pagination.hasNext}
// //         className={`p-2 rounded-lg border ${
// //           !pagination.hasNext
// //             ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
// //             : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
// //         }`}
// //       >
// //         <ChevronRight className="w-4 h-4" />
// //       </button>
// //     </div>
// //   );
// // };

// // const PCatgory = ({ products, pagination, category }) => {
// //   const t = useTranslations("HomePage");
// //   const locale = useLocale();
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
  
// //   const [filteredData, setFilteredData] = useState(products || []);
// //   const [favorites, setFavorites] = useState(new Set());
// //   const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  
// //   const [filters, setFilters] = useState({
// //     category: "",
// //     priceRange: [0, 100000],
// //     searchTerm: "",
// //     sortBy: "name",
// //   });
  
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [viewMode, setViewMode] = useState("grid");

// //   const getMinMaxPrices = useMemo(() => {
// //     if (!products || products.length === 0) return [0, 100000];
// //     const prices = products.map(item => item.price);
// //     return [Math.min(...prices), Math.max(...prices)];
// //   }, [products]);

// //   const calculerPourcentageReduction = useCallback((ancienPrix, prix) => {
// //     if (ancienPrix <= 0 || prix <= 0 || ancienPrix <= prix) return 0;
// //     return Math.round(((ancienPrix - prix) / ancienPrix) * 100);
// //   }, []);

// //   const applyFilters = useCallback(() => {
// //     let filtered = [...products];

// //     if (filters.searchTerm) {
// //       const searchLower = filters.searchTerm.toLowerCase();
// //       filtered = filtered.filter(item => 
// //         (locale === "ar" ? item.title.ar : item.title.fr)
// //           .toLowerCase()
// //           .includes(searchLower)
// //       );
// //     }

// //     filtered = filtered.filter(item => 
// //       item.price >= filters.priceRange[0] && 
// //       item.price <= filters.priceRange[1]
// //     );

// //     switch (filters.sortBy) {
// //       case "price-asc":
// //         filtered.sort((a, b) => a.price - b.price);
// //         break;
// //       case "price-desc":
// //         filtered.sort((a, b) => b.price - a.price);
// //         break;
// //           case "name":
// //         filtered.sort((a, b) => {
// //           const nameA = locale === "ar" ? a.title.ar : a.title.fr;
// //           const nameB = locale === "ar" ? b.title.ar : b.title.fr;
// //           return nameA.localeCompare(nameB);
// //         });
// //         break;
// //       default:
// //         break;
// //     }

// //     setFilteredData(filtered);
// //   }, [products, filters, locale]);

// //   const handleFilterChange = (filterType, value) => {
// //     setFilters(prev => ({ ...prev, [filterType]: value }));
// //   };

// //   const resetFilters = () => {
// //     setFilters({
// //       category: "",
// //       priceRange: getMinMaxPrices,
// //       searchTerm: "",
// //       sortBy: "name",
// //     });
// //   };

// //   const toggleFavorite = (productId) => {
// //     setFavorites(prev => {
// //       const newFavorites = new Set(prev);
// //       if (newFavorites.has(productId)) {
// //         newFavorites.delete(productId);
// //       } else {
// //         newFavorites.add(productId);
// //       }
// //       return newFavorites;
// //     });
// //   };

// // const handlePageChange = (newPage) => {
// //   const params = new URLSearchParams(searchParams.toString());
// //   params.set('page', newPage);
// //   router.push(`?${params.toString()}`, { scroll: false });
// //   setCurrentPage(newPage);
  
// //   // Défiler vers le haut
// //   window.scrollTo({ top: 40, behavior: 'smooth' });
// // };

// //   useEffect(() => {
// //     applyFilters();
// //   }, [applyFilters]);

// //   useEffect(() => {
// //     if (products && products.length > 0) {
// //       const [min, max] = getMinMaxPrices;
// //       setFilters(prev => ({ ...prev, priceRange: [min, max] }));
// //     }
// //   }, [products, getMinMaxPrices]);

// //   const formattedCategory = category.replace(/-/g, " ");

// //   return (
// //     <div className="border border-gray-200 dark:border-gray-700 py-8 px-4 sm:py-12 sm:px-6 md:rounded-xl bg-white dark:bg-gray-800 shadow-sm">
// //       <CategoryHeader currentCategory={category} locale={locale} />

// //       <div className="flex flex-col gap-3.5 items-start justify-normal mb-8">
// //         <div className="flex items-center justify-center w-full mb-4 md:mb-0">
// //           <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-xs"></div>
// //           <h2 className="text-xl font-semibold text-[#D4AF37] dark:text-[#FFD700] px-4 whitespace-nowrap">
// //             {t(category)}
// //           </h2>
// //           <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-xs"></div>
// //         </div>

// //         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-4">
// //           <div className="flex items-center gap-2 sm:gap-4">
// //             <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
// //               {filteredData.length} {filteredData.length > 1 ? t("products") : t("product")}
// //             </span>
// //           </div>

// //           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
// //             <div className="relative">
// //               <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
// //               <input
// //                 type="text"
// //                 placeholder={t("Rechercher")}
// //                 value={filters.searchTerm}
// //                 onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
// //                 className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all w-full sm:w-48 lg:w-64 text-sm sm:text-base"
// //               />
// //             </div>

// //             <div className="flex items-center gap-2 sm:gap-3">
// //               <button
// //                 onClick={() => setShowFilters(!showFilters)}
// //                 className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
// //                   showFilters 
// //                     ? "bg-[#D4AF37] text-white" 
// //                     : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
// //                 }`}
// //               >
// //                 <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
// //                 <span className="hidden sm:inline">{t("Filtres")}</span>
// //               </button>

// //                 {/* Filtre par tri */}
// //               <div>
              
            

// //                   <select
// //                 value={filters.sortBy}
// //                 onChange={(e) => handleFilterChange("sortBy", e.target.value)}
// //                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] text-xs sm:text-sm"
// //               >
// //                   <option value="name">{t("NomAZ")}</option>
// //                 {/* <option value="relevance">{t("relevance")}</option> */}
// //                 <option value="price-asc">{t("priceLowToHigh")}</option>
// //                 <option value="price-desc">{t("priceHighToLow")}</option>
// //               </select>

// //               </div>

                

// //               <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
// //                 <button
// //                   onClick={() => setViewMode("grid")}
// //                   className={`p-1 sm:p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
// //                 >
// //                   <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
// //                 </button>
// //                 <button
// //                   onClick={() => setViewMode("list")}
// //                   className={`p-1 sm:p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
// //                 >
// //                   <List className="w-3 h-3 sm:w-4 sm:h-4" />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {showFilters && (
// //         <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 shadow-md sm:shadow-lg">
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        

// //             <div>
// //               <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
// //                 {t("Prix")}
// //               </label>
// //               <div className="space-y-2">
// //                 <div className="flex gap-1 sm:gap-2">
// //                   <input
// //                     type="number"
// //                     placeholder={"min"}
// //                     value={filters.priceRange[0]}
// //                     onChange={(e) => handleFilterChange("priceRange", [+e.target.value, filters.priceRange[1]])}
// //                     className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
// //                   />
// //                   <input
// //                     type="number"
// //                     placeholder={"max"}
// //                     value={filters.priceRange[1]}
// //                     onChange={(e) => handleFilterChange("priceRange", [filters.priceRange[0], +e.target.value])}
// //                     className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex justify-end mt-4 sm:mt-6">
// //             <button
// //               onClick={resetFilters}
// //               className="px-3 sm:px-6 py-1.5 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
// //             >
// //               {t("Réinitialiser")}
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {filteredData.length > 0 ? (
// //         <>
// //           <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
// //             viewMode === "grid" 
// //               ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
// //               : "grid-cols-1"
// //           }`}>
// //             {filteredData.map((item, index) => (
// //               <ProductCard
// //                 key={item._id}
// //                 item={item}
// //                 index={index}
// //                 locale={locale}
// //                 t={t}
// //                 viewMode={viewMode}
// //                 calculerPourcentageReduction={calculerPourcentageReduction}
// //                 toggleFavorite={toggleFavorite}
// //                 favorites={favorites}
// //               />
// //             ))}
// //           </div>
          
// //           <PaginationComponent
// //             pagination={pagination}
// //             currentPage={currentPage}
// //             onPageChange={handlePageChange}
// //           />
// //         </>
// //       ) : (
// //         <div className="text-center py-12">
// //           <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
// //             <svg
// //               className="w-8 h-8 text-gray-400"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth="1.5"
// //                 d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
// //               />
// //             </svg>
// //           </div>
// //           <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
// //             {t("noProductsFound")}
// //           </h3>
// //           <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
// //             {t("aucun_produit")}
// //           </p>
// //           <Link
// //             href="/"
// //             className="inline-block px-6 py-2 bg-[#D4AF37] dark:bg-[#FFD700] text-white rounded-lg hover:shadow transition-all"
// //           >
// //             {t("continueShopping")}
// //           </Link>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PCatgory;



// // app/(pages)/product_detail/[id]/P_catgory.jsx
// "use client";
// import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
// import { useTranslations, useLocale } from "next-intl";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Link } from "i18n/navigation";
// import Image from "next/image";
// import { toast } from "react-toastify";
// import { 
//   Truck, CreditCard, Headphones, X, Search, SlidersHorizontal, 
//   Star, Heart, ShoppingCart, Grid3X3, List, ArrowUpDown, 
//   ChevronLeft, ChevronRight, Check, Filter 
// } from "lucide-react";
// import { category } from 'assets/les_variable';

// // Utilitaires d'optimisation d'images
// const cloudinaryOptimizer = {
//   basic: (url) => {
//     if (!url || !url.includes('cloudinary.com')) return url;
//     return url.replace('/upload/', '/upload/q_auto:good,f_webp,w_auto,dpr_auto/');
//   },
  
//   thumbnail: (url, width = 300) => {
//     if (!url || !url.includes('cloudinary.com')) return url;
//     return url.replace('/upload/', `/upload/q_auto:good,f_webp,w_${width},c_fill/`);
//   },
  
//   detailed: (url, width = 800) => {
//     if (!url || !url.includes('cloudinary.com')) return url;
//     return url.replace('/upload/', `/upload/q_auto:best,f_webp,w_${width}/`);
//   }
// };

// const CategoryHeader = ({ 
//   currentCategory, 
//   locale = "fr",
//   categoryList = category
// }) => {
//   const scrollContainerRef = useRef(null);
    
//   const current = categoryList.find(cat => cat.name_search === currentCategory) || categoryList[0];
//   const otherCategories = categoryList.filter(cat => cat.name_search !== currentCategory);

//   const scrollContainer = (direction) => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       const scrollAmount = 200;
//       container.scrollTo({
//         left: direction === 'left' 
//           ? container.scrollLeft - scrollAmount 
//           : container.scrollLeft + scrollAmount,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const t = useTranslations("HomePage");

//   return (
//     <div className="relative">
//       <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-r rounded-t-lg">
//         <div 
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${current.img_url})` }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-800/40 to-gray-800/50 z-10 rounded-lg sm:rounded-2xl"></div>

//           <div className="relative z-10 h-full flex items-center justify-center">
//             <div className="text-center">
//               <div className="mx-auto mb-4 relative">
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm ring-4 ring-white/30 ring-offset-2 ring-offset-amber-400/50">
//                   <Image
//                     src={cloudinaryOptimizer.thumbnail(current.img_url, 112)}
//                     alt={locale === "ar" ? current.name_ar : current.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
//                     }}
//                     fill
//                     sizes="(max-width: 640px) 100vw, 192px"
//                     loading="lazy"
//                     unoptimized={false}
//                   />
//                 </div>
//               </div>

//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
//                 {locale === "ar" ? current.name_ar : current.name}
//               </h1>
              
//               <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium drop-shadow">
//                 {t("Découvreznotresélectionpremium")}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
//               <Filter className="w-5 h-5 text-amber-500 dark:text-amber-400" />
//               {t("AutresCatégories")}
//             </h2>
            
//             <div className="hidden sm:flex gap-2" dir='ltr'>
//               <button
//                 onClick={() => scrollContainer('left')}
//                 className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all shadow-sm"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => scrollContainer('right')}
//                 className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all shadow-sm"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <div className="relative">
//             <button
//               onClick={() => scrollContainer('left')}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 transition-all border border-gray-200 dark:border-gray-600 -ml-2 sm:hidden hover:bg-amber-50 dark:hover:bg-amber-900/20"
//             >
//               <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//             </button>

//             <button
//               onClick={() => scrollContainer('right')}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 transition-all border border-gray-200 dark:border-gray-600 -mr-2 sm:hidden hover:bg-amber-50 dark:hover:bg-amber-900/20"
//             >
//               <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//             </button>

//             <div
//               ref={scrollContainerRef}
//               className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 px-6 sm:px-0"
//             >
//               {otherCategories.map((category) => (
//                 <Link
//                   href={`/product_category/${category.name_search}`}
//                   key={category.name_search}
//                   className="flex-shrink-0 group cursor-pointer my-0.5"
//                 >
//                   <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-700 min-w-[100px] sm:min-w-[120px] hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10">
//                     <div className="relative">
//                       <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-300 bg-white dark:bg-gray-700 shadow-[0_0_0_2px_rgba(212,184,20,0.25)] group-hover:shadow-[0_0_0_2px_rgba(237,214,88,1)]">
//                         <Image
//                           src={cloudinaryOptimizer.thumbnail(category.img_url, 56)}
//                           alt={locale === "ar" ? category.name_ar : category.name}
//                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl"
//                           onError={(e) => {
//                             e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
//                           }}
//                           fill
//                           loading="lazy"
//                           unoptimized={false}
//                         />
//                       </div>
//                       <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-white dark:ring-gray-800 bg-amber-400" />
//                     </div>

//                     <div className="text-center">
//                       <h3 className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 leading-tight group-hover:text-amber-500 dark:group-hover:text-amber-400">
//                         {locale === "ar" ? category.name_ar : category.name}
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// const ProductCard = ({ item, index, locale, t, calculerPourcentageReduction, viewMode = "grid", toggleFavorite, favorites }) => {
//   const isFavorite = favorites.has(item._id);
//   const reduction = calculerPourcentageReduction(item.ancien_price, item.price);
//   const hasSecondImage = item.array_ProductImg[1]?.secure_url;

//   const getOptimizedImageUrl = (image, isHover = false) => {
//     if (!image?.secure_url) return "/images/gg1.webp";
    
//     const width = viewMode === "list" ? 400 : 300;
//     const quality = isHover ? "auto:low" : "auto:good";
    
//     return image.secure_url.replace(
//       '/upload/', 
//       `/upload/q_${quality},f_webp,w_${width},c_fill/`
//     );
//   };

//   return (
//     <Link
//       href={`/product_detail/${item._id}`}
//       className={`bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group ${
//         viewMode === "list" ? "flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4" : ""
//       }`}
//     >
//       <div
//         className={`relative overflow-hidden ${
//           viewMode === "list" ? "w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-full flex-shrink-0" : "pt-[100%]"
//         }`}
//       >
//         <Image
//           unoptimized={true}
//           src={getOptimizedImageUrl(item.array_ProductImg[0], false)}
//           alt={locale === "ar" ? item.title.ar : item.title.fr}
//           fill
//           sizes={
//             viewMode === "list"
//               ? "(max-width: 640px) 100vw, 192px"
//               : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//           }
//           className={`object-cover transition-all duration-500 ease-in-out ${
//             viewMode === "list" ? "rounded-lg" : ""
//           } ${hasSecondImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-105"}`}
//           loading={index < 4 ? "eager" : "lazy"}
//         />

//         {hasSecondImage && (
//           <Image
//             src={getOptimizedImageUrl(item.array_ProductImg[1], true)}
//             alt={locale === "ar" ? item.title.ar : item.title.fr}
//             fill
//             sizes={
//               viewMode === "list"
//                 ? "(max-width: 640px) 100vw, 192px"
//                 : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//             }
//             className={`object-cover transition-all duration-500 ease-in-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-105 ${
//               viewMode === "list" ? "rounded-lg" : ""
//             }`}
//             loading="lazy"
//             unoptimized={true}
//           />
//         )}

//         {reduction > 0 && (
//           <div
//             className={`absolute top-2 ${
//               locale === "ar" ? "left-2" : "right-2"
//             } bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow transition-all duration-300 group-hover:scale-110`}
//           >
//             -{reduction}%
//           </div>
//         )}

//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             toggleFavorite(item._id);
//           }}
//           className={`absolute top-2 ${
//             locale === "ar" ? "right-2" : "left-2"
//           } p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 ${
//             isFavorite
//               ? "bg-red-500 text-white shadow-md"
//               : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
//           }`}
//         >
//           <Heart
//             className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
//               isFavorite ? "fill-current" : ""
//             }`}
//           />
//         </button>
//       </div>

//       <div className={`p-2 sm:p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
//         <div className="block">
//           <h3
//             className={`font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 ${
//               viewMode === "list" ? "text-sm sm:text-base" : "text-xs sm:text-sm min-h-[3em]"
//             }`}
//           >
//             {locale === "ar" ? item.title.ar : item.title.fr}
//           </h3>

//           <div className="flex items-center gap-1 sm:gap-2 mb-2">
//             <div className="flex items-center gap-1">
//               <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#D4AF37] text-[#D4AF37] transition-transform duration-300 group-hover:scale-110" />
//               <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                 {item.rating || 4.5}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 mb-3">
//             {item.ancien_price > 0 && (
//               <span className="line-through text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
//                 {item.ancien_price.toLocaleString()} DZD
//               </span>
//             )}
//             <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#D4AF37] transition-colors duration-300">
//               {item.price.toLocaleString()} DZD
//             </span>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <Link href={`/product_detail/${item._id}`} className="flex-1">
//             <button className="flex justify-center items-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white py-1.5 sm:py-2 px-3 rounded-lg hover:from-[#C9A227] hover:to-[#E6C200] transition-all duration-300 font-medium text-xs sm:text-sm hover:shadow-md hover:shadow-yellow-500/25 transform hover:scale-[1.02] active:scale-[0.98]">
//               <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
//               {t("viewDetails")}
//             </button>
//           </Link>
//         </div>
//       </div>
//     </Link>
//   );
// };

// const PaginationComponent = ({ pagination, currentPage, onPageChange }) => {
//   if (!pagination || pagination.totalPages <= 1) return null;

//   const pages = [];
//   const maxVisiblePages = 5;
//   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//   let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

//   if (endPage - startPage + 1 < maxVisiblePages) {
//     startPage = Math.max(1, endPage - maxVisiblePages + 1);
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   return (
//     <div className="flex justify-center items-center mt-8 gap-2">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={!pagination.hasPrev}
//         className={`p-2 rounded-lg border ${
//           !pagination.hasPrev
//             ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
//             : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
//         }`}
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </button>

//       {pages.map(page => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
//             currentPage === page
//               ? 'bg-amber-500 text-white border-amber-500'
//               : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={!pagination.hasNext}
//         className={`p-2 rounded-lg border ${
//           !pagination.hasNext
//             ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
//             : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
//         }`}
//       >
//         <ChevronRight className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };


// const PCatgory = ({ products, pagination, category }) => {
//   const t = useTranslations("HomePage");
//   const locale = useLocale();
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   const [filteredData, setFilteredData] = useState(products || []);
//   const [favorites, setFavorites] = useState(new Set());
//   const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   const [filters, setFilters] = useState({
//     priceRange: [0, 100000],
//     sortBy: "name",
//   });
  
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");

//   // Fonction pour effectuer la recherche côté serveur
//   const handleSearch = useCallback(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     console.log("params before:", params.toString());

//     if (searchTerm) {
//       params.set('search', searchTerm);
//     console.log("params after modifé search:", params.toString());

//     } else {
//       params.delete('search');
//     console.log("params after modifé search:", params.toString());

//     }
//     params.set('page', '1'); // Réinitialiser à la page 1 lors de la recherche
//     router.push(`?${params.toString()}`, { scroll: false });
//   }, [searchTerm, searchParams, router]);

//   // Debounce pour la recherche automatique
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchTerm !== (searchParams.get('search') || '')) {
//         handleSearch();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, handleSearch, searchParams]);
  
//     const getMinMaxPrices = useMemo(() => {
//       if (!products || products.length === 0) return [0, 100000];
//       const prices = products.map(item => item.price);
//       return [Math.min(...prices), Math.max(...prices)];
//     }, [products]);
  
//     const calculerPourcentageReduction = useCallback((ancienPrix, prix) => {
//       if (ancienPrix <= 0 || prix <= 0 || ancienPrix <= prix) return 0;
//       return Math.round(((ancienPrix - prix) / ancienPrix) * 100);
//     }, []);

//   const applyFilters = useCallback(() => {
//     let filtered = [...products];

//     // Filtrer par prix
//     filtered = filtered.filter(item => 
//       item.price >= filters.priceRange[0] && 
//       item.price <= filters.priceRange[1]
//     );

//     // Trier
//     switch (filters.sortBy) {
//       case "price-asc":
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case "price-desc":
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case "name":
//         filtered.sort((a, b) => {
//           const nameA = locale === "ar" ? a.title.ar : a.title.fr;
//           const nameB = locale === "ar" ? b.title.ar : b.title.fr;
//           return nameA.localeCompare(nameB);
//         });
//         break;
//       default:
//         break;
//     }

//     setFilteredData(filtered);
//   }, [products, filters, locale]);


//     const handleFilterChange = (filterType, value) => {
//     setFilters(prev => ({ ...prev, [filterType]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       priceRange: getMinMaxPrices,
//       sortBy: "name",
//     });
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [applyFilters]);

//   useEffect(() => {
//     // Initialiser searchTerm depuis les params URL
//     const searchFromUrl = searchParams.get('search') || '';
//     setSearchTerm(searchFromUrl);
//   }, [searchParams]);

//     useEffect(() => {
//       if (products && products.length > 0) {
//         const [min, max] = getMinMaxPrices;
//         setFilters(prev => ({ ...prev, priceRange: [min, max] }));
//       }
//     }, [products, getMinMaxPrices]);

//     const toggleFavorite = (productId) => {
//     setFavorites(prev => {
//       const newFavorites = new Set(prev);
//       if (newFavorites.has(productId)) {
//         newFavorites.delete(productId);
//       } else {
//         newFavorites.add(productId);
//       }
//       return newFavorites;
//     });
//   };


//   //quand click sur pagination on alle a la haut de page 
//   const handlePageChange = (newPage) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set('page', newPage);
//     router.push(`?${params.toString()}`, { scroll: false });
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 950, behavior: 'smooth' });
//   };






//   return (
//     <div className="border border-gray-200 dark:border-gray-700 py-8 px-4 sm:py-12 sm:px-6 md:rounded-xl bg-white dark:bg-gray-800 shadow-sm">
//       <CategoryHeader currentCategory={category} locale={locale} />

//         <div className="flex flex-col gap-3.5 items-start justify-normal mb-8">
//             <div className="flex items-center justify-center w-full mb-4 md:mb-0">
//               <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-xs"></div>
//               <h2 className="text-xl font-semibold text-[#D4AF37] dark:text-[#FFD700] px-4 whitespace-nowrap">
//                 {t(category)}
//               </h2>
//               <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-xs"></div>
//             </div>

//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-4">
//             <div className="flex items-center gap-2 sm:gap-4">
//                 <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
//                   {filteredData.length} {filteredData.length > 1 ? t("products") : t("product")}
//                 </span>
//               </div>

//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
//               <div className="relative">
//                 <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
//                 <input
//                   type="text"
//                   placeholder={t("Rechercher")}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       handleSearch();
//                     }
//                   }}
//                   className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all w-full sm:w-48 lg:w-64 text-sm sm:text-base"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={handleSearch}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-[#D4B814] hover:bg-[#EDD658] rounded transition-colors"
//                   >
//                     <Search className="w-4 h-4 text-white" />
//                   </button>
//                 )}
//               </div>

//                 <div className="flex items-center gap-2 sm:gap-3">
//                             <button
//                               onClick={() => setShowFilters(!showFilters)}
//                               className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
//                                 showFilters 
//                                   ? "bg-[#D4AF37] text-white" 
//                                   : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//                               }`}
//                             >
//                               <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
//                               <span className="hidden sm:inline">{t("Filtres")}</span>
//                             </button>
              
//                               {/* Filtre par tri */}
//                             <div>
                            
                          
              
//                                 <select
//                               value={filters.sortBy}
//                               onChange={(e) => handleFilterChange("sortBy", e.target.value)}
//                               className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] text-xs sm:text-sm"
//                             >
//                                 <option value="name">{t("NomAZ")}</option>
//                               {/* <option value="relevance">{t("relevance")}</option> */}
//                               <option value="price-asc">{t("priceLowToHigh")}</option>
//                               <option value="price-desc">{t("priceHighToLow")}</option>
//                             </select>
              
//                             </div>
              
                              
              
//                             <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
//                               <button
//                                 onClick={() => setViewMode("grid")}
//                                 className={`p-1 sm:p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
//                               >
//                                 <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
//                               </button>
//                               <button
//                                 onClick={() => setViewMode("list")}
//                                 className={`p-1 sm:p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
//                               >
//                                 <List className="w-3 h-3 sm:w-4 sm:h-4" />
//                               </button>
//                             </div>
//                           </div>
//             </div>
//           </div>
//         </div>
//         {showFilters && (
//               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 shadow-md sm:shadow-lg">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              
      
//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
//                       {t("Prix")}
//                     </label>
//                     <div className="space-y-2">
//                       <div className="flex gap-1 sm:gap-2">
//                         <input
//                           type="number"
//                           placeholder={"min"}
//                           value={filters.priceRange[0]}
//                           onChange={(e) => handleFilterChange("priceRange", [+e.target.value, filters.priceRange[1]])}
//                           className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
//                         />
//                         <input
//                           type="number"
//                           placeholder={"max"}
//                           value={filters.priceRange[1]}
//                           onChange={(e) => handleFilterChange("priceRange", [filters.priceRange[0], +e.target.value])}
//                           className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
      
//                 <div className="flex justify-end mt-4 sm:mt-6">
//                   <button
//                     onClick={resetFilters}
//                     className="px-3 sm:px-6 py-1.5 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
//                   >
//                     {t("Réinitialiser")}
//                   </button>
//                 </div>
//               </div>
//             )}
      
//             {filteredData.length > 0 ? (
//               <>
//                 <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
//                   viewMode === "grid" 
//                     ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
//                     : "grid-cols-1"
//                 }`}>
//                   {filteredData.map((item, index) => (
//                     <ProductCard
//                       key={item._id}
//                       item={item}
//                       index={index}
//                       locale={locale}
//                       t={t}
//                       viewMode={viewMode}
//                       calculerPourcentageReduction={calculerPourcentageReduction}
//                       toggleFavorite={toggleFavorite}
//                       favorites={favorites}
//                     />
//                   ))}
//                 </div>
                
//                 <PaginationComponent
//                   pagination={pagination}
//                   currentPage={currentPage}
//                   onPageChange={handlePageChange}
//                 />
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
//                   <svg
//                     className="w-8 h-8 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="1.5"
//                       d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
//                   {t("noProductsFound")}
//                 </h3>
//                 <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
//                   {t("aucun_produit")}
//                 </p>
//                 <Link
//                   href="/"
//                   className="inline-block px-6 py-2 bg-[#D4AF37] dark:bg-[#FFD700] text-white rounded-lg hover:shadow transition-all"
//                 >
//                   {t("continueShopping")}
//                 </Link>
//               </div>
//             )}
//     </div>
//   );
// };


// export default PCatgory;




// app/(pages)/product_detail/[id]/P_catgory.jsx
"use client";
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "i18n/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { 
  Truck, CreditCard, Headphones, X, Search, SlidersHorizontal, 
  Star, Heart, ShoppingCart, Grid3X3, List, ArrowUpDown, 
  ChevronLeft, ChevronRight, Check, Filter 
} from "lucide-react";
import { category } from 'assets/les_variable';

// Utilitaires d'optimisation d'images
const cloudinaryOptimizer = {
  basic: (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/q_auto:good,f_webp,w_auto,dpr_auto/');
  },
  
  thumbnail: (url, width = 300) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/q_auto:good,f_webp,w_${width},c_fill/`);
  },
  
  detailed: (url, width = 800) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/q_auto:best,f_webp,w_${width}/`);
  }
};

const CategoryHeader = ({ 
  currentCategory, 
  locale = "fr",
  categoryList = category
}) => {
  const scrollContainerRef = useRef(null);
    
  const current = categoryList.find(cat => cat.name_search === currentCategory) || categoryList[0];
  const otherCategories = categoryList.filter(cat => cat.name_search !== currentCategory);

  const scrollContainer = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollTo({
        left: direction === 'left' 
          ? container.scrollLeft - scrollAmount 
          : container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const t = useTranslations("HomePage");

  return (
    <div className="relative">
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-r rounded-t-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${current.img_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-800/40 to-gray-800/50 z-10 rounded-lg sm:rounded-2xl"></div>

          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm ring-4 ring-white/30 ring-offset-2 ring-offset-amber-400/50">
                  <Image
                    src={cloudinaryOptimizer.thumbnail(current.img_url, 112)}
                    alt={locale === "ar" ? current.name_ar : current.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
                    }}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    loading="lazy"
                    unoptimized={false}
                  />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {locale === "ar" ? current.name_ar : current.name}
              </h1>
              
              <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium drop-shadow">
                {t("Découvreznotresélectionpremium")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Filter className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              {t("AutresCatégories")}
            </h2>
            
            <div className="hidden sm:flex gap-2" dir='ltr'>
              <button
                onClick={() => scrollContainer('left')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer('right')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollContainer('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 transition-all border border-gray-200 dark:border-gray-600 -ml-2 sm:hidden hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            <button
              onClick={() => scrollContainer('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 transition-all border border-gray-200 dark:border-gray-600 -mr-2 sm:hidden hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 px-6 sm:px-0"
            >
              {otherCategories.map((category) => (
                <Link
                  href={`/product_category/${category.name_search}`}
                  key={category.name_search}
                  className="flex-shrink-0 group cursor-pointer my-0.5"
                >
                  <div className="flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-700 min-w-[100px] sm:min-w-[120px] hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-300 bg-white dark:bg-gray-700 shadow-[0_0_0_2px_rgba(212,184,20,0.25)] group-hover:shadow-[0_0_0_2px_rgba(237,214,88,1)]">
                        <Image
                          src={cloudinaryOptimizer.thumbnail(category.img_url, 56)}
                          alt={locale === "ar" ? category.name_ar : category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
                          }}
                          fill
                          loading="lazy"
                          unoptimized={false}
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-white dark:ring-gray-800 bg-amber-400" />
                    </div>

                    <div className="text-center">
                      <h3 className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 leading-tight group-hover:text-amber-500 dark:group-hover:text-amber-400">
                        {locale === "ar" ? category.name_ar : category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
      `}</style>
    </div>
  );
};

const ProductCard = ({ item, index, locale, t, calculerPourcentageReduction, viewMode = "grid", toggleFavorite, favorites }) => {
  const isFavorite = favorites.has(item._id);
  const reduction = calculerPourcentageReduction(item.ancien_price, item.price);
  const hasSecondImage = item.array_ProductImg[1]?.secure_url;

  const getOptimizedImageUrl = (image, isHover = false) => {
    if (!image?.secure_url) return "/images/gg1.webp";
    
    const width = viewMode === "list" ? 400 : 300;
    const quality = isHover ? "auto:low" : "auto:good";
    
    return image.secure_url.replace(
      '/upload/', 
      `/upload/q_${quality},f_webp,w_${width},c_fill/`
    );
  };

  return (
    <Link
      href={`/product_detail/${item._id}`}
      className={`bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group ${
        viewMode === "list" ? "flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          viewMode === "list" ? "w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-full flex-shrink-0" : "pt-[100%]"
        }`}
      >
        <Image
          unoptimized={true}
          src={getOptimizedImageUrl(item.array_ProductImg[0], false)}
          alt={locale === "ar" ? item.title.ar : item.title.fr}
          fill
          sizes={
            viewMode === "list"
              ? "(max-width: 640px) 100vw, 192px"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          }
          className={`object-cover transition-all duration-500 ease-in-out ${
            viewMode === "list" ? "rounded-lg" : ""
          } ${hasSecondImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-105"}`}
          loading={index < 4 ? "eager" : "lazy"}
        />

        {hasSecondImage && (
          <Image
            src={getOptimizedImageUrl(item.array_ProductImg[1], true)}
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
            unoptimized={true}
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

      <div className={`p-2 sm:p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="block">
          <h3
            className={`font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 ${
              viewMode === "list" ? "text-sm sm:text-base" : "text-xs sm:text-sm min-h-[3em]"
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
          <Link href={`/product_detail/${item._id}`} className="flex-1">
            <button className="flex justify-center items-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white py-1.5 sm:py-2 px-3 rounded-lg hover:from-[#C9A227] hover:to-[#E6C200] transition-all duration-300 font-medium text-xs sm:text-sm hover:shadow-md hover:shadow-yellow-500/25 transform hover:scale-[1.02] active:scale-[0.98]">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
              {t("viewDetails")}
            </button>
          </Link>
        </div>
      </div>
    </Link>
  );
};

const PaginationComponent = ({ pagination, currentPage, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrev}
        className={`p-2 rounded-lg border ${
          !pagination.hasPrev
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
            currentPage === page
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNext}
        className={`p-2 rounded-lg border ${
          !pagination.hasNext
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};


const PCatgory = ({ products, pagination, category }) => {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filteredData, setFilteredData] = useState(products || []);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    sortBy: "name",
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Fonction pour effectuer la recherche côté serveur
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    console.log("params before:", params.toString());

    if (searchTerm) {
      params.set('search', searchTerm);
    console.log("params after modifé search:", params.toString());

    } else {
      params.delete('search');
    console.log("params after modifé search:", params.toString());

    }
    params.set('page', '1'); // Réinitialiser à la page 1 lors de la recherche
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, searchParams, router]);

  // Debounce pour la recherche automatique
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (searchTerm !== (searchParams.get('search') || '')) {
  //       handleSearch();
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [searchTerm, handleSearch, searchParams]);
  
    const getMinMaxPrices = useMemo(() => {
      if (!products || products.length === 0) return [0, 100000];
      const prices = products.map(item => item.price);
      return [Math.min(...prices), Math.max(...prices)];
    }, [products]);
  
    const calculerPourcentageReduction = useCallback((ancienPrix, prix) => {
      if (ancienPrix <= 0 || prix <= 0 || ancienPrix <= prix) return 0;
      return Math.round(((ancienPrix - prix) / ancienPrix) * 100);
    }, []);

  // const applyFilters = useCallback(() => {
  //   let filtered = [...products];

  //   // Filtrer par prix
  //   filtered = filtered.filter(item => 
  //     item.price >= filters.priceRange[0] && 
  //     item.price <= filters.priceRange[1]
  //   );

  //   // Trier
  //   switch (filters.sortBy) {
  //     case "price-asc":
  //       filtered.sort((a, b) => a.price - b.price);
  //       break;
  //     case "price-desc":
  //       filtered.sort((a, b) => b.price - a.price);
  //       break;
  //     case "name":
  //       filtered.sort((a, b) => {
  //         const nameA = locale === "ar" ? a.title.ar : a.title.fr;
  //         const nameB = locale === "ar" ? b.title.ar : b.title.fr;
  //         return nameA.localeCompare(nameB);
  //       });
  //       break;
  //     default:
  //       break;
  //   }

  //   setFilteredData(filtered);
  // }, [products, filters, locale]);


  const applyFilters = useCallback(() => {
  let filtered = [...products];

  // Filtrer par prix uniquement (le tri est géré côté serveur)
  filtered = filtered.filter(item => 
    item.price >= filters.priceRange[0] && 
    item.price <= filters.priceRange[1]
  );

  setFilteredData(filtered);
}, [products, filters.priceRange]);

// Dans P_catgory.jsx, ajoutez cet useEffect
useEffect(() => {
  const sortByFromUrl = searchParams.get('sortBy') || 'name';
  setFilters(prev => ({ ...prev, sortBy: sortByFromUrl }));
}, [searchParams]);


  //   const handleFilterChange = (filterType, value) => {
  //   setFilters(prev => ({ ...prev, [filterType]: value }));
  // };

  const handleFilterChange = (filterType, value) => {
  setFilters(prev => ({ ...prev, [filterType]: value }));
  
  // Si c'est un changement de tri, mettre à jour l'URL
  if (filterType === "sortBy") {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', value);
    params.set('page', '1'); // Réinitialiser à la page 1
    router.push(`?${params.toString()}`, { scroll: false });
  }
};

  const resetFilters = () => {
    setFilters({
      priceRange: getMinMaxPrices,
      sortBy: "name",
    });
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    // Initialiser searchTerm depuis les params URL
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);
  }, [searchParams]);

    useEffect(() => {
      if (products && products.length > 0) {
        const [min, max] = getMinMaxPrices;
        setFilters(prev => ({ ...prev, priceRange: [min, max] }));
      }
    }, [products, getMinMaxPrices]);

    const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };


  //quand click sur pagination on alle a la haut de page 
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPage(newPage);
    window.scrollTo({ top: 935, behavior: 'smooth' });
  };






  return (
    <div className="border border-gray-200 dark:border-gray-700 py-8 px-4 sm:py-12 sm:px-6 md:rounded-xl bg-white dark:bg-gray-800 shadow-sm">
      <CategoryHeader currentCategory={category} locale={locale} />

        <div className="flex flex-col gap-3.5 items-start justify-normal mb-8">
            <div className="flex items-center justify-center w-full mb-4 md:mb-0">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-xs"></div>
              <h2 className="text-xl font-semibold text-[#D4AF37] dark:text-[#FFD700] px-4 whitespace-nowrap">
                {t(category)}
              </h2>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent max-w-xs"></div>
            </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {filteredData.length} {filteredData.length > 1 ? t("products") : t("product")}
                </span>
              </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  placeholder={t("Rechercher")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all w-full sm:w-48 lg:w-64 text-sm sm:text-base"
                />
                {searchTerm && (
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-[#D4B814] hover:bg-[#EDD658] rounded transition-colors"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

                <div className="flex items-center gap-2 sm:gap-3">
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
                            
                          
              
                                <select
                              value={filters.sortBy}
                              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#D4AF37] text-xs sm:text-sm"
                            >
                                <option value="name">{t("NomAZ")}</option>
                              {/* <option value="relevance">{t("relevance")}</option> */}
                              <option value="price-asc">{t("priceLowToHigh")}</option>
                              <option value="price-desc">{t("priceHighToLow")}</option>
                            </select>
              
                            </div>
              
                              
              
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                              <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1 sm:p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
                              >
                                <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => setViewMode("list")}
                                className={`p-1 sm:p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
                              >
                                <List className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
            </div>
          </div>
        </div>
        {showFilters && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 shadow-md sm:shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              
      
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                      {t("Prix")}
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-1 sm:gap-2">
                        <input
                          type="number"
                          placeholder={"min"}
                          value={filters.priceRange[0]}
                          onChange={(e) => handleFilterChange("priceRange", [+e.target.value, filters.priceRange[1]])}
                          className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
                        />
                        <input
                          type="number"
                          placeholder={"max"}
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange("priceRange", [filters.priceRange[0], +e.target.value])}
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
      
            {filteredData.length > 0 ? (
              <>
                <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
                  {filteredData.map((item, index) => (
                    <ProductCard
                      key={item._id}
                      item={item}
                      index={index}
                      locale={locale}
                      t={t}
                      viewMode={viewMode}
                      calculerPourcentageReduction={calculerPourcentageReduction}
                      toggleFavorite={toggleFavorite}
                      favorites={favorites}
                    />
                  ))}
                </div>
                
                <PaginationComponent
                  pagination={pagination}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {t("noProductsFound")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {t("aucun_produit")}
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-2 bg-[#D4AF37] dark:bg-[#FFD700] text-white rounded-lg hover:shadow transition-all"
                >
                  {t("continueShopping")}
                </Link>
              </div>
            )}
    </div>
  );
};


export default PCatgory;
