import { connectMongoDB } from "app/DBconfig/mongodb";
import ProductModal from "app/DBconfig/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const objFromFrontEnd = await request.json();
    await connectMongoDB();

    const my_array_img = objFromFrontEnd.array_machinImg.map((item) => ({
      secure_url: item.img_url.secure_url,
      public_id_url: item.img_url.public_id,
    }));

    const my_array_id_Caracteristique = objFromFrontEnd.array_variant.map((item) => (item._id));
    console.log(my_array_id_Caracteristique)


    const title = {
      fr: objFromFrontEnd.title,
      ar: objFromFrontEnd.title_en_arabe,
    };

    const description = {
      fr: objFromFrontEnd.description,
      ar: objFromFrontEnd.description_en_arabe,
    };


    await ProductModal.create({
      categorie: objFromFrontEnd.Categorie,
      title,
      price: objFromFrontEnd.Price,
      ancien_price: objFromFrontEnd?.Ancien_price || 0,
      array_ProductImg: my_array_img,
      description,
      disponible: "disponible",
      variant:my_array_id_Caracteristique,
    });


    

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}