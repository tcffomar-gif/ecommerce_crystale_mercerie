// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { toast } from "react-toastify";
// // import Link from "next/link";
// import {Link} from 'i18n/navigation';


// const Page = () => {
//   const [email, setemail] = useState(null);
//   const [password, setpassword] = useState(null);

//   const [isLoading, setisLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (eo) => {
//     eo.preventDefault();
//     console.log("hello world")
//     setisLoading(true);

//     if (!email || !password) {
//       toast.error("All input must be filled");
//       setisLoading(false);
//       return;
//     }

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (!res.ok) {
//       toast.error("invalid email or password");
//       setisLoading(false);
//       return;
//     } else {
//       setisLoading(false);
//       router.replace("/");
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-center mt-[3rem]  mb-[3rem] ">
//         {/* Ligne avant le texte */}
//         <div className="flex-grow h-px bg-or_color"></div>

//         {/* Texte centré */}

//         <Image
//           className="mx-6 "
//           src={"/img_logo/logo-crystal-annaba-removebg-preview.png"}
//           width={150}
//           height={150}
//           alt={""}
//         />

//         {/* Ligne après le texte */}
//         <div className="flex-grow h-px bg-or_color2"></div>
//       </div>

//       <form className="flex flex-col gap-[1.5rem]  items-stretch w-[90%] md:w-[450px] mx-auto shadow-lg  rounded-lg p-6 mb-[2rem]">
//         <p className="text-[13px] md:text-[16px] font-semibold">Se connecter</p>
//         <input
//           type="email"
//           placeholder="Email"
//           onChange={(eo) => {
//             setemail(eo.target.value);
//           }}
//           className=" px-4 py-2 focus:outline-none border border-or_color2 w-[100%]  rounded-lg bg-white"
//         />

//         <input
//           type="password"
//           placeholder="Mot de passe"
//           onChange={(eo) => {
//             setpassword(eo.target.value);
//           }}
//           className=" px-4 py-2 focus:outline-none border border-or_color2 w-[100%]  rounded-lg bg-white"
//         />

//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           type="submit"
//           className="mt-4 px-4 py-2 rounded-md  bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md "
//         >
//           {isLoading ? "Chargement..." : "connecter"}
//         </button>
//         <p className="text-[14px] md:text-[16px] text-center">
//           Vous n'avez pas de compte ?{" "}
//           <Link href={"/register"} className="font-bold text-red-500">
//             Inscrivez-vous
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
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Link } from 'i18n/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Importer useTranslations et useLocale

const Page = () => {
  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('LoginPage'); // Utiliser useTranslations pour les traductions
  const t2 = useTranslations('RegisterPage'); // Utiliser useTranslations pour les traductions
  const locale = useLocale(); // Obtenir la langue active

  const handleSubmit = async (eo) => {
    eo.preventDefault();
    setisLoading(true);

    if (!email || !password) {
      toast.error(t('fillAllFields')); // Utiliser la traduction
      setisLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res.ok) {
      toast.error(t('invalidCredentials')); // Utiliser la traduction
      setisLoading(false);
      return;
    } else {
      setisLoading(false);
      router.replace("/");
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

    <form className="flex flex-col gap-[1.5rem] items-stretch w-[90%] md:w-[450px] mx-auto shadow-lg rounded-lg p-6 mb-[2rem] bg-white dark:bg-gray-800">
      <p className="text-[13px] md:text-[16px] font-semibold dark:text-white">{t('login')}</p>
      
      <input
        type="email"
        placeholder={t('emailPlaceholder')}
        onChange={(eo) => setemail(eo.target.value)}
        className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
      />

      <input
        type="password"
        placeholder={t('passwordPlaceholder')}
        onChange={(eo) => setpassword(eo.target.value)}
        className="px-4 py-2 focus:outline-none border border-or_color2 dark:border-gray-600 w-[100%] rounded-lg bg-white dark:bg-gray-700 dark:text-white"
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        type="submit"
        className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-or_color2 to-or_color text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
      >
        {isLoading ? t('loading') : t('connect')}
      </button>

      <p className="text-[14px] md:text-[16px] text-center dark:text-white">
        {t('noAccount')}{" "}
        <Link href={"/register"} className="font-bold text-red-500 dark:text-red-400">
          {t('signUp')}
        </Link>
      </p>

      <p className="text-[14px] md:text-[16px] text-center dark:text-white">
        {t2("VerefierEmailLien")}{" "}
        <Link href={`/verification`} className="font-bold text-red-500 dark:text-red-400">
          {t2("verefier")}
        </Link>
      </p>
    </form>
  </div>
  );
};

export default Page;