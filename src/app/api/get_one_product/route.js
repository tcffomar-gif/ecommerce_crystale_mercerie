// import CartModal from "app/DBconfig/models/Cart";
// import ProductModal from "app/DBconfig/models/product";

// import UserModal from "app/DBconfig/models/user";
// import { connectMongoDB } from "app/DBconfig/mongodb";
// import { NextResponse } from "next/server";

// export async function GET(request) {


  

//     // 1- connect to DB
//     await connectMongoDB();

//     const id = request.nextUrl.searchParams.get("id")

//     // 2- get data 

//     const obj_data = await ProductModal.findOne({ _id: id }).populate("variant");
//     console.log("my data")
//     console.log(obj_data)


  


//       // 4- Go back to frontend
//   return NextResponse.json( obj_data );

// }



import CartModal from "app/DBconfig/models/Cart";
import ProductModal from "app/DBconfig/models/product";
import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import CaracteristiqueModal from "app/DBconfig/models/caracteristique";// Importez le modèle Caracteristique
import Caracteristique_colorModal from "app/DBconfig/models/caracteristique_color";
import CommentsModal from "app/DBconfig/models/Commente";

export async function GET(request) {
    try {
        // 1- Connect to DB
        await connectMongoDB();
        console.log("Connected to MongoDB");

        // 2- Get the product ID from the query parameters
        const id = request.nextUrl.searchParams.get("id");
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
        }

        // 3- Fetch the product data
        const product = await ProductModal.findOne({ _id: id });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

      // pour les caracteristique variante
        const characteristics = await CaracteristiqueModal.find({
            _id: { $in: product.variant } // Récupère les caractéristiques dont les IDs sont dans `product.variant`
        });

      


          // pour les caracteristique couleur
            const characteristics_color = await Caracteristique_colorModal.find({
              _id: { $in: product.variant_color } // Récupère les caractéristiques dont les IDs sont dans `product.variant`
          });

            // pour les commentaire
            const commentaire= await CommentsModal.find({
              _id: { $in: product.comments } // Récupère les caractéristiques dont les IDs sont dans `product.variant`
          });
  

          
          // 5- pour ajouté les caarcteristique et les caracteristique Couleur
        const  productData = {
              ...product.toObject(), // Convertir le document Mongoose en objet JavaScript
              variant: characteristics, // Remplacer `variant` par les données des caractéristiques
              variant_color: characteristics_color, // Remplacer `variant` par les données des caractéristiques
              comments:commentaire
            };

        console.log("Product data with characteristics:", productData);

        // 6- Return the data to the frontend
        return NextResponse.json(productData);
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}