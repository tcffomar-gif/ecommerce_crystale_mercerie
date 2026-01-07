// // "use client"
// // import React, { useState } from "react";
// // import Image from "next/image";
// // import { useRouter } from "next/navigation";
// // import { signIn, signOut, useSession } from "next-auth/react";
// // import { toast } from 'react-toastify';
// // // import Link from "next/link";
// // import {Link} from 'i18n/navigation';

// // const Page = () => {
// //   const [email, setemail] = useState(null);
// //   const [password, setpassword] = useState(null);
// //   const [password_confirme, setpassword_confirme] = useState(null);
// //   const [error, seterror] = useState(null);
// //   const [isLoading, setisLoading] = useState(false);
// //   const router = useRouter();

// //   const handleSubmit = async (eo) => {
// //     eo.preventDefault();

// //     setisLoading(true);

// //     if (!email || !password || !password_confirme) {
// //       toast.error("All input must be filled");
// //       setisLoading(false);
// //       return;
// //     }

// //     // Vérifier si les nouveaux mots de passe correspondent
// //     if (password !== password_confirme) {
// //       toast.error("svp ecrit le meme password");
// //       return;
// //     }

// //       // verifier si email est existe ou non

// //       const result = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/userExist`, {
// //         method: "POST", // *GET, POST, PUT, DELETE, etc.

// //         headers: {
// //           "Content-Type": "application/json",
// //           // 'Content-Type': 'application/x-www-form-urlencoded',
// //         },
// //         body: JSON.stringify({ email }), // body data type must match "Content-Type" header
// //       });

// //       if (result.ok) {
// //         const isUserExist = await result.json(); // ==>  pour gagner le variable user qui j'etait envoyer dans  `  return NextResponse.json({user})  `
// //         console.log(isUserExist.user);
// //         if (isUserExist.user) {
// //           toast.error("User Already exist");
// //           setisLoading(false);
// //           return;
// //         }

// //         // send data  to mongodb
// //         const response = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/register`, {
// //           method: "POST", // *GET, POST, PUT, DELETE, etc.
// //           body: JSON.stringify({ email,password }), // body data type must match "Content-Type" header
// //         });

// //         if (response.ok) {
// //           toast.success("Your account has been created successfully");
// //           // eo.target.reset();
// //           router.push("/login");
// //         } else {
// //           toast.error("faild to create acoount, Please try again");
// //         }

// //         setisLoading(false);
// //       }

// //   };

// //   return (
// //     <div>

// //       <div className="flex items-center justify-center mt-[3rem]  mb-[3rem] ">
// //         {/* Ligne avant le texte */}
// //         <div className="flex-grow h-px bg-or_color"></div>

// //         {/* Texte centré */}

// //             <Image
// //             className="mx-6 "
// //               src={"/img_logo/logo-crystal-annaba-removebg-preview.png"}
// //               width={150}
// //               height={150}
// //               alt={""}
// //             />

// //         {/* Ligne après le texte */}
// //         <div className="flex-grow h-px bg-or_color2"></div>
// //       </div>

// //       <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5rem]  items-stretch w-[90%] md:w-[450px] mx-auto shadow-lg  rounded-lg p-6 mb-[2rem]">
// //           <p className="text-[13px] md:text-[16px] font-semibold">Se connecter</p>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           onChange={(eo) => {
// //             setemail(eo.target.value)
// //           }
// //           }
// //           className=" px-4 py-2 focus:outline-none border border-or_color2 w-[100%]  rounded-lg bg-white"
// //         />

// //         <input
// //           type="password"
// //           placeholder="Mot de passe"
// //           onChange={(eo) => {
// //             setpassword(eo.target.value)
// //           }
// //           }
// //           className=" px-4 py-2 focus:outline-none border border-or_color2 w-[100%]  rounded-lg bg-white"
// //         />
// //           <input
// //           type="password"
// //           placeholder="Confirmer Mot de passe"
// //           onChange={(eo) => {
// //             setpassword_confirme(eo.target.value)
// //           }
// //           }
// //           className=" px-4 py-2 focus:outline-none border border-or_color2 w-[100%]  rounded-lg bg-white"
// //         />

