import React from 'react';
import { Link } from 'i18n/navigation';
import { useTranslations, useLocale } from "next-intl"; // Importer useTranslations et useLocale



const Footer = () => {
  const t = useTranslations('Footer'); // Utiliser useTranslations pour les traductions
  const locale = useLocale(); // Obtenir la langue active


  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3  gap-8">
        {/* Section Contactez-nous */}
        <div>
          <h3 className="text-[#D4B814] dark:text-[#EDD658] text-xl font-semibold mb-6">
            <Link href={'/contact'}>{t('contactUs')}</Link>
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/QuestionsPosees" className="text-gray-300 dark:text-gray-400 hover:text-[#EDD658] dark:hover:text-[#D4B814] transition-colors duration-300">
                {t('faq')}
              </Link>
            </li>
          </ul>
        </div>
  
        {/* Section Conditions générales et politiques */}
        <div>
          <h3 className="text-[#D4B814] dark:text-[#EDD658] text-xl font-semibold mb-6">
            {t('termsAndConditions')}
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/ConditionsUtilisation" className="text-gray-300 dark:text-gray-400 hover:text-[#EDD658] dark:hover:text-[#D4B814] transition-colors duration-300">
                {t('termsOfUse')}
              </Link>
            </li>
            <li>
              <Link href="/PolitiqueEchange" className="text-gray-300 dark:text-gray-400 hover:text-[#EDD658] dark:hover:text-[#D4B814] transition-colors duration-300">
                {t('returnPolicy')}
              </Link>
            </li>
            <li>
              <Link href="/PolitiqueConfidentialite" className="text-gray-300 dark:text-gray-400 hover:text-[#EDD658] dark:hover:text-[#D4B814] transition-colors duration-300">
                {t('privacyPolicy')}
              </Link>
            </li>
          </ul>
        </div>
  
        {/* Section À propos du magasin */}
        <div>
          <h3 className="text-[#D4B814] dark:text-[#EDD658] text-xl font-semibold mb-6">
            <Link href={"/proposMagasin"}>{t('aboutStore')}</Link>
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/MoyensPaiement" className="text-gray-300 dark:text-gray-400 hover:text-[#EDD658] dark:hover:text-[#D4B814] transition-colors duration-300">
                {t('paymentMethods')}
              </Link>
            </li>
            <li>
              <Link href="/FraisPortManutention" className="text-gray-300 dark:text-gray-400 hover:text-[#EDD658] dark:hover:text-[#D4B814] transition-colors duration-300">
                {t('shippingFees')}
              </Link>
            </li>
          </ul>
        </div>
  
    
      </div>
  
      {/* Section Copyright */}
      <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center">
        <p className="text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Crystal. {t('allRightsReserved')}
        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;