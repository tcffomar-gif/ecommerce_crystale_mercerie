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

  // 2- get data with specific statuses
  const array_order = await OrderModal.find({
    status: { $in: ["refusé", "en cours de livraison","recu"] },
  });
  

  // 4- Go back to frontend
  return NextResponse.json(array_order);
}