// //         <button
// //         disabled={isLoading}
// //           type="submit"
// //           className="mt-4 px-4 py-2 rounded-md  bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md "
// //         >
// //             {isLoading ? "Chargement..." : "créer"}

// //         </button>
// //         <p className="text-[14px] md:text-[16px] text-center">Vous avez déjà un compte ? <Link href={"/login"} className="font-bold text-red-500">Se connecter</Link></p>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Page;

// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { toast } from "react-toastify";
// import { Link } from "i18n/navigation";
// import { useTranslations, useLocale } from "next-intl"; // Importer useTranslations et useLocale
// import  { useRef } from 'react';
// import emailjs from '@emailjs/browser';

// const Page = () => {
//   const [email, setemail] = useState(null);
//   const [password, setpassword] = useState(null);
//   const [password_confirme, setpassword_confirme] = useState(null);
//   const [error, seterror] = useState(null);
//   const [isLoading, setisLoading] = useState(false);
//   const router = useRouter();
//   const t = useTranslations("RegisterPage"); // Utiliser useTranslations pour les traductions
//   const locale = useLocale(); // Obtenir la langue active

//   // const [message, setMessage] = useState(''); // État pour stocker le message

//   const sendEmail = (message) => {

//     // Envoyer uniquement le message
//     emailjs
//       .send(
//         'service_b8yllxd', // Remplacez par votre Service ID
//         'template_xqz6nbj', // Remplacez par votre Template ID
//         { message }, // Envoyer uniquement le message
//         {
//           publicKey: 'SxtJa7Epzc7oi8JKP', // Remplacez par votre clé publique
//         }
//       )
//       .then(
//         () => {
//           console.log('SUCCESS!');

//         },
//         (error) => {
//           console.log('FAILED...', error.text);

//         }
//       );
//   };

//   const handleSubmit = async (eo) => {
//     eo.preventDefault();

//     setisLoading(true);

//     if (!email || !password || !password_confirme) {
//       toast.error(t("fillAllFields"));
//       setisLoading(false);
//       return;
//     }

//     // Vérifier si les mots de passe correspondent
//     if (password !== password_confirme) {
//       toast.error(t("passwordsDoNotMatch"));
//       setisLoading(false);
//       return;
//     }

//     try {
//       // Vérifier si l'email existe déjà
//       const result = await fetch(
//         `${process.env.NEXT_PUBLIC_MY_URL}/api/userExist`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email }),
//         }
//       );

//       if (result.ok) {
//         const isUserExist = await result.json();
//         if (isUserExist.user) {
//           toast.error(t("userAlreadyExists"));
//           setisLoading(false);
//           return;
//         }

