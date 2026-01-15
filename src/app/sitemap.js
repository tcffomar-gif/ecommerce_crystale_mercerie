// app/sitemap.js

import { category } from "assets/les_variable";

const BASE_URL = process.env.NEXT_PUBLIC_MY_URL;

const getAllProducts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MY_URL}/api/get_Products`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default async function sitemap() {
  // Récupération des données dynamiques
  const products = await getAllProducts(); // À implémenter
  const categories = category

  // Pages statiques
  const staticPages = [
    // Accueil
    {
      url: `${BASE_URL}/fr`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr`,
          ar: `${BASE_URL}/ar`,
        },
      },
    },
    {
      url: `${BASE_URL}/fr/contact`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/contact`,
          ar: `${BASE_URL}/ar/contact`,
        },
      },
    },

    // Pages légales
    {
      url: `${BASE_URL}/fr/ConditionsUtilisation`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/ConditionsUtilisation`,
          ar: `${BASE_URL}/ar/ConditionsUtilisation`,
        },
      },
    },
    {
      url: `${BASE_URL}/fr/FraisPortManutention`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/FraisPortManutention`,
          ar: `${BASE_URL}/ar/FraisPortManutention`,
        },
      },
    },
    {
      url: `${BASE_URL}/fr/MoyensPaiement`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/MoyensPaiement`,
          ar: `${BASE_URL}/ar/MoyensPaiement`,
        },
      },
    },
    {
      url: `${BASE_URL}/fr/PolitiqueConfidentialite`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/PolitiqueConfidentialite`,
          ar: `${BASE_URL}/ar/PolitiqueConfidentialite`,
        },
      },
    },
    {
      url: `${BASE_URL}/fr/PolitiqueEchange`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/PolitiqueEchange`,
          ar: `${BASE_URL}/ar/PolitiqueEchange`,
        },
      },
    },
    // Pages informations
    {
      url: `${BASE_URL}/fr/proposMagasin`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/proposMagasin`,
          ar: `${BASE_URL}/ar/proposMagasin`,
        },
      },
    },
    {
      url: `${BASE_URL}/fr/QuestionsPosees`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/QuestionsPosees`,
          ar: `${BASE_URL}/ar/QuestionsPosees`,
        },
      },
    },
  ];

  // Pages de catégories
  const categoryPages = categories.map((category) => ({
    url: `${BASE_URL}/fr/product_category/${category.name_search}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/product_category/${category.name_search}`,
        ar: `${BASE_URL}/ar/product_category/${category.name_search}`,
      },
    },
  }));

  // Pages produits
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/fr/product_detail/${product._id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/product_detail/${product._id}`,
        ar: `${BASE_URL}/ar/product_detail/${product._id}`,
      },
    },
  }));

  return [...staticPages , ...categoryPages, ...productPages];
}

