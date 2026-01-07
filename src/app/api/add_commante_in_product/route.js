import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";



// type objFromFrontEnd={
//  id_product
// value_start
// description
// }


export async function PUT(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("*******************************************");
  console.log(objFromFrontEnd);

  // 2 connect to DB
  await connectMongoDB();

  // 3- Delete data

  await ProductModal.updateOne(
    { _id: objFromFrontEnd._id },
    {
      $push: {
        comments: objFromFrontEnd.id_comment, // Pousser une chaîne
      },
    }
  );

  // 4- Go back to frontend
  return NextResponse.json({});
}
