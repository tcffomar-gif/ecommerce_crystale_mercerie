


import React from 'react';
import { Link } from 'i18n/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Importer useTranslations et useLocale


export const metadata = {
  title: "Questions Fréquemment Posées",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "/img_logo/logo-crystal-annaba.webp",
  },
};

const Page = () => {
  const t = useTranslations('QuestionsPosees'); // Utiliser useTranslations pour les traductions
  const locale = useLocale(); // Obtenir la langue active

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8">
      {/* Titre de la page */}
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
        {t('title')} {/* Utiliser la traduction */}
      </h1>
  
      {/* Section Livraison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('deliveryTitle')} {/* Utiliser la traduction */}
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('deliveryText1')} {/* Utiliser la traduction */}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('deliveryText2')} {/* Utiliser la traduction */}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('deliveryText3')} {/* Utiliser la traduction */}
          </p>
        </div>
      </div>
  
      {/* Section Défaut de fabrication */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('manufacturingDefectTitle')} {/* Utiliser la traduction */}
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('manufacturingDefectText')} {/* Utiliser la traduction */}
          </p>
        </div>
      </div>
  
      {/* Section Commandes en grande quantité */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('bulkOrdersTitle')} {/* Utiliser la traduction */}
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('bulkOrdersText')}{" "} {/* Utiliser la traduction */}
            <Link href="/contact" className="text-[#D4B814] hover:text-[#EDD658] transition-colors duration-300 dark:text-[#EDD658] dark:hover:text-[#D4B814]">
              {t('contactUs')} {/* Utiliser la traduction */}
            </Link>
          </p>
        </div>
      </div>
  
      {/* Bouton pour contacter */}
      <div className="text-center mt-8">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-[#D4B814] hover:bg-[#EDD658] transition-colors duration-300 dark:bg-[#EDD658] dark:hover:bg-[#D4B814]"
        >
          {t('contactUs')} {/* Utiliser la traduction */}
        </Link>
      </div>
    </div>
  </div>
  );
};

export default Page;