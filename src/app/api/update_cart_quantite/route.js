import CartModal from "app/DBconfig/models/Cart";
import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("*******************************************");
  console.log(objFromFrontEnd);

  // 2 connect to DB
  await connectMongoDB();

  // 3- Delete data

  await CartModal.updateOne(
    { _id: objFromFrontEnd._id },
    {
      quantite: objFromFrontEnd.quantite
    }
  );

  // 4- Go back to frontend
  return NextResponse.json({});
}
