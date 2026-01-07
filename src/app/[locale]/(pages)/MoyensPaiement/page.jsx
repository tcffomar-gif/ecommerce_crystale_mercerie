

import React from 'react';
import { useTranslations } from 'next-intl';
// import Link from 'next/link';
import { Link } from 'i18n/navigation';


export const metadata = {
  title: "Moyens de Paiement",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "/img_logo/logo-crystal-annaba.webp",
  },
};


const Page = () => {
  const t = useTranslations('MoyensPaiement');

  return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8">
    {/* Titre de la page */}
    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
      {t('title')}
    </h1>

    {/* Section Paiement à la livraison */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t('paiementLivraison.title')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('paiementLivraison.content1')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('paiementLivraison.content2')}
      </p>
    </div>

    {/* Bouton pour contacter */}
    <div className="text-center mt-8">
      <Link
        href="/contact"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-[#D4B814] hover:bg-[#EDD658] transition-colors duration-300"
      >
        {t('contactButton')}
      </Link>
    </div>
  </div>
</div>
  );
};

export default Page;