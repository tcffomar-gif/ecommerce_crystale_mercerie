// // app/(pages)/product_detail/[id]/page.jsx
// import ProductDetail from "./ProductDetail";

// async function getProductData(id) {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_MY_URL}/api/get_one_product?id=${id}`,
//       {
//         next: {
//           revalidate: 3600, // Revalider toutes les heures
//         },
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    

//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }

//     return await res.json();
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function get_min_price() {
//   try {

//     const res = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/get_min_price`);
//       // const { price_min } = await res.json();
    

//     if (!res.ok) {
//       throw new Error("Failed to fetch minimum price");
//     }

//     return await res.json();
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// export async function generateMetadata({ params }) {
//   const { id } = params;
//   const product = await getProductData(id);
  
//   if (!product) {
//     return {
//       title: "Produit non trouvé",
//       description: "Ce produit n'existe pas ou a été supprimé.",
//     };
//   }

//   // Titre et description dynamiques (adaptés à la langue)
//   const title = product.title?.fr || "Détails du produit";
//   const description =
//     product.description?.fr || "Découvrez ce produit en détail.";

//   return {
//     title: `${title} | VotreBoutique`,
//     description: description,
//     icons: {
//       icon: product.array_ProductImg[0]?.secure_url,
//     },
//     alternates: {
//       canonical: `${process.env.NEXT_PUBLIC_MY_URL}/fr/product_detail/${id}`, // Évite le contenu dupliqué
//     },
    
//     openGraph: {
//       title: title,
//       description: description,
//       url: `${process.env.NEXT_PUBLIC_MY_URL}/fr/product_detail/${id}`,
//       images: [
//         {
//           url: product.array_ProductImg[0]?.secure_url,
//           width: 800,
//           height: 600,
//           alt: title,
//         },
//       ],
//     },
//   };
// }

// const Page = async ({ params }) => {
//   const { id } = await params;
//   const product = await getProductData(id);
//   const {price_min} =await get_min_price();
//   console.log(price_min)

//   // console.log(product);
//   if (!product) {
//     return <div>Produit non trouvé</div>;
//   }

//   return <ProductDetail product={product} price_min={price_min}/>;
// };

// export default Page;




// app/(pages)/product_detail/[id]/page.jsx
import ProductDetail from "./ProductDetail";
import RelatedProducts from "./RelatedProducts";

async function getProductData(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MY_URL}/api/get_one_product?id=${id}`,
      {
        next: {
          revalidate: 3600, // Revalider toutes les heures
        },
        headers: {
          'Content-Type': 'application/json',
        },
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
}

async function get_min_price() {
  try {
    // ✅ Syntaxe corrigée ici
    const res = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/get_min_price`, {
      next: {
        revalidate: 3600,
      },
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch minimum price");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    return { price_min: 0 }; // Valeur par défaut en cas d'erreur
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const product = await getProductData(id);
  
  if (!product) {
    return {
      title: "Produit non trouvé",
      description: "Ce produit n'existe pas ou a été supprimé.",
    };
  }

  const title = product.title?.fr || "Détails du produit";
  const description = product.description?.fr || "Découvrez ce produit en détail.";
  
  return {
    title: `${title} | VotreBoutique`,
    description: description,
    icons: {
      icon: product.array_ProductImg[0]?.secure_url,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_MY_URL}/fr/product_detail/${id}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${process.env.NEXT_PUBLIC_MY_URL}/fr/product_detail/${id}`,
      images: [
        {
          url: product.array_ProductImg[0]?.secure_url,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
  };
}

const Page = async ({ params }) => {
  const { id } = await params;
  const product = await getProductData(id);
  const { price_min } = await get_min_price();
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Produit non trouvé
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ce produit n'existe pas ou a été supprimé.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <ProductDetail product={product} price_min={price_min} />
      <div className="container mx-auto px-4 mb-8">
        <RelatedProducts 
          productId={id} 
          currentProductCategory={product.categorie} 
        />
      </div>
    </>
  );
};

export default Page;