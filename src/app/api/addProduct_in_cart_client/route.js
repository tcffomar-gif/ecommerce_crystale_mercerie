import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { uploadStream } from "assets/UploadImg_cloudinary";
import ProductModal from "app/DBconfig/models/product";
import CartModal from "app/DBconfig/models/Cart";

export async function POST(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("*******************************************");
  console.log(objFromFrontEnd);

  // 1- connect to DB
  await connectMongoDB();
  console.log(objFromFrontEnd)


 

  // 3- Prepare the data for CartModal
  const cartData = {
    ...objFromFrontEnd,
    caracteristique_couleur: {
      type: objFromFrontEnd.caracteristique_couleur.type, // Assurez-vous que cette clé existe
      img: objFromFrontEnd.caracteristique_couleur.img, // Assurez-vous que cette clé existe
    },
  };

  // 4- Try to Store obj to DB
  await CartModal.create(cartData);

  // 4- Go back to frontend
  return NextResponse.json({});
}
