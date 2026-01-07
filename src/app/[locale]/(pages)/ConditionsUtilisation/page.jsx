
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from 'i18n/navigation';


export const metadata = {
  title: "Conditions d'Utilisation",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "/img_logo/logo-crystal-annaba.webp",
  },
};

const Page = () => {
  const t = useTranslations('ConditionsUtilisation');

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
      </div>
  
      {/* Utilisation du Site */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('utilisationDuSite.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('utilisationDuSite.content1')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('utilisationDuSite.content2')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('utilisationDuSite.content3')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('utilisationDuSite.content4')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('utilisationDuSite.content5')}
        </p>
      </div>
  
      {/* Messages des utilisateurs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('messagesDesUtilisateurs.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('messagesDesUtilisateurs.content1')}
        </p>
      </div>
  
      {/* Approbation des commandes et détails des prix */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('approbationDesCommandes.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('approbationDesCommandes.content1')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('approbationDesCommandes.content2')}
        </p>
      </div>
  
      {/* Marques et droits d'auteur */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('marquesEtDroitsDauteur.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('marquesEtDroitsDauteur.content1')}
        </p>
      </div>
  
      {/* Loi applicable et juridictions compétentes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('loiApplicable.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('loiApplicable.content1')}
        </p>
      </div>
  
      {/* Annuler le consentement */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {t('annulerConsentement.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('annulerConsentement.content1')}
        </p>
      </div>
    </div>
  </div>
  );
};

export default Page;