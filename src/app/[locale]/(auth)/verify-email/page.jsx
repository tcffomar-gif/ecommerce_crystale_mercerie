// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useTranslations, useLocale } from "next-intl"; // Importer useTranslations et useLocale

// export default function VerifyEmail() {
//   const router = useRouter();
//   const locale = useLocale(); // Obtenir la langue active

//   useEffect(() => {
//     const verifyEmail = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const token = urlParams.get("token");

//       if (!token) {
//         toast.error("Token manquant.");
//         router.push(`${locale}/register`);
//         return;
//       }

//       const response = await  fetch(`/api/verify-email?token=${token}`);
//       const data = await response.json();

//       if (response.ok) {
//         toast.success(data.message);
//         router.push(`${locale}/login`);
//       } else {
//         toast.error(data.message);
//         router.push(`${locale}/register`);
//       }
//     };

//     verifyEmail();
//   }, [router]);

//   return <p>Vérification en cours...</p>;
// }

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl"; // Importer useTranslations et useLocale

export default function VerifyEmail() {
  const router = useRouter();
  const locale = useLocale(); // Obtenir la langue active
  const t = useTranslations("VerifyEmailPage"); // Utiliser useTranslations pour les traductions

  // Vérifier que la locale est soit 'fr' soit 'ar'
  if (locale !== "fr" && locale !== "ar") {
    router.push("/fr/register"); // Rediriger vers la locale par défaut (fr)
    return null;
  }

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
          toast.error(t("missingToken")); // Utiliser la traduction
          router.push(`/${locale}/register`);
          return;
        }

        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          toast.success(data.message); // Utiliser la traduction
          router.push(`/${locale}/login`);
        } else {
          toast.error(data.message); // Utiliser la traduction
          router.push(`/${locale}/register`);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'email :", error);
        toast.error(t("verificationFailed")); // Utiliser la traduction
        router.push(`/${locale}/register`);
      }
    };

    verifyEmail();
  }, [router, locale, t]);

  return (
    <div className="flex h-screen w-screen flex-col justify-center items-center dark:bg-gray-900">
    <p className="dark:text-white">{t("verificationInProgress")}</p>
  </div>
  ); // Utiliser la traduction
}
