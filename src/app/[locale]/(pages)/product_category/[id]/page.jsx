// import PCatgory from "./P_catgory";

// async function getProductData(id, page = 1) {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_MY_URL}/api/get_product_by_category?id=${id}&page=${page}&limit=12`,
//       {
//         next: {
//           revalidate: 3600,
//         },
//         headers: {
//           "Content-Type": "application/json",
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

// export async function generateMetadata({ params }) {
//   const { id } = params;
//   const title = `${id.replace(/-/g, " ")} | VotreBoutique`;
//   const description = `Découvrez nos produits ${id.replace(/-/g, " ")}.`;
  
//   return {
//     title,
//     description,
//     icons: {
//       icon: "/img_logo/logo-crystal-annaba.webp",
//     },
//     openGraph: {
//       title,
//       description,
//     },
//   };
// }

// const Page = async ({ params, searchParams }) => {
//   const { id } = await params;
//   const page = parseInt(searchParams.page) || 1;
  
//   const data = await getProductData(id, page);
  
//   if (!data) {
//     return <div>Produits non trouvé</div>;
//   }

//   return <PCatgory 
//     products={data.products} 
//     pagination={data.pagination}
//     category={id} 
//   />;
// };

// export default Page;



// import PCatgory from "./P_catgory";







// async function getProductData(id, page = 1, search = "") {
//   try {
//     const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_MY_URL}/api/get_product_by_category?id=${id}&page=${page}&limit=12${searchParam}`,
//       {
//         next: {
//           revalidate: 3600,
//         },
//         headers: {
//           "Content-Type": "application/json",
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

// export async function generateMetadata({ params }) {
//   const { id } = params;
//   const title = `${id.replace(/-/g, " ")} | VotreBoutique`;
//   const description = `Découvrez nos produits ${id.replace(/-/g, " ")}.`;
  
//   return {
//     title,
//     description,
//     icons: {
//       icon: "/img_logo/logo-crystal-annaba.webp",
//     },
//     openGraph: {
//       title,
//       description,
//     },
//   };
// }


// const Page = async ({ params, searchParams }) => {
//   const { id } = await params;
//   const page = parseInt(searchParams.page) || 1;
//   const search = searchParams.search || "";
  
//   const data = await getProductData(id, page, search);
  
//   if (!data) {
//     return <div>Produits non trouvé</div>;
//   }
  
//   return <PCatgory 
//      products={data.products} 
//      pagination={data.pagination}
//      category={id} 
//    />;
// };


// export default Page;




import PCatgory from "./P_catgory";







async function getProductData(id, page = 1, search = "", sortBy = "name") {
  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const sortParam = sortBy ? `&sortBy=${sortBy}` : "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MY_URL}/api/get_product_by_category?id=${id}&page=${page}&limit=12${searchParam}${sortParam}`,
      {
        next: {
          revalidate: 3600,
        },
        headers: {
          "Content-Type": "application/json",
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

export async function generateMetadata({ params }) {
  const { id } = params;
  const title = `${id.replace(/-/g, " ")} | VotreBoutique`;
  const description = `Découvrez nos produits ${id.replace(/-/g, " ")}.`;
  
  return {
    title,
    description,
    icons: {
      icon: "/img_logo/logo-crystal-annaba.webp",
    },
    openGraph: {
      title,
      description,
    },
  };
}


const Page = async ({ params, searchParams }) => {
  const { id } = await params;
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || "";
  const sortBy = searchParams.sortBy || "name";
  
  const data = await getProductData(id, page, search, sortBy);
  
  if (!data) {
    return <div>Produits non trouvé</div>;
  }
  
  return <PCatgory 
     products={data.products} 
     pagination={data.pagination}
     category={id} 
   />;
};


export default Page;



