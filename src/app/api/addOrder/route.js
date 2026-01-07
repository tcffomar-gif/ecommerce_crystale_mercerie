import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { uploadStream } from "assets/UploadImg_cloudinary";
import ProductModal from "app/DBconfig/models/product";
import CartModal from "app/DBconfig/models/Cart";
import OrderModal from "app/DBconfig/models/Order";

export async function POST(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("*******************************************");
  console.log(objFromFrontEnd);

  // 1- connect to DB
  await connectMongoDB();
 

  

  // 4- Try to Store obj to DB
  await OrderModal.create(objFromFrontEnd);

  // 4- Go back to frontend
  return NextResponse.json({});
}
