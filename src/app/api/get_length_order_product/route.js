import OrderModal from "app/DBconfig/models/Order";
import ProductModal from "app/DBconfig/models/product";
import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  // 1- connect to DB
  await connectMongoDB();

  // 2- get data

  // let email_admin ="admin@admin.com"

  // Compter le nombre de documents où le prix est supérieur à 2500
  const order = await OrderModal.countDocuments({
    status: { $in: ["en attente", "confirmé"] },
  });

  const produit = await ProductModal.countDocuments({});



  // 4- Go back to frontend
  return NextResponse.json({order,produit});
}
