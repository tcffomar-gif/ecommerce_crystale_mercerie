import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    // 1- Recevoir les données du front-end
    const { id_product, quantite } = await request.json();
    console.log("Données reçues du front-end :", { id_product, quantite });

    // 2- Se connecter à la base de données
    await connectMongoDB();

    // 3- Trouver le produit par son ID
    const product = await ProductModal.findById(id_product);
    if (!product) {
      return NextResponse.json(
        { message: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // 4- Mettre à jour le compteur d'achats
    product.purchaseCount += quantite; // Incrémenter le compteur d'achats
    await product.save(); // Sauvegarder les modifications

    // 5- Retourner une réponse au front-end
    return NextResponse.json(
      { message: "Compteur d'achats mis à jour avec succès", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compteur d'achats :", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour du compteur d'achats" },
      { status: 500 }
    );
  }
}