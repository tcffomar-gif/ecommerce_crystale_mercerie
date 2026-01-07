"use client";
import Image from "next/image";
import { wilayasWithPrices } from "assets/array_wilaya";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateTotalPrice, calculateTotalPricev2 } from "assets/les_fontion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Send } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { useCart } from 'contexts/CartContext';


const Page = () => {
  const { data: session, status } = useSession();
  const [data_cart, setData_cart] = useState([]);
  const [isLoading_detail, setIsLoading_detail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryFees, setDeliveryFees] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const t = useTranslations("CartPage");
  const t2 = useTranslations("Header");
  const locale = useLocale();

  // Form states
  // const [formData, setFormData] = useState({
  //   fullName: "",
  //   phoneNumber: "",
  //   confirmedPhoneNumber: "",
  //   wilaya: "",
  //   deliveryType: "relayPoint",
  //   commune: "",
  //   relayPoint: "",
  //   address: "",
  // });

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

  // Get communes for selected wilaya
  const selectedWilaya = wilayasWithPrices.find(
    (w) => w.name_sans_Nm === formData.wilaya
  );
  const communes = selectedWilaya ? selectedWilaya.communes : [];

    // pour modifié le nombre d'item dans le cart qui est stocké dans locale storage
  const { cartCount, syncCartCount ,decrementCartCount } = useCart();



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

  const calculateTotal = useCallback(() => {
    // Vérification initiale plus concise
    if (!data_cart?.length) {
      return { subtotal: 0, subtotal_benefice: 0 };
    }

    // Étape 1 : Regrouper les produits et calculer les totaux
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

    // Étape 2 : Calcul des totaux
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

  // Get or create unique ID for guests
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

  // Fetch cart data
  const get_cart = useCallback(async () => {
    setIsLoading_detail(true);
    const id_user =
      status === "authenticated" ? session.user._id : getOrCreateUniqueId();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/get_cart_client`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch cart data");
      setData_cart(await res.json());
    } catch (err) {
      console.error("Failed to fetch cart data:", err);
      toast.error(t("cartFetchError"));
    } finally {
      setIsLoading_detail(false);
    }
  }, [status, session]);


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
          get_cart();
      
      } catch (err) {
        toast.error("Failed to delete productcart");
      } finally {
        setIsLoading_detail(false);
      }
    },
    [get_cart, session]
  );

  // Update delivery fees when wilaya, commune or delivery type changes
  useEffect(() => {
    if (formData.wilaya && formData.deliveryType) {
      const selectedWilaya = wilayasWithPrices.find(
        (w) => w.name_sans_Nm === formData.wilaya
      );
      if (!selectedWilaya) return;

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
      setTotal(subtotal_benefice + fees);
    }
  }, [
    formData.wilaya,
    formData.commune,
    formData.deliveryType,
    subtotal_benefice,
  ]);

  // Load cart on mount
  useEffect(() => {
    get_cart();
  }, [get_cart]);

  // Handle order submission
  const handleSendOrder = async () => {
    setIsLoading(true);

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.confirmedPhoneNumber ||
      !formData.wilaya ||
      !formData.deliveryType
    ) {
      toast.error(t("fillRequiredFields"));
      setIsLoading(false);
      return;
    }

    if (formData.phoneNumber !== formData.confirmedPhoneNumber) {
      toast.error(t("phoneNumbersDoNotMatch"));
      setIsLoading(false);
      return;
    }


    if (
      formData.deliveryType === "relayPoint" &&
      !formData.relayPoint?.center_id
    ) {
      toast.error(t("selectRelayPoint"));
      setIsLoading(false);
      return;
    }

    if (
      formData.deliveryType === "homeDelivery" &&
      (!formData.commune || !formData.address)
    ) {
      toast.error(t("fillAddressFields"));
      setIsLoading(false);
      return;
    }

    const id_user =  status === "authenticated" ? session.user._id : getOrCreateUniqueId();
      const orderData = {
        id_user,
        array_product: data_cart.map((item) => ({
          id_product: item.id_product._id,
          quantite: item.quantite,
          price: item.priceData.unitPrice,
          caracteristique: item.caracteristique,
          caracteristique_couleur: {
            type: item.caracteristique_couleur?.type || "",
            img: item.caracteristique_couleur?.img || "",
          },
        })),
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
          ...(formData.deliveryType === "relayPoint" && formData.relayPoint && {
            relayPoint: {
              center_id: formData.relayPoint.center_id,
              name: formData.relayPoint.name,
              address: formData.relayPoint.address,
              commune_id: formData.relayPoint.commune_id,
              commune_name: formData.relayPoint.commune_name,
              wilaya_id: formData.relayPoint.wilaya_id,
              wilaya_name: formData.relayPoint.wilaya_name,
            },
          }),
        },
        deliveryFees,
        total,
      };

    try {
      // Check minimum order amount
      const minPriceRes = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/get_min_price`
      );
      if (!minPriceRes.ok) throw new Error("Failed to fetch minimum price");
      const { price_min } = await minPriceRes.json();

      if (subtotal_benefice < price_min) {
        toast.error(t("minPriceError", { price: price_min }));
        return;
      }

      // Submit order
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/addOrder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );
      if (!orderRes.ok) throw new Error("Failed to create order");

      // Update product purchase counts
      await Promise.all(
        data_cart.map((item) =>
          fetch(
            `${process.env.NEXT_PUBLIC_MY_URL}/api/update_Product_PurchaseCount`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_product: item.id_product._id,
                quantite: item.quantite,
              }),
            }
          )
        )
      );

      // Clear cart
      await Promise.all(
        data_cart.map((item) =>
          fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/delete_cart_client`, {
            method: "DELETE",
            body: JSON.stringify({ id_item: item._id }),
          })
        )
      );

      toast.success(t("orderSentSuccessfully"));

      //pour modifié le nombre d'item dans le cart qui est stocké dans locale storage a 0 
      await syncCartCount(id_user);


      // Reset local state and redirect
      setData_cart([]);
      router.push("/");
    } catch (error) {
      console.error("Order error:", error);
      toast.error(t("orderError"));
    } finally {
      setIsLoading(false);
    }
  };

  //  les centres
  const [centers, setCenters] = useState([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);

  const fetchCenters = async (wilayaId) => {
    if(wilayaId == 23){
      setCenters([{
        center_id:230101,
                name: "Magasin Crystal Mercerie",
                address: "Magasin Crystal Mercerie - Rue Asla Hocine",
                commune_id: 2301,
                commune_name: "Annaba",
                wilaya_id: 23,
                wilaya_name:"Annaba" ,
      }]);
      return;
    }else{
      setIsLoadingCenters(true);           
      try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/yalidin?wilaya=${wilayaId}`
      );
      const data = await response.json();

  
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

      if (selectedWilaya && selectedWilaya.id) {
        fetchCenters(selectedWilaya.id);
      }
    }
  }, [formData.wilaya]);

    const optimizeCloudinaryUrl = (url) => {
  
    return url.replace('/upload/', '/upload/q_auto:good,f_webp/');
  };

  return (
    <div className="container mx-auto md:py-8 md:px-4 dark:bg-gray-900 dark:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Section */}
        <div className="bg-white max-md:py-8 max-md:px-4 dark:bg-gray-800 md:rounded-lg md:shadow-lg dark:shadow-gray-700 md:p-6">
          <h1 className="text-2xl text-[#3e3e3e] font-bold mb-6 underline dark:text-white">
            {t("cart")}:
          </h1>

          {data_cart.length === 0 ? (
            <p className="text-center font-bold text-gray-500 dark:text-gray-300 my-10">
              {t("emptyCart")}
            </p>
          ) : (
            <div className="space-y-4">
              {data_cart.map((item, index) => (
                <div
                  key={index}
                  className="relative flex items-center shadow rounded-lg p-4 dark:bg-gray-700 gap-4"
                >
                  <Image
                    src={optimizeCloudinaryUrl(  item.caracteristique_couleur?.img ||  item.id_product.array_ProductImg[0]?.secure_url)  }
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                    alt={item.id_product.title[locale]}
                     unoptimized={true} 
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.id_product.title[locale]}
                    </h3>
                    <div className="flex justify-between text-sm mt-1">
                      <span>
                        {t("quantity")}: {item.quantite}
                      </span>
                      <span className="font-semibold">
                        {item.priceData.unitPrice} DZD
                      </span>
                    </div>
                    {item.caracteristique &&
                      Object.entries(item.caracteristique).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-xs text-gray-500 dark:text-gray-300"
                          >
                            {key == "longeur" ||
                            key == "diametre" ||
                            key == "couleur" ? (
                              <>
                                {key == "longeur" && (
                                  <span>{t2("length")}</span>
                                )}
                                {key == "diametre" && (
                                  <span>{t2("diameter")}</span>
                                )}
                                {key == "couleur" && <span>{t2("color")}</span>}
                              </>
                            ) : (
                              <span>{key}</span>
                            )}
                            <span>{value}</span>
                          </div>
                        )
                      )}
                    {item?.caracteristique_couleur?.type !== "" &&
                      item?.caracteristique_couleur?.img !== "" && (
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300">
                          <span>{t2("color")} </span>
                          <span>{item.caracteristique_couleur.type}</span>
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
              ))}
            </div>
          )}
        </div>

        {/* Order Form Section */}
        <div className="bg-white max-md:py-8 max-md:px-4 max-md:mb-4 dark:bg-gray-800 md:rounded-lg md:shadow-lg dark:shadow-gray-700 md:p-6">
          <h1 className="text-2xl text-[#3e3e3e] font-bold mb-6 underline dark:text-white">
            {t("orderForm")}:
          </h1>

          <div className="space-y-4">
            {/* Personal Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fullName")} *
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
                  {t("phoneNumber")} *
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
                  {t("confirmPhoneNumber")} *
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

            {/* Delivery Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("wilaya")} *
              </label>
              <select
                name="wilaya"
                value={formData.wilaya}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                required
              >
                <option value="">{t("selectWilaya")}</option>
                {wilayasWithPrices.map((wilaya) => (
                  <option key={wilaya.name} value={wilaya.name_sans_Nm}>
                    {wilaya.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("deliveryType")} *
              </label>
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                required
              >
                <option value="relayPoint">{t("relayPoint")}</option>
                <option value="homeDelivery">{t("homeDelivery")}</option>
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
                      centers.map((center,index) => (
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

          {/* Order Summary */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-bold text-[#3e3e3e] mb-3 dark:text-white">
              {t("orderSummary")}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span>{subtotal_benefice} DZD</span>
              </div>
              <div className="flex justify-between">
                <span>{t("deliveryFees")}</span>
                <span className="flex items-end flex-col md:flex-row">
                  <span> {deliveryFees} DZD</span>
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
              <div className="flex justify-between font-bold text-[#3e3e3e] text-lg mt-2">
                <span className=" dark:text-white">{t("total")}</span>
                <span className="text-orange-500">{total} DZD</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSendOrder}
            disabled={isLoading || data_cart.length === 0}
            className={`mt-6 w-full py-3 rounded-md flex items-center justify-center gap-2 
              ${
                isLoading || data_cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              }`}
          >
            <Send />
            {isLoading ? t("processing") : t("placeOrder")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
