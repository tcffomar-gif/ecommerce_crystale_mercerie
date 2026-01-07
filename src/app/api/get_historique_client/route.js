import OrderModal from "app/DBconfig/models/Order";
import ProductModal from "app/DBconfig/models/product";
import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("*******************************************");
  console.log(objFromFrontEnd);

  // - connect to DB
  await connectMongoDB();

  // 2- get data

  // let email_admin ="admin@admin.com"

  // 2- get data with specific statuses
  const array_order = await OrderModal.find({id_user : objFromFrontEnd.id_user }).populate( {path: "array_product.id_product"} ).sort({ createdAt: -1 }); // -1 pour trier du plus récent au plus ancien;
  

  // 4- Go back to frontend
  return NextResponse.json(array_order);
}
