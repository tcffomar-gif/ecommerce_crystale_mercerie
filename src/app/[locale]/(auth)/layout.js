import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

//
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from 'i18n/routing';
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "components/theme-provider";
import FacebookPixel from "components/FacebookPixel";
//

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "connection Crystal",
  description: "Achetez facilement sur notre site Web.",
  icons: {
    icon: "./logo-crystal-annaba.webp",
  },
  openGraph: {
    images: [
      {
        url: "./logo-crystal-annaba.webp", // Chemin vers votre logo
        width: 800,
        height: 600,
        alt: "Logo Crystal Mercerie Annaba",
      },
    ],
  },
};




export default async function RootLayout({ children , params}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html  lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
          <NextIntlClientProvider messages={messages}>
                        <ToastContainer />
                        <FacebookPixel />
          {children}
          
        </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
