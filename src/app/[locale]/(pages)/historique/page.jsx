"use client";

import Hero from "components/hero_admin/hero";
import ManageSearchTwoToneIcon from "@mui/icons-material/ManageSearchTwoTone";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "app/[locale]/loading";
import { signOut, useSession } from "next-auth/react";
import { Link } from "i18n/navigation";
import { useTranslations, useLocale } from "next-intl"; // Importer useTranslations et useLocale

const Page = () => {
  const { data: session, status } = useSession();
  const [isLoading_detail, setIsLoading_detail] = useState(false);
  const [data, setData] = useState([]);
  const [Data_one_order, setData_one_order] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("historique"); // Utiliser useTranslations pour les traductions
  const locale = useLocale(); // Obtenir la langue active

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Nombre de commandes par page

  // Filtres
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch all orders for the authenticated user
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (status === "authenticated") {
      try {
        const id_user = session.user._id;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MY_URL}/api/get_historique_client`,
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
        setData(data);
      } catch (err) {
        toast.error(t("failedToFetchData")); // Utiliser la traduction
      } finally {
        setIsLoading(false);
      }
    }
  }, [status, session, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch details of a specific order
  const fetchData_get_on_historique = async (id) => {
    setIsLoading_detail(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/get_one_order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const order = await res.json();
      setData_one_order(order);
      setIsModalOpen(true); // Ouvrir le modal après avoir récupéré les données
    } catch (err) {
      toast.error(t("failedToFetchData")); // Utiliser la traduction
    } finally {
      setIsLoading_detail(false);
    }
  };

  // Mettre à jour le statut d'une commande
  const Update_status = useCallback(
    async (my_data) => {
      setIsLoading(true);
      setError(null);
      try {
        const resUpdateProduct = await fetch(
          `${process.env.NEXT_PUBLIC_MY_URL}/api/update_status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(my_data),
          }
        );
        if (!resUpdateProduct.ok) {
          throw new Error("Failed to update status");
        }
        toast.success(t("statusUpdated")); // Utiliser la traduction
        setIsModalOpen(false); // Fermer le modal après la mise à jour
        fetchData(); // Rafraîchir les données après la mise à jour
      } catch (err) {
        setError(err.message);
        toast.error(t("failedToUpdateStatus")); // Utiliser la traduction
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData, t]
  );

  // Filtrage des commandes
  const filteredOrders = data.filter((order) => {
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    const matchesDate = filterDate
      ? new Date(order.createdAt).toLocaleDateString() ===
        new Date(filterDate).toLocaleDateString()
      : true;
    return matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] dark:bg-gray-900 px-2">
        <p className="text-[14px] md:text-[16px] text-center dark:text-white">
          {t("loginToViewContent")}{" "}
          <Link
            href={"/login"}
            className="text-red-500 dark:text-red-400 font-bold cursor-pointer"
          >
            {t("login")}
          </Link>{" "}
        </p>
      </div>
    );
  }

  return (
    <div className="border py-[3rem] px-6 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-center my-8">
<div className="flex-grow h-px bg-gradient-to-r from-transparent via-or_color to-transparent max-w-xs"></div>
        <span className="mx-4 text-xl font-semibold text-or_color dark:text-or_color2 text-[1.3rem] px-3">
          {t("history")}
        </span>
    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-or_color to-transparent max-w-xs"></div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">{t("allStatuses")}</option>
          <option value="en attente">{t("pending")}</option>
          <option value="en cours de livraison">{t("inDelivery")}</option>
          <option value="refusé">{t("refused")}</option>
          <option value="recu">{t("received")}</option>
        </select>

        {/* Custom Date Picker */}
        {/* Custom Date Picker */}
        <input
          type="date"
          name=""
          id="select_date"
          className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Affichage des commandes */}
      <div className="flex flex-col">
        {data.length === 0 ? (
          <p className="text-center font-bold text-[1rem] sm:text-[1.1rem] text-gray_color dark:text-gray-300 my-[10rem]">
            {t("empty")}
          </p>
        ) : (
          <>
            {currentOrders.map((item, index) => (
              <div key={index}>
                <div className="relative w-full flex gap-[3rem] md:gap-[6rem]">
                  <div className="flex flex-col items-center">
                    <p className="text-[13px] md:text-[16px] w-fit dark:text-white">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <ManageSearchTwoToneIcon
                      className="flex-grow dark:text-white"
                      style={{ width: "60px" }}
                    />
                  </div>
                  <div className="border-b flex-grow py-[3rem] relative flex flex-col gap-2 dark:border-gray-700">
                    <p className="text-[14px] md:text-[16px] font-semibold text-or_color dark:text-or_color2">
                      #{item._id}
                    </p>
                    {item.array_product.map((product, idx) => (
                      <p
                        key={idx}
                        className="text-[14px] md:text-[16px] dark:text-white"
                      >
                        {product.id_product?.title?.[locale] ||
                          t("productNotAvailable")}
                      </p>
                    ))}

                    <label
                      title={t("viewProductDetails")}
                      htmlFor="my_modal_7"
                      onClick={() => fetchData_get_on_historique(item._id)}
                    >
                      <p className="absolute bottom-2 right-5 hover:cursor-pointer text-[#3e3e3e] font-semibold dark:text-white">
                        {t("viewDetails")}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal des détails de la commande */}
      <input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />
      <div className="modal" role="dialog">
        {isLoading_detail ? (
          <div className="fixed inset-0 flex flex-col justify-center items-center dark:bg-gray-900/80">
            <Loading />
          </div>
        ) : (
          <>
            <div className="modal-box h-fit min-h-[360px] flex flex-col gap-3 bg-white dark:bg-gray-800 overflow-y-auto relative">
              <p className="font-bold text-[#3e3e3e] absolute top-3 right-5 dark:text-white">
                {t("status")}:{" "}
                <span
                  className={`${
                    Data_one_order?.status === "refusé"
                      ? "text-red-500"
                      : "text-green-500"
                  }   font-semibold`}
                >
                  {Data_one_order?.status || "N/A"}
                </span>
              </p>
              <div className="flex flex-col gap-3 pt-[2rem]">
                <fieldset className="border rounded-lg p-4 flex flex-col gap-3 dark:border-gray-700">
                  <legend className="font-bold text-[#3e3e3e] px-2 dark:text-white">
                    {t("products")}
                  </legend>
                  {Data_one_order?.array_product.map((product, idx) => (
                    <div
                      key={idx}
                      className="text-[14px] md:text-[16px] flex gap-2 items-center justify-between dark:text-white"
                    >
                      <p>
                        <span className="font-semibold">
                          {product.quantite} *
                        </span>{" "}
                        {product.id_product?.title?.[locale] ||
                          t("productNotAvailable")}
                      </p>
                      <p className="font-semibold">
                        {product.price || "0.00"} DA
                      </p>
                    </div>
                  ))}
                </fieldset>

                <fieldset className="border rounded-lg p-4 flex flex-col gap-3 dark:border-gray-700">
                  <legend className="font-bold text-[#3e3e3e] px-2 dark:text-white">
                    {t("prices")}
                  </legend>
                  <div className="text-[14px] md:text-[16px] flex gap-2 items-center justify-between dark:text-white">
                    <p>{t("subtotal")}</p>
                    <p className="font-semibold">
                      {Data_one_order?.total - Data_one_order?.deliveryFees ||
                        "0.00"}{" "}
                      DA
                    </p>
                  </div>
                  <div className="text-[14px] md:text-[16px] flex gap-2 items-center justify-between dark:text-white">
                    <p>{t("shipping")}</p>
                    <p className="font-semibold">
                      {Data_one_order?.deliveryFees || "0.00"} DA
                    </p>
                  </div>
                  <div className="text-[14px] md:text-[16px] flex gap-2 items-center justify-between dark:text-white">
                    <p className="font-semibold">{t("total")}</p>
                    <p className="font-semibold text-red-500">
                      {Data_one_order?.total || "0.00"} DA
                    </p>
                  </div>
                </fieldset>

                {Data_one_order?.status === "en cours de livraison" && (
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform transition duration-200 hover:scale-105"
                    onClick={() =>
                      Update_status({ _id: Data_one_order._id, status: "recu" })
                    }
                  >
                    {t("markAsReceived")}
                  </button>
                )}

                <button
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transform transition duration-200 hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from(
          { length: Math.ceil(filteredOrders.length / ordersPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-or_color text-white"
                  : "bg-white dark:bg-gray-800 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Page;
