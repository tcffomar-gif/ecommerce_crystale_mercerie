// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";

// import ScrollTop from "../scroll_top";
// import Image from "next/image";
// import { ToastContainer } from "react-toastify";

// import AuthProvider from "../../providers/AuthProvider";
// import { SidebarDemo } from "components/sidebar/sidebar";
// import Header from "components/header/header";
// import Footer from "components/footer/footer";

// //
// import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";
// import { notFound } from "next/navigation";
// import { routing } from "i18n/routing";
// import { ThemeProvider } from "components/theme-provider";
// import FacebookPixel from "components/FacebookPixel";
// import { CartProvider } from 'contexts/CartContext';
// //

// import { SpeedInsights } from "@vercel/speed-insights/next"

// export const revalidate = 3600 // revalidate at most every hour

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Crystal Mercerie",
//   description: "Achetez facilement sur notre site Web.",
//   icons: {
//     icon: "./logo-crystal-annaba.webp",
//   },
//   openGraph: {
//     images: [
//       {
//         url: "./logo-crystal-annaba.webp", // Chemin vers votre logo
//         width: 800,
//         height: 600,
//         alt: "Logo Crystal Mercerie Annaba",
//       },
//     ],
//   },
// };

// export default async function RootLayout({ children, params }) {
//   const { locale } = await params;
//   if (!routing.locales.includes(locale)) {
//     notFound();
//   }

//   // Providing all messages to the client
//   // side is the easiest way to get started
//   const messages = await getMessages();

//   return (
//     <html lang={locale} suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//               <AuthProvider>
//                 <div className="flex flex-col  min-h-screen">
//                   <ToastContainer />

//                   <ScrollTop />

//                       <NextIntlClientProvider messages={messages}>
//                           <FacebookPixel />
//                               <CartProvider>
//                                 <Header />
//                                     {children}
//                                       <SpeedInsights />
//                                 <Footer />
//                                 </CartProvider>
//                       </NextIntlClientProvider>
//                 </div>
//               </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import ScrollTop from "../scroll_top";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // N'oubliez pas d'importer les styles

import { SidebarDemo } from "components/sidebar/sidebar";
import Header from "components/header/header";
import Footer from "components/footer/footer";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "i18n/routing";
import { ThemeProvider } from "components/theme-provider";
import FacebookPixel from "components/FacebookPixel";
import { ClientProviders } from "components/providers/ClientProviders";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
export const revalidate = 3600; // revalidate at most every hour

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Crystal Mercerie",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "/logo-crystal-annaba.webp",
  },
  openGraph: {
    images: [
      {
        url: "/logo-crystal-annaba.webp",
        width: 800,
        height: 600,
        alt: "Logo Crystal Mercerie Annaba",
      },
    ],
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            <NextIntlClientProvider messages={messages}>
              <div className="flex flex-col min-h-screen">
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                  draggable
                  theme="colored"
                />

                <ScrollTop />
                <FacebookPixel />

                <Header />

                <main className="flex-grow">{children}</main>
                    <Analytics />
                    
                <Footer />

                <SpeedInsights />
              </div>
            </NextIntlClientProvider>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
