

import React from 'react';
import { useTranslations } from 'next-intl';


export const metadata = {
  title: "Politique de Confidentialité",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "/img_logo/logo-crystal-annaba.webp",
  },
};

const Page = () => {
  const t = useTranslations('PolitiqueConfidentialite');

  return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8">
    {/* Titre de la page */}
    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
      {t('title')}
    </h1>

    {/* Introduction */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t('introduction.title')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('introduction.content1')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('introduction.content2')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('introduction.content3')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('introduction.content4')}
      </p>
    </div>

    {/* Section 1 - Données que nous collectons */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t('donneesCollectees.title')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('donneesCollectees.content1')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('donneesCollectees.content2')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('donneesCollectees.content3')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('donneesCollectees.content4')}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('donneesCollectees.content5')}
      </p>
    </div>

    {/* Section 2 - Cookies */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t('cookies.title')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('cookies.content1')}
      </p>
    </div>

    {/* Section 3 - Sécurité */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t('securite.title')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('securite.content1')}
      </p>
    </div>

    {/* Section 4 - Droits du client */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t('droitsClient.title')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('droitsClient.content1')}
      </p>
    </div>
  </div>
</div>
  );
};

export default Page;