

"use client"; // Indique que ce composant s'exécute côté client
import React, { useState } from "react";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { Link } from 'i18n/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Importer useTranslations et useLocale

const Page = () => {
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const t = useTranslations('ProfilePage'); // Utiliser useTranslations pour les traductions
  const locale = useLocale(); // Obtenir la langue active

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch')); // Utiliser la traduction
      return;
    }

    // Envoyer les données au backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        email: session.user.email
      }),
    });

    const data = await response.json();

    // Afficher le message retourné par le backend
    if (data.erreur) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] dark:bg-gray-900 px-2">
        <p className="text-[14px] md:text-[16px] text-center dark:text-white">
          {t('loginToViewContent')}{" "}
          <Link href={"/login"} className="text-red-500 dark:text-red-400 font-bold cursor-pointer">{t('login')}</Link>{" "}
        </p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-center my-[5rem]">
        <div className="flex-grow h-px bg-or_color dark:bg-or_color2"></div>
        <span className="mx-4 text-xl font-semibold text-or_color dark:text-or_color2 text-[1.3rem] px-3">
          {t('changePassword')}
        </span>
        <div className="flex-grow h-px bg-or_color2 dark:bg-or_color"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[1.5rem] items-center w-[90%] md:w-[450px] mx-auto shadow-lg rounded-lg p-6 mb-[2rem] bg-white dark:bg-gray-800"
      >
        <input
          type="password"
          placeholder={t('currentPasswordPlaceholder')}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          required
        />

        <input
          type="password"
          placeholder={t('newPasswordPlaceholder')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          required
        />

        <input
          type="password"
          placeholder={t('confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          required
        />

        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
        >
          {t('save')}
        </button>

        {message && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{message}</p>}
      </form>
    </div>
  );
};

export default Page;