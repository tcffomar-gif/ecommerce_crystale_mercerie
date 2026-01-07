// app/api/get_related_products/route.js
import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1. Connexion à la base de données
    await connectMongoDB();
    
    // 2. Récupération des paramètres
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit")) || 8;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 3. Récupérer le produit actuel pour obtenir sa catégorie
    const currentProduct = await ProductModal.findById(productId);
    
    if (!currentProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 4. Trouver des produits similaires basés sur la catégorie
    const relatedProducts = await ProductModal.find({
      _id: { $ne: productId }, // Exclure le produit actuel
      categorie: currentProduct.categorie, // Même catégorie
      disponible: "disponible", // Seulement les produits disponibles
    })
      .sort({ purchaseCount: -1, createdAt: -1 }) // Trier par popularité puis par date
      .limit(limit)
      .select("title description price ancien_price array_ProductImg categorie purchaseCount");

    // 5. Si pas assez de produits dans la même catégorie, compléter avec d'autres produits
    if (relatedProducts.length < limit) {
      const additionalProducts = await ProductModal.find({
        _id: { 
          $ne: productId,
          $nin: relatedProducts.map(p => p._id)
        },
        disponible: "disponible",
      })
        .sort({ purchaseCount: -1, createdAt: -1 })
        .limit(limit - relatedProducts.length)
        .select("title description price ancien_price array_ProductImg categorie purchaseCount");
      
      relatedProducts.push(...additionalProducts);
    }

    // 6. Retourner les données
    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}