import CartModal from "app/DBconfig/models/Cart";
import ProductModal, { db } from "app/DBconfig/models/product";
import OrderModal from "app/DBconfig/models/Order";

import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {


    // 1- Receive data from Front-end
    const objFromFrontEnd = await request.json();
    console.log("*******************************************");
    console.log(objFromFrontEnd);

    // 1- connect to DB
    await connectMongoDB();

    // 2- get data 

    const machin = await OrderModal.findOne({_id : objFromFrontEnd.id }).populate( {path: "array_product.id_product"} )
    console.log("hnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
   console.log(machin)
    


      // 4- Go back to frontend
  return NextResponse.json( machin );

}