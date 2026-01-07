// // // app/DBconfig/api/get_product_by_category/route.js
// // import ProductModal from "app/DBconfig/models/product";
// // import { connectMongoDB } from "app/DBconfig/mongodb";
// // import { NextResponse } from "next/server";

// // export async function GET(request) {
// //   try {
// //     await connectMongoDB();

// //     const category_produit = request.nextUrl.searchParams.get("id");
// //     const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
// //     const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 12;

// //     // Calculer le skip pour la pagination
// //     const skip = (page - 1) * limit;

// //     // Récupérer les données avec pagination
// //     const products = await ProductModal.find({ 
// //       categorie: category_produit, 
// //       disponible: "disponible" 
// //     })
// //     .skip(skip)
// //     .limit(limit)
// //     .lean();

// //     // Compter le nombre total de produits pour cette catégorie
// //     const totalProducts = await ProductModal.countDocuments({ 
// //       categorie: category_produit, 
// //       disponible: "disponible" 
// //     });

// //     // Calculer le nombre total de pages
// //     const totalPages = Math.ceil(totalProducts / limit);

// //     return NextResponse.json({ 
// //       products, 
// //       pagination: {
// //         currentPage: page,
// //         totalPages,
// //         totalProducts,
// //         hasNext: page < totalPages,
// //         hasPrev: page > 1
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Error fetching products:", error);
// //     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
// //   }
// // }


// // app/DBconfig/api/get_product_by_category/route.js
// import ProductModal from "app/DBconfig/models/product";
// import { connectMongoDB } from "app/DBconfig/mongodb";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     await connectMongoDB();

//     const category_produit = request.nextUrl.searchParams.get("id");
//     const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
//     const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 12;
//     const searchTerm = request.nextUrl.searchParams.get("search") || "";

//     // Calculer le skip pour la pagination
//     const skip = (page - 1) * limit;

//     // Construire la requête de recherche
//     let query = { 
//       categorie: category_produit, 
//       disponible: "disponible" 
//     };

//     // Ajouter la recherche si un terme est fourni
//     if (searchTerm) {
//       query.$or = [
//         { "title.fr": { $regex: searchTerm, $options: "i" } },
//         { "title.ar": { $regex: searchTerm, $options: "i" } }
//       ];
//     }

//     // Récupérer les données avec pagination
//     const products = await ProductModal.find(query)
//       .sort({ "title.fr": 1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Compter le nombre total de produits pour cette catégorie
//     const totalProducts = await ProductModal.countDocuments(query);

//     // Calculer le nombre total de pages
//     const totalPages = Math.ceil(totalProducts / limit);

//     return NextResponse.json({ 
//       products, 
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalProducts,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }



// app/DBconfig/api/get_product_by_category/route.js
import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const category_produit = request.nextUrl.searchParams.get("id");
    const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 12;
    const searchTerm = request.nextUrl.searchParams.get("search") || "";
    const sortBy = request.nextUrl.searchParams.get("sortBy") || "name";
    
    // Calculer le skip pour la pagination
    const skip = (page - 1) * limit;
    
    // Construire la requête de recherche dans mon category
    let query = { 
      categorie: category_produit, 
      disponible: "disponible" 
    };

   //Construire la requête de recherche dans tout les category si  searchTerm exist 
    //   let query = { 
    //   disponible: "disponible" 
    // };

    //  if (!searchTerm && category_produit) {
    //   query.categorie = category_produit;
    // }
    
    
    // Ajouter la recherche si un terme est fourni
    if (searchTerm) {
      query.$or = [
        { "title.fr": { $regex: searchTerm, $options: "i" } },
        { "title.ar": { $regex: searchTerm, $options: "i" } }
      ];
    }
    
    // Définir l'ordre de tri
    let sortQuery = {};
    switch (sortBy) {
      case "price-asc":
        sortQuery = { price: 1 };
        break;
      case "price-desc":
        sortQuery = { price: -1 };
        break;
      case "name":
      default:
        sortQuery = { "title.fr": 1 };
        break;
    }
    
    // Récupérer les données avec pagination et tri
    const products = await ProductModal.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Compter le nombre total de produits pour cette catégorie
    const totalProducts = await ProductModal.countDocuments(query);
    
    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalProducts / limit);
    
    return NextResponse.json({ 
      products, 
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}