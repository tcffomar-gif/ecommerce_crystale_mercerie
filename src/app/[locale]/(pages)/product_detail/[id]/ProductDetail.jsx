"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { signOut, useSession } from "next-auth/react";
import { Link } from "i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { wilayasWithPrices } from "assets/array_wilaya";
import { calculateTotalPrice } from "assets/les_fontion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ShoppingCart, Comment, PostAdd, Send } from "@mui/icons-material";
import Loading from "app/[locale]/loading";
import { useGesture } from "@use-gesture/react";
import ClearIcon from "@mui/icons-material/Clear";
import { useCart } from 'contexts/CartContext';

const ProductDetail = ({ product , price_min}) => {
  const { data: session, status } = useSession();
  const t = useTranslations("ProductDetail");
  const t_order = useTranslations("CartPage");
  const locale = useLocale();

  // États pour le produit
  const [mainImage, setMainImage] = useState(
    product.array_ProductImg[0]?.secure_url || ""
  );
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedColorImage, setSelectedColorImage] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState(product?.comments || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


const [isImageLoading, setIsImageLoading] = useState(false);


  // pour modifié le nombre d'item dans le cart qui est stocké dans locale storage
  const { incrementCartCount, syncCartCount } = useCart();


  const optimizeCloudinaryUrl = (url) => {
  
    return url.replace('/upload/', '/upload/q_auto:good,f_webp/');
  };


  // États pour le formulaire de commande
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    confirmedPhoneNumber: "",
    wilaya: "",
    deliveryType: "relayPoint",
    commune: "",
    relayPoint: null, // Changé de string à object
    address: "",
  });

  // Remplacer l'état subtotal par :
  const [subtotal, setSubtotal] = useState(product.price);
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [deliveryFees, setDeliveryFees] = useState(0);
  const [total, setTotal] = useState(product.price);
  const [subtotal_benefice, setSubtotalBenefice] = useState(product.price);
  const [priceDetails, setPriceDetails] = useState({
    basePrice: product.price,
    adjustments: 0,
    discountedPrice: product.price,
    quantity: 1,
  });

  // Get communes for selected wilaya
  const selectedWilaya = wilayasWithPrices.find(
    (w) => w.name_sans_Nm === formData.wilaya
  );
  const communes = selectedWilaya ? selectedWilaya.communes : [];

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "wilaya" || name === "deliveryType"
        ? {
            commune: "",
            relayPoint: null,
          }
        : {}),
    }));
  };

  // Mise à jour des frais de livraison avec supplément de commune
  useEffect(() => {
    const calculateDeliveryFees = () => {
      if (!formData.wilaya || !formData.deliveryType) {
        setDeliveryFees(0);
        return;
      }

      const selectedWilaya = wilayasWithPrices.find(
        (w) => w.name_sans_Nm === formData.wilaya
      );
      if (!selectedWilaya) {
        setDeliveryFees(0);
        return;
      }

      // Get base delivery fee
      const baseFee =
        formData.deliveryType === "homeDelivery"
          ? selectedWilaya.homeDelivery
          : selectedWilaya.relayPoint;

      // Get commune supplement
      const selectedCommune = selectedWilaya.communes.find(
        (c) => c.name === formData.commune
      );
      const supplement = selectedCommune ? selectedCommune.supplement : 0;

      // Calculate total delivery fees
      const fees = baseFee + supplement;

      setDeliveryFees(fees);
      // Mise à jour synchrone du total
      setTotal(subtotal + fees);
    };

    calculateDeliveryFees();
  }, [formData.wilaya, formData.commune, formData.deliveryType, subtotal]);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        // 1. Calcul des ajustements de variantes
        let totalAdjustments = 0;
        Object.values(selectedVariants).forEach((variant) => {
          totalAdjustments += variant.priceAdjustment || 0;
        });

        // 2. Calcul du prix de base ajusté
        const adjustedBasePrice = product.price + totalAdjustments;

        // 3. Récupération de la quantité dans le panier
        // const id_user =
        //   status === "authenticated"
        //     ? session?.user?._id
        //     : getOrCreateUniqueId();
        // const totalQuantityInCart = await getTotalQuantityInCart(id_user);
        const totalQuantity = quantity;

        // 4. Calcul du prix avec réductions
        const discountedPrice = calculateTotalPrice(
          product.reduction,
          totalQuantity,
          adjustedBasePrice
        );

        // 5. Calcul des frais de livraison
        let fees = 0;
        if (formData.wilaya && formData.deliveryType) {
          const selectedWilaya = wilayasWithPrices.find(
            (w) => w.name_sans_Nm === formData.wilaya
          );
          if (selectedWilaya) {
            const baseFee =
              formData.deliveryType === "homeDelivery"
                ? selectedWilaya.homeDelivery
                : selectedWilaya.relayPoint;
            const supplement =
              selectedWilaya.communes.find((c) => c.name === formData.commune)
                ?.supplement || 0;
            fees = baseFee + supplement;
          }
        }

        // 6. Mise à jour des états
        setPriceDetails({
          basePrice: product.price,
          adjustments: totalAdjustments,
          discountedPrice: discountedPrice / totalQuantity, // Prix unitaire après réduction
          quantity: quantity,
        });

        setSubtotal(discountedPrice);
        setSubtotalBenefice(discountedPrice);
        setDeliveryFees(fees);
        setTotal(discountedPrice + fees);
      } catch (error) {
        console.error("Error updating prices:", error);
      }
    };

    updatePrices();
  }, [
    quantity,
    product,
    selectedVariants,
    formData.wilaya,
    formData.commune,
    formData.deliveryType,
    status,
  ]);

  const verification_price_min = (params) => {
    
  }
  
  // Gestion de la commande
  const handleSendOrder = async () => {
    setIsLoading(true);

    // Validations (inchangées)
    // if (
    //   product.variant_color?.length !== 0 &&
    //   (!selectedColorImage || !selectedColorImage.type)
    // ) {
    //   toast.error("Veuillez choisir un modèle avant de passer la commande.");
    //   setIsLoading(false);
    //   return;
    // }

    const missingVariants = product.variant
      .filter((variant) => !selectedVariants[variant.type.fr])
      .map((variant) => variant.type[locale]);

    if (missingVariants.length > 0) {
      toast.error(t("selectVariant", { variant: missingVariants.join(", ") }));
      setIsLoading(false);
      return;
    }

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.confirmedPhoneNumber ||
      !formData.wilaya ||
      !formData.deliveryType
    ) {
      toast.error(t_order("fillRequiredFields"));
      setIsLoading(false);
      return;
    }

    if (formData.phoneNumber !== formData.confirmedPhoneNumber) {
      toast.error(t_order("phoneNumbersDoNotMatch"));
      setIsLoading(false);
      return;
    }

    if (
      formData.deliveryType === "relayPoint" &&
      !formData.commune &&
      !formData.relayPoint
    ) {
      toast.error(t_order("selectRelayPoint"));
      setIsLoading(false);
      return;
    }

    if (
      formData.deliveryType === "homeDelivery" &&
      (!formData.commune || !formData.address)
    ) {
      toast.error(t_order("fillAddressFields"));
      setIsLoading(false);
      return;
    }

    try {
      // 1. Calcul des ajustements de prix
      let totalPriceAdjustment = 0;
      // const caracteristique = new Map();

      // product.variant.forEach((variant) => {
      //   const selected = selectedVariants[variant.type.fr];
      //   caracteristique.set(variant.type.fr, selected.value);
      //   totalPriceAdjustment += selected.priceAdjustment || 0;
      // });


      // ✅ NOUVEAU CODE (fonctionne)
const caracteristique = {};
product.variant.forEach((variant) => {
  const selected = selectedVariants[variant.type.fr];
  caracteristique[variant.type.fr] = selected.value;
  totalPriceAdjustment += selected.priceAdjustment || 0;
});
  
       console.log("caracteristique" , caracteristique)
      // 2. Calcul des quantités
      // const id_user =
      //   status === "authenticated" ? session.user._id : getOrCreateUniqueId();
      // const totalQuantityInCart = await getTotalQuantityInCart(id_user);
      const totalQuantity = quantity;

      // 3. Calcul des prix
      const basePrice = product.price;
      const adjustedPrice = basePrice + totalPriceAdjustment;
      const discountedPrice = calculateTotalPrice(
        product.reduction,
        totalQuantity,
        adjustedPrice
      );

      // 4. Préparation des données selon le schéma
        const id_user =  status === "authenticated" ? session.user._id : getOrCreateUniqueId();
      const orderData = {
        id_user,
        array_product: [
          {
            id_product: product._id,
            quantite: quantity,
            price: adjustedPrice, // Prix unitaire après ajustements
            caracteristique,
            caracteristique_couleur: {
              type: selectedColorImage?.type || "",
              img: selectedColorImage?.img?.secure_url || "",
            },
          },
        ],
        status: "en attente",
        createdAt: new Date(),
        customerDetails: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          wilaya: formData.wilaya,
          deliveryType: formData.deliveryType,
          commune: formData.commune,
          ...(formData.deliveryType === "homeDelivery" && {
            address: formData.address,
          }),
          ...(formData.deliveryType === "relayPoint" &&
            formData.relayPoint && {
              relayPoint: {
                center_id: Number(formData.relayPoint.center_id),
                name: formData.relayPoint.name,
                address: formData.relayPoint.address,
                commune_id: Number(formData.relayPoint.commune_id),
                commune_name: formData.relayPoint.commune_name,
                wilaya_id: Number(formData.relayPoint.wilaya_id),
                wilaya_name: formData.relayPoint.wilaya_name,
              },
            }),
        },
        deliveryFees,
        total: discountedPrice + deliveryFees,
      };
  
      console.log("orderData" , orderData)
      // 5. Vérification du prix minimum
      // const res_min_price = await fetch("/api/get_min_price");
      // if (!res_min_price.ok) throw new Error("Failed to fetch minimum price");
      // const { price_min } = await res_min_price.json();

      if (discountedPrice < price_min) {
        toast.error(t_order("minPriceError", { price: price_min }));
        setIsLoading(false);
        return;
      }

      // 6. Envoi de la commande
      const res = await fetch("/api/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to create order");

      // 7. Mise à jour des statistiques du produit
      await fetch("/api/update_Product_PurchaseCount", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_product: product._id,
          quantite: quantity,
        }),
      });

      // Succès
      toast.success(t_order("orderSentSuccessfully"));
      setIsModalOpen(false);
      setSelectedVariants({});
      setSelectedColorImage({});
      setQuantity(1);
    } catch (error) {
      console.error("Order error:", error);
      toast.error(t_order("orderError"));
    } finally {
      setIsLoading(false);
    }
  };
  // Fonction pour générer un ID unique
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

  // Calcul dynamique du prix
  useEffect(() => {
    let calculatedPrice = product.price;

    // Ajouter les ajustements de prix des variantes sélectionnées
    Object.values(selectedVariants).forEach((variant) => {
      calculatedPrice += variant.priceAdjustment || 0;
    });

    setCurrentPrice(calculatedPrice);

    // Calculer le sous-total en fonction de la quantité
    // setSubtotal(calculatedPrice * quantity);
  }, [selectedVariants, quantity, product.price]);

  // Mettre à jour l'image principale lorsque l'index change
  useEffect(() => {
    if (product.array_ProductImg[currentImageIndex]?.secure_url) {
      setMainImage(product.array_ProductImg[currentImageIndex].secure_url);
    }
  }, [currentImageIndex, product.array_ProductImg]);

  // Navigation dans le slider d'images
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.array_ProductImg.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.array_ProductImg.length - 1 : prevIndex - 1
    );
  };

  // Gestion du glissement (swipe) avec useGesture
  const bind = useGesture({
    onDrag: ({ direction: [xDir] }) => {
      if (xDir > 0) {
        handlePrevImage(); // Glisser vers la droite
      } else if (xDir < 0) {
        handleNextImage(); // Glisser vers la gauche
      }
    },
  });

  // Gestion des sélections de variantes
  const handleVariantSelection = (type, value, priceAdjustment = 0) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: { value, priceAdjustment },
    }));
  };

  // Ajoute un produit au panier

  // Soumet un avis
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name || !email || !review) {
      toast.error(t("fillAllFields"));
      return;
    }
    const newComment = {
      name,
      email,
      rating,
      avis: review,
      createdAt: new Date().toLocaleDateString(),
    };

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/add_commante`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newComment),
        }
      );

      if (!result.ok) {
        toast.error(t("failedToAddComment"));
        return;
      }

      const data_comment = await result.json();
      let my_data = {
        _id: product._id,
        id_comment: data_comment._id,
      };

      const result2 = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/add_commante_in_product`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(my_data),
        }
      );
    } catch (err) {
      toast.error(t("failedToAddComment"));
    } finally {
      setIsLoading(false);
    }

    setComments([...comments, newComment]);
    setName("");
    setEmail("");
    setReview("");
    setRating(0);
    toast.success(t("thankYouForReview"));
  };

  function calculerPourcentageReduction(ancienPrix, prix) {
    // Vérifier que les prix sont valides (nombres positifs)
    if (ancienPrix <= 0 || prix <= 0) {
      throw new Error("Les prix doivent être des nombres positifs.");
    }

    // Vérifier que l'ancien prix est supérieur au nouveau prix
    if (ancienPrix <= prix) {
      return "0%"; // Pas de réduction si l'ancien prix est inférieur ou égal au nouveau prix
    }

    // Calculer la différence entre l'ancien prix et le nouveau prix
    const difference = ancienPrix - prix;

    // Calculer le pourcentage de réduction
    const pourcentageReduction = (difference / ancienPrix) * 100;

    // Retourner le pourcentage de réduction arrondi à 2 décimales
    return `${pourcentageReduction.toFixed(0)}%`;
  }

  // Fonction pour récupérer la quantité totale dans le panier
  const getTotalQuantityInCart = async (id_user) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/get_cart_client`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch cart");

      const cartData = await res.json();
      return cartData
        .filter((item) => item.id_product._id === product._id)
        .reduce((sum, item) => sum + item.quantite, 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
      return 0;
    }
  };

  // Ajoute un produit au panier
  const handleAddToCart = useCallback(
    async (id_user) => {
      setIsLoading(true);

      // 1. Validation du modèle (couleur) si nécessaire
      // if (
      //   product.variant_color?.length > 0 &&
      //   (!selectedColorImage || !selectedColorImage.type)
      // ) {
      //   toast.error("Veuillez choisir un modèle avant d'ajouter au panier.");
      //   setIsLoading(false);
      //   return;
      // }

      // 2. Validation des variantes requises
      const missingVariants = product.variant
        .filter((variant) => !selectedVariants[variant.type.fr])
        .map((variant) => variant.type[locale]);

      if (missingVariants.length > 0) {
        toast.error(
          t("selectVariant", { variant: missingVariants.join(", ") })
        );
        setIsLoading(false);
        return;
      }

      // 3. Calcul des ajustements de prix
      let totalPriceAdjustment = 0;
      const caracteristique = product.variant.reduce((acc, variant) => {
        const selected = selectedVariants[variant.type.fr];
        acc[variant.type.fr] = selected.value;
        totalPriceAdjustment += selected.priceAdjustment || 0;
        return acc;
      }, {});

      // 4. Calcul du prix final
      const finalUnitPrice = product.price + totalPriceAdjustment;
      const totalQuantityInCart = await getTotalQuantityInCart(id_user);
      const totalQuantity = totalQuantityInCart + quantity;

      // 5. Calcul du prix avec réductions éventuelles
      const discountedPrice = calculateTotalPrice(
        product.reduction,
        totalQuantity,
        finalUnitPrice // Utiliser le prix unitaire ajusté
      );

      

      // Dans votre fonction handleAddToCart
      const cartItem = {
        id_user,
        id_product: product._id,
        quantite: quantity,
        caracteristique,
        caracteristique_couleur: {
          type: selectedColorImage?.type || "",
          img: selectedColorImage?.img?.secure_url || "",
        },
        priceData: {
          basePrice: product.price,
          priceAdjustment: totalPriceAdjustment,
          unitPrice: finalUnitPrice,
          totalPrice: finalUnitPrice * quantity,
        },
      };

      try {
        // 7. Envoi au backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MY_URL}/api/addProduct_in_cart_client`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartItem),
          }
        );

        if (!res.ok) throw new Error("Failed to add product to cart");


         // ✅ Mettre à jour le compteur dans le context
        incrementCartCount(1);

        // 8. Mise à jour de l'état local
        toast.success(t("productAddedToCart"));

        // 9. Calcul des nouveaux totaux
        const newSubtotal = discountedPrice;
        setSubtotal(newSubtotal);
        setTotal(newSubtotal + deliveryFees);

        //quand click on alle a la haut de page pour la posibilité de voir  le nombre d'item dans le cart qui est stocké dans locale storage 
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(t("failedToAddProduct"));
      } finally {
        setIsLoading(false);
      }
    },
    [
      product,
      quantity,
      selectedVariants,
      selectedColorImage,
      t,
      status,
      session?.user?._id,
      deliveryFees,
    ]
  );

  //  les centres
  const [centers, setCenters] = useState([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);

  const fetchCenters = async (wilayaId) => {
  
        // if annaba ndiro l7anot nta3ah  
    if(wilayaId == 23){


      setCenters(
        [
          {
                center_id:230101,
                name: "Magasin Crystal Mercerie",
                address: "Magasin Crystal Mercerie - Rue Asla Hocine",
                commune_id: 2301,
                commune_name: "Annaba",
                wilaya_id: 23,
                wilaya_name:"Annaba" ,
              }
        ]
      )
    }else{  // sinon ndiro les center  li kaynin ida machi annaba
  try {
      setIsLoadingCenters(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/yalidin?wilaya=${wilayaId}`
      );
      const data = await response.json();
      console.log(data)

      // console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      // console.log(data);
      setCenters(data);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast.error(t("centersFetchError"));
    } finally {
      setIsLoadingCenters(false);
    }
    }
  
  };

  useEffect(() => {
    if (formData.wilaya) {
      const selectedWilaya = wilayasWithPrices.find(
        (w) => w.name_sans_Nm === formData.wilaya
      );
      // console.log(selectedWilaya);

      if (selectedWilaya && selectedWilaya.id) {
        fetchCenters(selectedWilaya.id);
      }
    }
  }, [formData.wilaya]);


  let   missingVariants = product.variant
      .filter((variant) => !selectedVariants[variant.type.fr])
      .map((variant) => variant.type[locale]);

  return (
    <div className="md:mt-[3rem] container mx-auto md:px-4 mb-4 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 md:p-8 md:rounded-lg md:shadow-lg dark:shadow-gray-700">
        {/* Section des images */}
        <div className="space-y-4">
          {/* Image principale avec zoom et navigation */}
          <div
            dir="ltr"
            className="relative aspect-square overflow-hidden md:rounded-xl shadow-lg dark:shadow-gray-700 bg-gray-100 dark:bg-gray-800"
            {...bind()}
          >
            {mainImage ? (
              <>
                {/* Overlay de chargement */}
                {isImageLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
                    </div>
                  </div>
                )}

                {/* Image avec zoom */}
                <Zoom
                  zoomMargin={30}
                  overlayBgColorEnd="rgba(0, 0, 0, 0.95)"
                  wrapStyle={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                  zoomImg={{
                    src: optimizeCloudinaryUrl(mainImage),
                    className:
                      "object-contain max-w-[90vw] max-h-[90vh] rounded-xl",
                  }}
                >
                  <Image
                    src={optimizeCloudinaryUrl(mainImage)}
                    alt="Product Image"
                    width={800}
                    height={800}
                    quality={70}
                     unoptimized={true} 
                  
                    priority={currentImageIndex === 0}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoadingComplete={() => setIsImageLoading(false)}
                    onLoadStart={() => setIsImageLoading(true)}
                  />
                </Zoom>

                {/* Boutons de navigation */}
                <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
                  <button
                    onClick={handlePrevImage}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-300 group"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft className="text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-300 group"
                    aria-label="Next image"
                  >
                    <FaChevronRight className="text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors" />
                  </button>
                </div>

                {/* Indicateur d'image */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1}/{product.array_ProductImg.length}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          {/* Gallery d'images miniatures */}
          <div className="flex space-x-3 overflow-x-auto pb-2 px-2 md:px-0 scrollbar-hide">
            {product.array_ProductImg.map((image, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 mx-1 my-0.5 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                  currentImageIndex === index
                    ? "border-or_color2 scale-105"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setIsImageLoading(true);
                }}
              >
                <Image
                  src={optimizeCloudinaryUrl(image.secure_url)}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  loading="lazy"
                   unoptimized={true} 
                />

                {/* Overlay de sélection */}
                {currentImageIndex === index && (
                  <div className="absolute inset-0 bg-black/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informations du produit */}
        <div className="space-y-6 px-4 md:px-0">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-semibold text-[#3e3e3e] dark:text-white">
              {currentPrice} DZD
              {currentPrice !== product.price && (
                <span className="text-[16px] font-extralight text-gray-500 ml-2">
                  (Prix de base: {product.price} DZD)
                </span>
              )}
            </p>
          </div>

          {product?.ancien_price !== 0 && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <p className="text-xl line-through font-extralight text-gray-600 dark:text-gray-400">
                  {product.ancien_price} DZD
                </p>
                <p className="text-xl text-red-500 dark:text-red-400">
                  {calculerPourcentageReduction(
                    product.ancien_price,
                    product.price
                  )}
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-2xl font-bold text-[#3e3e3e] dark:text-white">
              {product.title[locale]}
            </p>
          </div>

          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {product.description[locale]}
            </p>
          </div>

          {product.reduction.length > 0 && (
            <div className="space-y-4 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("benefit")}:
              </h3>
              <ul className="list-disc pl-6 space-y-2 px-2">
                {product.reduction.map((reduction, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {t("ifYouBuy")}{" "}
                    <span className="text-red-500 dark:text-red-400 font-semibold">
                      {reduction.quantite}
                    </span>
                    , {t("youGetDiscount")}{" "}
                    <span className="text-red-500 dark:text-red-400 font-semibold">
                      {reduction.reduction} DZD
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            {product.variant_color?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-[3px] dark:text-white">
                  {t("model")} : {selectedColorImage.type}
                </h3>
                <div className="flex space-x-2 flex-wrap gap-1.5">
                  {product.variant_color.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center"
                      onClick={() => setSelectedColorImage(item)}
                    >
                          <Zoom
                  zoomMargin={30}
                  overlayBgColorEnd="rgba(0, 0, 0, 0.95)"
                  wrapStyle={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                  zoomImg={{
                    src: optimizeCloudinaryUrl(item.img.secure_url),
                    className:
                      "object-contain max-w-[90vw] max-h-[90vh] rounded-xl",
                  }}
                >
                    {/* <img
                        src={item.img.secure_url}
                        alt={`Sous-image`}
                        className={`w-25 h-20 md:w-30 md:h-25 rounded-lg border-4 ${
                          selectedColorImage.type === item.type
                            ? "border-or_color2"
                            : "border-gray-300 dark:border-gray-600 hover:border-or_color2"
                        }`}
                      /> */}

                      <Image
className={`w-25 h-20 md:w-30 md:h-25 rounded-lg border-4 ${
                          selectedColorImage.type === item.type
                            ? "border-or_color2"
                            : "border-gray-300 dark:border-gray-600 hover:border-or_color2"
                        }`}
  src={optimizeCloudinaryUrl(item.img.secure_url)}
    alt={`Sous-image`}
  loading="lazy"
  // fill
  width={70}
  height={70}
   unoptimized={true} 
  // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
/>
                </Zoom>
                    
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.variant.map((variant, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-[3px] dark:text-white">
                  {variant.type[locale]} :
                </h3>
                <div className="flex space-x-2 flex-wrap gap-1.5">
                  {variant.array_value.map((valueObj, idx) => {
                    const value =
                      typeof valueObj === "object" ? valueObj.value : valueObj;
                    const priceAdjustment =
                      typeof valueObj === "object"
                        ? valueObj.priceAdjustment
                        : 0;

                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          handleVariantSelection(
                            variant.type.fr,
                            value,
                            priceAdjustment
                          )
                        }
                        className={`px-4 py-2 border-2 rounded-lg ${
                          selectedVariants[variant.type.fr]?.value === value
                            ? "border-or_color2 bg-or_color2 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-or_color2 dark:text-white"
                        }`}
                      >
                        {value}
                        {priceAdjustment !== 0 && (
                          <span className="text-xs ml-1">
                            ({priceAdjustment > 0 ? "+" : ""}
                            {priceAdjustment} DA)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 md:gap-4">
                {/* Bouton de décrémentation */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity((prev) => Math.max(1, prev - 1));
                  }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-or_color2"
                  aria-label="Decrease quantity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                {/* Champ de quantité */}
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value || 1)))
                    }
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-center appearance-none focus:ring-2 focus:ring-or_color2 focus:border-transparent"
                    min="1"
                  />
                </div>

                {/* Bouton d'incrémentation */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity((prev) => prev + 1);
                  }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-or_color2"
                  aria-label="Increase quantity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* Bouton d'ajout au panier */}
              <button
              disabled={ missingVariants.length > 0 || (  product.variant_color?.length > 0 &&  (!selectedColorImage || !selectedColorImage.type))}
                onClick={(e) => {
                  e.preventDefault();
                  if (status === "authenticated") {
                    handleAddToCart(session.user._id);
                  } else {
                    const uniqueId = getOrCreateUniqueId();
                    handleAddToCart(uniqueId);
                  }
                }}
                // className=" flex-grow flex items-center gap-2.5 justify-center w-full bg-gradient-to-r from-or_color2 to-or_color text-white py-3 rounded-lg transition-all duration-200 hover:shadow-md"
           className="flex-grow flex items-center gap-2.5 justify-center w-full bg-gradient-to-r from-or_color2 to-or_color text-white py-3 rounded-lg transition-all duration-200 hover:shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:shadow-none"
          >
                <div className="hidden md:block">
                  <ShoppingCart />
                </div>
                <p className="text[14px] md:text-[16px] ">
                  {isLoading ? t("loading") : t("addToCart")}
                </p>
              </button>
            </div>

            <div className="flex flex-col gap-4 my-3">
              <button
               disabled={ missingVariants.length > 0 ||  isLoading || ( product.variant_color?.length > 0 &&  (!selectedColorImage || !selectedColorImage.type))}

                onClick={(eo) => {
                  setIsModalOpen(true);
                  setQuantity(1);
                }}
                className="flex items-center gap-2.5 justify-center w-full bg-gradient-to-r from-or_color2 to-or_color text-white py-3 rounded-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:shadow-none"
              >
                <Send />{" "}
                <p className="text[14px] md:text-[16px]">
                  {" "}
                  {isLoading ? t("loading") : t("achetemaintenant")}{" "}
                </p>
              </button>

              {/* <button
                onClick={() => setShowReviews(!showReviews)}
                className="flex items-center gap-2.5 justify-center text-center w-full bg-gradient-to-r from-or_color2 to-or_color text-white py-3 px-6 rounded-lg transition-all duration-200"
              >
                <Comment />{" "}
                <p className="text[14px] md:text-[16px] ">
                  {" "}
                  {showReviews ? t("hideReviews") : t("showReviews")}
                </p>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {//showReviews 
       true && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-[#3e3e3e] dark:text-white">
            {t("customerReviews")}
          </h2>

          {comments.length === 0 ? (
            <p className="text-[#3e3e3e]  dark:text-gray-300">
              {t("noReviewsYet")} "{product.title[locale]}".
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-or_color rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {comment.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-${
                            i < comment.rating ? "yellow" : "gray"
                          }-400 text-lg`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.avis}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="mt-8 space-y-6">
            <h3 className="text-xl font-bold text-[#3e3e3e] dark:text-white">
              {t("leaveReview")}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("yourRating")} *
              </label>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className={`text-${
                      i < rating ? "yellow" : "gray"
                    }-400 text-2xl hover:text-yellow-500 transition-colors duration-200`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("yourReview")} *
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-3 focus:ring-2 focus:ring-or_color focus:border-or_color transition-all duration-200"
                rows={4}
                placeholder={t("shareExperience")}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("name")} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-3 focus:ring-2 focus:ring-or_color focus:border-or_color transition-all duration-200"
                  placeholder={t("yourName")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("email")} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-3 focus:ring-2 focus:ring-or_color focus:border-or_color transition-all duration-200"
                  placeholder={t("yourEmail")}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2.5 justify-center w-full bg-gradient-to-r from-or_color2 to-or_color text-white py-3 rounded-md transition-all duration-200 focus:ring-2 focus:ring-or_color focus:ring-offset-2"
            >
              <PostAdd /> <p> {t("submitReview")}</p>
            </button>
          </form>
        </div>
      )}

      {/* Modale du formulaire de commande */}
      <input
        type="checkbox"
        id="my_modal_10"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />
      <div className="modal" role="dialog">
        <div className="modal-box h-fit min-h-[360px] max-h-[90vh] min-w-[70vw] max-w-[90vw] md:w-[50vw] flex flex-col gap-3 bg-white dark:bg-gray-800 overflow-y-auto relative">
          <div className="p-0 md:p-2 flex flex-col gap-3 w-[100%] dark:border-gray-600">
          <div className="flex items-center justify-between  border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-[#3e3e3e] px-2 dark:text-white">
              {t_order("orderForm")}
            </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <ClearIcon className="h-5 w-5 text-gray-500" />
              </button>
          </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t_order("fullName")} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t_order("phoneNumber")} *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t_order("confirmPhoneNumber")} *
                  </label>
                  <input
                    type="tel"
                    name="confirmedPhoneNumber"
                    value={formData.confirmedPhoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t_order("wilaya")} *
                </label>
                <select
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  required
                >
                  <option value="">{t_order("selectWilaya")}</option>
                  {wilayasWithPrices.map((wilaya) => (
                    <option key={wilaya.name} value={wilaya.name_sans_Nm}>
                      {wilaya.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t_order("deliveryType")} *
                </label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  required
                >
                  <option value="relayPoint">{t_order("relayPoint")}</option>
                  <option value="homeDelivery">
                    {t_order("homeDelivery")}
                  </option>
                </select>
              </div>

              {formData.deliveryType === "relayPoint" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("selectRelayPoint")} *
                  </label>
                  {/* Dans le JSX, modifiez le select des centres Yalidine : */}
                  <select
                    name="relayPoint"
                    value={formData.relayPoint?.center_id || ""}
                    onChange={(e) => {
                      const selectedCenter = centers.find(
                        (c) => c.center_id == e.target.value
                      );
                      console.log(e.target.value);

                      setFormData((prev) => ({
                        ...prev,
                        relayPoint: selectedCenter || null,
                        commune: selectedCenter?.commune_name || "",
                      }));
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                    required
                    disabled={isLoadingCenters}
                  >
                    <option value="">{t("chooseRelayPoint")}</option>
                    {isLoadingCenters ? (
                      <option value="" disabled>
                        {t("loading")}
                      </option>
                    ) : (
                      centers.map((center, index) => (
                        <option key={index} value={center.center_id}>
                          {center.center_id} - {center.address}
                        </option>
                      ))
                    )}
                  </select>

                
                </div>
              )}

              {formData.deliveryType === "homeDelivery" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("commune")} *
                    </label>
                    <select
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                      required
                      disabled={!formData.wilaya}
                    >
                      <option value="">{t("selectCommune")}</option>
                      {communes.map((commune) => (
                        <option key={commune.name} value={commune.name}>
                          {commune.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("address")} *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg text-[#3e3e3e] font-bold mb-3 dark:text-white">
                {t_order("orderSummary")}
              </h2>
              <div className="space-y-2">
                {/* Prix de base */}
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span> {t_order("Prixdebase")}:</span>
                  <span>{priceDetails.basePrice} DZD</span>
                </div>

                {/* Ajustements des variantes */}
                {priceDetails.adjustments !== 0 && (
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{t_order("Ajustements")}:</span>
                    <span>
                      {priceDetails.adjustments > 0 ? "+" : ""}
                      {priceDetails.adjustments} DZD
                    </span>
                  </div>
                )}

                {/* Prix après ajustements */}
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t_order("Prixapresajustements")}:</span>
                  <span>
                    {priceDetails.basePrice + priceDetails.adjustments} DZD
                  </span>
                </div>

                {/* Sous-total avant réduction */}
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {t_order("Soustotal")} ({quantity} ×{" "}
                    {priceDetails.basePrice + priceDetails.adjustments} DZD):
                  </span>
                  <span>
                    {(priceDetails.basePrice + priceDetails.adjustments) *
                      quantity}{" "}
                    DZD
                  </span>
                </div>

                {/* Réduction appliquée */}
                {subtotal <
                  (priceDetails.basePrice + priceDetails.adjustments) *
                    quantity && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span> {t_order("Reductionappliquee")}:</span>
                    <span>
                      -
                      {(priceDetails.basePrice + priceDetails.adjustments) *
                        quantity -
                        subtotal}{" "}
                      DZD
                    </span>
                  </div>
                )}

                {/* Sous-total après réduction */}
                <div className="flex justify-between text-[#3e3e3e] border-t pt-2">
                  <span className="font-medium  dark:text-gray-500">{t_order("subtotal")}</span>
                  <span className="font-medium  dark:text-gray-500">{subtotal} DZD</span>
                </div>

                {/* Frais de livraison */}
                <div className="flex justify-between">
                  <span>{t_order("deliveryFees")}</span>
                  <span className="flex items-end flex-col md:flex-row">
                    <span>{deliveryFees} DZD</span>
                    {formData.commune && selectedWilaya && (
                      <span className="text-xs text-gray-500 ml-1">
                        (Base:{" "}
                        {formData.deliveryType === "homeDelivery"
                          ? selectedWilaya.homeDelivery
                          : selectedWilaya.relayPoint}{" "}
                        DZD + Supplement:{" "}
                        {selectedWilaya.communes.find(
                          (c) => c.name === formData.commune
                        )?.supplement || 0}{" "}
                        DZD)
                      </span>
                    )}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between font-bold text-[#3e3e3e] text-lg mt-2 border-t pt-2">
                  <span className=" dark:text-gray-500">{t_order("total")}</span>
                  <span className="text-orange-500">{total} DZD</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-6 md:gap-2 md:mt-1">
                {/* Bouton de décrémentation */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity((prev) => Math.max(1, prev - 1));
                  }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-or_color2"
                  aria-label="Decrease quantity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                {/* Champ de quantité */}
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value || 1)))
                    }
                    className="w-14 md:w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-center appearance-none focus:ring-2 focus:ring-or_color2 focus:border-transparent"
                    min="1"
                  />
                </div>

                {/* Bouton d'incrémentation */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity((prev) => prev + 1);
                  }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-or_color2"
                  aria-label="Increase quantity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleSendOrder}
                disabled={isLoading}
                className={`text-[14px] md:text-[16px] w-full py-3 rounded-md flex items-center justify-center gap-2 
                ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                }`}
              >
                <Send />
                <p>
                  {" "}
                  {isLoading ? t_order("processing") : t_order("placeOrder")}
                </p>
              </button>
            </div>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transform transition duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
            onClick={() => setIsModalOpen(false)}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
