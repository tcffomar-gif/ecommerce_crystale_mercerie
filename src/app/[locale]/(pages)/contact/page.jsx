
import React from 'react';
import { Link } from 'i18n/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Importer useTranslations et useLocale

export const metadata = {
  title: "Contact crystal",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "/img_logo/logo-crystal-annaba.webp",
  },
};

const Page = () => {
  const t = useTranslations('ContactPage'); // Utiliser useTranslations pour les traductions
  const locale = useLocale(); // Obtenir la langue active

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8">
      {/* Titre de la page */}
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
        {t('contactUs')} {/* Utiliser la traduction */}
      </h1>
  
      {/* Description */}
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
        {t('description')} {/* Utiliser la traduction */}
      </p>
  
      {/* Section Instagram */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('viaInstagram')} {/* Utiliser la traduction */}
        </h2>
        <Link
          href="https://www.instagram.com/crystal_mercerie?igsh=aWJhaWVtY3BkejF3"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[#D4B814] hover:text-[#EDD658] transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="text-xl dark:text-[#EDD658]">@crystalmercerie</span>
        </Link>
      </div>
  
      {/* Section Téléphone */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('viaPhone')} {/* Utiliser la traduction */}
        </h2>
        <Link
          href="tel:0782720266"
          className="inline-flex items-center text-[#D4B814] hover:text-[#EDD658] transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z" />
          </svg>
          <span className="text-xl dark:text-[#EDD658]">07 82 72 02 66</span>
        </Link>
      </div>
  
      {/* Message de fin */}
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mt-8">
        {t('lookingForward')} {/* Utiliser la traduction */}
      </p>
    </div>
  </div>
  );
};

export default Page;