//         // Envoyer les données au backend pour créer un compte
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_MY_URL}/api/register`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//           }
//         );

//         if (response.ok) {
//           toast.success(t("accountCreatedSuccessfully"));
//           const link = await response.json();
//           if (link.verificationLink !="false") {
//             sendEmail(link.verificationLink)
//           }
//           console.log(link.verificationLink)
//           router.push(`${locale}/login`);
//         } else {
//           toast.error(t("failedToCreateAccount"));
//         }
//       }
//     } catch (error) {
//       console.error("Erreur lors de l'inscription :", error);
//       toast.error(t("failedToCreateAccount"));
//     } finally {
//       setisLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-center mt-[3rem] mb-[3rem]">
//         {/* Ligne avant le texte */}
//         <div className="flex-grow h-px bg-or_color"></div>

//         {/* Logo centré */}
//         <Image
//           className="mx-6"
//           src={"/img_logo/logo-crystal-annaba-removebg-preview.png"}
//           width={150}
//           height={150}
//           alt={""}
//         />

//         {/* Ligne après le texte */}
//         <div className="flex-grow h-px bg-or_color2"></div>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-[1.5rem] items-stretch w-[90%] md:w-[450px] mx-auto shadow-lg rounded-lg p-6 mb-[2rem]"
//       >
//         <p className="text-[13px] md:text-[16px] font-semibold">
//           {t("register")}
//         </p>{" "}
//         {/* Utiliser la traduction */}
//         <input
//           type="email"
//           placeholder={t("emailPlaceholder")}
//           onChange={(eo) => {
//             setemail(eo.target.value);
//           }}
//           className="px-4 py-2 focus:outline-none border border-or_color2 w-[100%] rounded-lg bg-white"
//         />
//         <input
//           type="password"
//           placeholder={t("passwordPlaceholder")}
//           onChange={(eo) => {
//             setpassword(eo.target.value);
//           }}
//           className="px-4 py-2 focus:outline-none border border-or_color2 w-[100%] rounded-lg bg-white"
//         />
//         <input
//           type="password"
//           placeholder={t("confirmPasswordPlaceholder")}
//           onChange={(eo) => {
//             setpassword_confirme(eo.target.value);
//           }}
//           className="px-4 py-2 focus:outline-none border border-or_color2 w-[100%] rounded-lg bg-white"
//         />
//         <button
//           disabled={isLoading}
//           type="submit"
//           className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
//         >
//           {isLoading ? t("loading") : t("createAccount")}{" "}
//           {/* Utiliser la traduction */}
//         </button>
//         <p className="text-[14px] md:text-[16px] text-center">
//           {t("alreadyHaveAccount")}{" "}
//           <Link href={"/login"} className="font-bold text-red-500">
//             {t("login")} {/* Utiliser la traduction */}
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Page;

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
  const [passwordConfirme, setPasswordConfirme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("RegisterPage");
  const locale = useLocale();

  // Vérifier que la locale est soit 'fr' soit 'ar'
  if (locale !== "fr" && locale !== "ar") {
    router.push("/fr"); // Rediriger vers la locale par défaut (fr)
    return null;
  }

  // Fonction pour envoyer un email avec EmailJS
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
    if (!email || !password || !passwordConfirme) {
      toast.error(t("fillAllFields"));
      setIsLoading(false);
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== passwordConfirme) {
      toast.error(t("passwordsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier si l'email existe déjà
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_MY_URL}/api/userExist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (result.ok) {
        const isUserExist = await result.json();
        if (isUserExist.user) {
          toast.error(t("userAlreadyExists"));
          setIsLoading(false);
          return;
        }
        
        const emailVerified= false
        // Envoyer les données au backend pour créer un compte
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MY_URL}/api/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password ,emailVerified }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          toast.success(t("accountCreatedSuccessfully"));

          // Envoyer l'email de vérification si un lien est fourni
          if (data.verificationLink && data.verificationLink !== "false") {
          console.log("emaillllllllll",email)

            sendEmail(data.verificationLink);
          }

          // Rediriger vers la page de connexion avec la locale appropriée
          router.push(`/${locale}/login`);
        } else {
          toast.error(t("failedToCreateAccount"));
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      toast.error(t("failedToCreateAccount"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen ">
      <div className="flex items-center justify-center  mb-[3rem]">
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
        className="flex flex-col gap-[1.5rem] items-stretch w-[90%] md:w-[450px] mx-auto shadow-lg rounded-lg p-6 mb-[2rem] bg-white dark:bg-gray-800 "
      >
        <p className="text-[13px] md:text-[16px] font-semibold dark:text-white">
          {t("register")}
        </p>
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder={t("passwordPlaceholder")}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          onChange={(e) => setPasswordConfirme(e.target.value)}
          className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        />
        <button
          disabled={isLoading}
          type="submit"
          className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
        >
          {isLoading ? t("loading") : t("createAccount")}
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
          {t("VerefierEmailLien")}{" "}
          <Link
            href={`/verification`}
            className="font-bold text-red-500 dark:text-red-400"
          >
            {t("verefier")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
