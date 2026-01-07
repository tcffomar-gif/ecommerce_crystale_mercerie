"use client";
import { category } from "assets/les_variable";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Loading from "app/[locale]/loading";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { calculateTotalPrice, calculateTotalPricev2 } from "assets/les_fontion";
import { Link, usePathname } from "i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Moon,
  Sun,
  ShoppingBag,
  User,
  LogOut,
  Globe,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "contexts/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isLoading_detail, setIsLoading_detail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [category_selected, setcategory_selected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [data_cart, setData_cart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();
  const { setTheme } = useTheme();

  // pour modifié le nombre d'item dans le cart qui est stocké dans locale storage
  const { cartCount, syncCartCount, decrementCartCount } = useCart();

  // Synchroniser au chargement initial
  useEffect(() => {
    const initializeCart = async () => {
      if (status === "authenticated") {
        await syncCartCount(session.user._id);
      } else {
        const uniqueId = getOrCreateUniqueId();
        await syncCartCount(uniqueId);
      }
    };

    initializeCart();
  }, [status, session, syncCartCount]);

  const optimizeCloudinaryUrl = (url) => {
    return url.replace("/upload/", "/upload/q_auto:good,f_webp/");
  };

  const calculateTotal = useCallback(() => {
    if (!data_cart?.length) {
      return { subtotal: 0, subtotal_benefice: 0 };
    }

    const groupedCart = data_cart.reduce((acc, item) => {
      const productId = item.id_product._id;
      const itemPrice = item.priceData?.unitPrice * item.quantite;

      if (!acc[productId]) {
        acc[productId] = {
          ...item,
          totale_quantite: item.quantite,
          totale_price: itemPrice,
        };
      } else {
        acc[productId].totale_quantite += item.quantite;
        acc[productId].totale_price += itemPrice;
      }
      return acc;
    }, {});

    const subtotal = Object.values(groupedCart).reduce(
      (sum, item) => sum + item.totale_price,
      0
    );

    const subtotal_benefice = Object.values(groupedCart).reduce((sum, item) => {
      return (
        sum +
        calculateTotalPricev2(
          item.id_product.reduction,
          item.totale_quantite,
          item.totale_price
        )
      );
    }, 0);

    return { subtotal, subtotal_benefice };
  }, [data_cart]);

  const { subtotal, subtotal_benefice } = useMemo(
    () => calculateTotal(),
    [calculateTotal]
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/get_Products`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setData(data);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredData([]);
      setIsSearchModalOpen(false);
      return;
    }

    let filteredProducts = data;

    if (category_selected) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categorie === category_selected
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.title.fr.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filteredProducts);
    setIsSearchModalOpen(true);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  // useEffect(() => {
  //   handleSearch();
  // }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const get_cart = useCallback(async (id_user) => {
    setIsLoading_detail(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/get_cart_client`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setData_cart(data);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading_detail(false);
    }
  }, []);

  const delete_item = useCallback(
    async (id_item) => {
      setIsLoading_detail(true);
      try {
        const resDeleteProduct = await fetch(
          `${process.env.NEXT_PUBLIC_MY_URL}/api/delete_item_cart`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_item }),
          }
        );
        if (!resDeleteProduct.ok) {
          throw new Error("Failed to delete productcart");
        }

        toast.success("product delete from cart");

        // ✅ Décrémenter le compteur
        decrementCartCount(1);

        // Recharger le panier
        if (status === "authenticated") {
          get_cart(session.user._id);
        } else {
          const uniqueId = getOrCreateUniqueId();
          get_cart(uniqueId);
        }
      } catch (err) {
        toast.error("Failed to delete productcart");
      } finally {
        setIsLoading_detail(false);
      }
    },
    [get_cart, session]
  );

  const getOrCreateUniqueId = () => {
    let uniqueId = localStorage.getItem("unique_id");
    if (!uniqueId) {
      uniqueId = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      localStorage.setItem("unique_id", uniqueId);
    }
    return uniqueId;
  };

  return (
    <div className="dark:bg-gray-900 relative">
      {/* Hero Section avec logo */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-[url(/images/sidebar_img.webp)] bg-cover bg-right bg-fixed bg-no-repeat opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="relative z-10 py-8">
          {/* Logo section */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-or_color to-transparent max-w-xs"></div>
            <Link href={"/"} className="mx-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-or_color to-or_color2 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <Image
                  className="relative transform transition-all duration-300 hover:scale-110 hover:rotate-3 drop-shadow-2xl"
                  src={"/img_logo/logo-crystal-annaba-removebg-preview.webp"}
                  width={120}
                  height={120}
                  loading="lazy"
                  alt="Crystal Annaba Logo"
                  //  unoptimized={true}
                />
              </div>
            </Link>
            <div className="flex-grow h-px bg-gradient-to-l from-transparent via-or_color2 to-transparent max-w-xs"></div>
          </div>

          {/* Search and actions section */}
          <div className="px-4 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 ">
              {/* Enhanced Search Bar */}
              <div className="w-full lg:max-w-2xl relative">
                <div
                  className={`flex items-center bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden group transition-all duration-300 hover:shadow-or_color/20 hover:shadow-lg `}
                >
                  {/* Search Icon */}
                  <div className={`p-4 `}>
                    <Search className="w-5 h-5 text-gray-400 group-hover:text-or_color transition-colors duration-200" />
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className={`flex-1 py-4 px-2 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 ${
                      locale === "ar" ? "text-right pr-4" : "text-left pl-2"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={openSearchModal}
                    // onKeyUp={handleSearch}
                    // dir={locale === "ar" ? "rtl" : "ltr"}
                  />

                  {/* Category Selector - Hidden on mobile */}
                  <div className="hidden md:flex items-center">
                    <div
                      className={`h-8  w-px bg-gray-200 dark:bg-gray-600 ${
                        locale === "ar" ? "ml-4" : "mr-4"
                      }`}
                    ></div>
                    <select
                      className={`bg-transparent dark:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none px-4 py-4 min-w-[120px] ${
                        locale === "ar" ? "text-right" : "text-left"
                      }`}
                      value={category_selected}
                      onChange={(e) => setcategory_selected(e.target.value)}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <option value="">{t("allCategories")}</option>
                      {category.map((cat, index) => (
                        <option key={index} value={cat.name_search}>
                          {locale === "ar" ? cat.name_ar : cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className={`px-6 py-4 bg-gradient-to-r from-or_color to-or_color2 text-black  hover:from-or_color2 hover:to-or_color transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hidden sm:block`}
                  >
                    <span className="hidden sm:inline">
                      {t("searchButton")}
                    </span>
                    <Search className="w-5 h-5 sm:hidden" />
                  </button>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
                    >
                      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-or_color" />
                      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-or_color2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 border-white/20 dark:border-gray-700/50"
                  >
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-blue-600"></div>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Cart Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (status === "authenticated") {
                      get_cart(session.user._id);
                    } else {
                      const uniqueId = getOrCreateUniqueId();
                      get_cart(uniqueId);
                    }
                    setIsModalOpen(true);
                  }}
                  className="relative h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center justify-center group"
                >
                  <ShoppingBag className="h-5 w-5 text-or_color group-hover:text-or_color2 transition-colors duration-200" />
                  {/* {data_cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {data_cart.length}
                    </span>
                  )} */}
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Enhanced Auth Button */}
                {status === "authenticated" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-4 py-2 h-12 rounded-xl bg-gradient-to-r from-or_color to-or_color2 text-black  hover:from-or_color2 hover:to-or_color transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("Profile")}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 border-white/20 dark:border-gray-700/50"
                    >
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={"/login"}
                    className="flex items-center gap-2 px-4 py-2 h-12 rounded-xl bg-gradient-to-r from-or_color to-or_color2 text-black  hover:from-or_color2 hover:to-or_color transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("login")}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Menu */}
      <div className="bg-gradient-to-r from-or_color to-or_color2 shadow-md dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-row justify-center items-center gap-4 md:gap-6 py-3">
            <Link
              href={"/"}
              className="text-sm text-[#3e3e3e] dark:text-white  transform hover:scale-105 transition duration-200"
            >
              {t("home")}
            </Link>
            <Link
              href={"/historique"}
              className="text-sm text-[#3e3e3e] dark:text-white  transform hover:scale-105 transition duration-200"
            >
              {t("history")}
            </Link>
            <Link
              href={"/cart"}
              className="text-sm text-[#3e3e3e] dark:text-white  transform hover:scale-105 transition duration-200"
            >
              {t("cart")}
            </Link>
            <Link
              href={"/profile"}
              className="text-sm text-[#3e3e3e] dark:text-white  transform hover:scale-105 transition duration-200"
            >
              {t("profile")}
            </Link>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-sm flex rounded-md items-center text-[#3e3e3e] dark:text-white w-full  transform hover:scale-105 transition duration-200"
                    aria-haspopup="true"
                  >
                    {t("langue")}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex flex-col p-2 items-start gap-3">
                    <Link
                      locale="fr"
                      href={pathname}
                      className="text-sm text-[#3e3e3e] dark:text-white  w-full"
                    >
                      français
                    </Link>

                    <Link
                      locale="ar"
                      href={pathname}
                      className="text-sm text-[#3e3e3e] dark:text-white  w-full"
                    >
                      العربية
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* New Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl mx-2 sm:mx-4 overflow-hidden transition-all duration-300 ease-in-out `}
          >
            {/* Search Input in Modal */}
            <div className="p-2 md:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-2 md:px-4 py-3 gap-2 md:gap-3">
                <Search className="w-5 h-5 text-gray-500 sm:block hidden" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="flex-1 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  // onKeyUp={handleSearch}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />

                <div className="flex items-center">

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredData([]);
                    setIsSearchModalOpen(false);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ClearIcon className="w-5 h-5 text-gray-500" />
                </button>

                {/* search button quand click appellé fontion search */}
                {searchQuery && (
                  <button
                    onClick={handleSearch}
                    className="p-2 bg-[#D4B814] hover:bg-[#EDD658] rounded-lg transition-colors"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </button>
                )}
                </div>
              </div>
            </div>

            {/* Search Results with Animation */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out  `}
            >
              {filteredData.length >= 0 && (
                <div
                  className={` flex flex-col divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto   ${
                    filteredData.length > 0 ? "max-h-[60vh] mb-2" : "max-h-0"
                  }`}
                >
                  {filteredData.map((product, index) => (
                    <Link
                      href={`/product_detail/${product._id}`}
                      key={index}
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchModalOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16  flex-shrink-0 h-full">
                          <Image
                            src={optimizeCloudinaryUrl(
                              product.array_ProductImg[0]?.secure_url
                            )}
                            width={64}
                            height={64}
                            alt={product.title[locale]}
                            className="rounded-lg object-cover"
                            loading="lazy"
                            unoptimized={true}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                            {product.title[locale]}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {product.reduction > 0 ? (
                              <>
                                <span className="text-or_color font-medium">
                                  {product.price} DZD
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  {product.price + product.reduction} DZD
                                </span>
                              </>
                            ) : (
                              <span className="text-or_color font-medium">
                                {product.price} DZD
                              </span>
                            )}
                          </div>
                          {product.reduction.length > 0 && (
                            <div className="mt-1">
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-200">
                                {t("PROMOTION")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Cart Modal */}
      <input
        type="checkbox"
        id="my_modal_10"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />
      <div className="modal" role="dialog">
        {isLoading_detail ? (
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm">
            <Loading />
          </div>
        ) : (
          <div className="modal-box h-fit min-h-[400px] max-h-[90vh] min-w-[70vw] max-w-[95vw] lg:max-w-[80vw] bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between  p-0  sm:p-2 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-or_color" />
                {t("cart")}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <ClearIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 p-0 sm:p-3 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Cart Summary */}
              <div className="flex-1/4">
                <div className="sticky top-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-3 border border-gray-200 dark:border-gray-600 shadow-lg">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 bg-or_color rounded-full"></span>
                    {t("prices")}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-300">
                        {t("subtotal")}
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {subtotal.toFixed(2)} DA
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-300">
                        {t("discount")}
                      </span>
                      <span className="font-semibold text-red-500">
                        {subtotal_benefice.toFixed(2)} DA
                      </span>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Link
                        className="block w-full text-center py-3 bg-gradient-to-r from-or_color to-or_color2 text-black font-medium rounded-xl hover:from-or_color2 hover:to-or_color transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        href={"/"}
                        onClick={() => setIsModalOpen(false)}
                      >
                        {t("continueShopping")}
                      </Link>

                      <Link
                        className="block w-full text-center py-3 border-2 border-or_color text-or_color hover:bg-or_color hover:text-black font-medium rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        href={"/cart"}
                        onClick={() => setIsModalOpen(false)}
                      >
                        {t("proceedToCheckout")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1/2">
                <div className="   bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-3 border border-gray-200 dark:border-gray-600 shadow-lg ">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2 ">
                    <span className="w-2 h-2 bg-or_color2 rounded-full"></span>
                    {t("cart")} ({data_cart.length})
                  </h3>

                  {data_cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        {t("emptyCart")}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500">
                        {t("Ajoutezproduits")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2  py-2 ">
                      {data_cart.map((item, index) => (
                        <div
                          key={index}
                          className="  relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-or_color/30"
                        >
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                              <Image
                                src={optimizeCloudinaryUrl(
                                  item.caracteristique_couleur?.img ||
                                    item.id_product.array_ProductImg[0]
                                      ?.secure_url
                                )}
                                width={80}
                                height={80}
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                alt={item.id_product.title[locale]}
                                loading="lazy"
                                unoptimized={true}
                              />
                              {/* Quantity Badge */}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-or_color transition-colors duration-200 truncate">
                                {item.id_product.title[locale]}
                              </h4>

                              <div className="flex items-center justify-between mt-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  <span>
                                    <span className="hidden md:inline">
                                      {t("quantity")}:
                                    </span>{" "}
                                    {item.quantite} ×{" "}
                                  </span>
                                  <span className="font-semibold text-or_color">
                                    {item.priceData?.unitPrice} DZD
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-gray-800 dark:text-gray-200 hidden sm:block">
                                  {(
                                    item.priceData?.unitPrice * item.quantite
                                  ).toFixed(2)}{" "}
                                  DZD
                                </div>
                              </div>

                              {/* Product Characteristics */}
                              {item.caracteristique && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {Object.entries(item.caracteristique).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs"
                                      >
                                        <span className="font-medium text-gray-600 dark:text-gray-400">
                                          {key === "longeur"
                                            ? t("length")
                                            : key === "diametre"
                                            ? t("diameter")
                                            : key === "couleur"
                                            ? t("color")
                                            : key}
                                          :
                                        </span>
                                        <span className="text-gray-800 dark:text-gray-200">
                                          {value}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              {/* Color Characteristic */}
                              {item?.caracteristique_couleur?.type && (
                                <div className="mt-2">
                                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">
                                      {t("color")}:
                                    </span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                      {item.caracteristique_couleur.type}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => delete_item(item._id)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg  transition-all duration-200 "
                            >
                              <ClearIcon sx={{ fontSize: "16px" }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {data_cart.length}{" "}
                  {data_cart.length === 1 ? t("article") : t("articles")}
                  {t("dansvotrepanier")}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 font-medium"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
