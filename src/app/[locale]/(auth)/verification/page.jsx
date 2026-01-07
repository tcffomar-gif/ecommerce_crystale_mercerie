"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Link } from "i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import emailjs from "@emailjs/browser";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailConfirme, setEmailConfirme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("RegisterPage");
  const t2 = useTranslations("LoginPage"); // Utiliser useTranslations pour les traductions
  const locale = useLocale();

  // Vérifier que la locale est soit 'fr' soit 'ar'
  if (locale !== "fr" && locale !== "ar") {
    router.push("/fr"); // Rediriger vers la locale par défaut (fr)
    return null;
  }

  // Fonction pour envoyer un email avec EmailJS
  // const sendEmail = (verificationLink ) => {
  //   emailjs
  //     .send(
  //       "service_0856ewj", // Remplacez par votre Service ID
  //       "template_zn0nf3j", // Remplacez par votre Template ID
  //       { verification_link: verificationLink, toemail: email , name:"admin"  }, // Envoyer uniquement le lien de vérification
  //       {
  //         publicKey: "YmaIJ8w3tPpOyF6xQ", // Remplacez par votre clé publique
  //       }
  //     )
  //     .then(
  //       () => {
  //         console.log("Email envoyé avec succès !");
  //       },
  //       (error) => {
  //         console.error("Échec de l'envoi de l'email :", error.text);
  //       }
  //     );
  // };

    const sendEmail = (verificationLink) => {
      emailjs
        .send(
          "service_0856ewj",
          "template_0ixlv0k",
          { 
            message: verificationLink,
            toemail:email,
            subject: 'verefication de votre email',
            text: 'Veuillez cliquer sur le lien suivant pour vereficier votre Email'
          },
          {
            publicKey: "YmaIJ8w3tPpOyF6xQ",
          }
        )
        .then(
          () => {
            console.log("Email envoyé avec succès !");
          },
          (error) => {
            console.error("Échec de l'envoi de l'email :", error.text);
          }
        );
    };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des champs
    if (!email || !emailConfirme) {
      toast.error(t("fillAllFields"));
      setIsLoading(false);
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (email !== emailConfirme) {
      toast.error(t("emailsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier
      // Envoyer les données au backend pour créer un compte
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/Verefication_link_email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        // Envoyer l'email de vérification si un lien est fourni
        if (data.verificationLink && data.verificationLink !== "false") {
          console.log("emaillllllllll",email)
          sendEmail(data.verificationLink );
        }

        // Rediriger vers la page de connexion avec la locale appropriée
        router.push(`/${locale}/login`);
      } else {
        toast.error(t("failedToVerifierAccount"));
      }
    } catch (error) {
      console.error("Erreur lors de Verification :", error);
      toast.error(t("failedToVerifierAccount"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-center pt-[3rem] mb-[3rem]">
        <div className="flex-grow h-px bg-or_color dark:bg-or_color2"></div>
        <Link href={"/"}>
          <Image
            className="mx-6"
            src={"/img_logo/logo-crystal-annaba-removebg-preview.webp"}
            width={150}
            height={150}
            alt={""}
             unoptimized={true} 
          />
        </Link>
        <div className="flex-grow h-px bg-or_color2 dark:bg-or_color"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[1.5rem] items-stretch w-[90%] md:w-[450px] mx-auto shadow-lg rounded-lg p-6 mb-[2rem] bg-white dark:bg-gray-800"
      >
        <p className="text-[13px] md:text-[16px] font-semibold dark:text-white">
          {t("verefier")}
        </p>
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        />

        <input
          type="email"
          placeholder={t("confirmemail")}
          onChange={(e) => setEmailConfirme(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        />
        <button
          disabled={isLoading}
          type="submit"
          className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
        >
          {isLoading ? t("loading") : t("verefieEmail")}
        </button>
        <p className="text-[14px] md:text-[16px] text-center dark:text-white">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href={`/login`}
            className="font-bold text-red-500 dark:text-red-400"
          >
            {t("login")}
          </Link>
        </p>
        <p className="text-[14px] md:text-[16px] text-center dark:text-white">
          {t2("noAccount")}{" "}
          <Link
            href={"/register"}
            className="font-bold text-red-500 dark:text-red-400"
          >
            {t2("signUp")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
