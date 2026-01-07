import CommentsModal from "app/DBconfig/models/Commente";
import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";



// type objFromFrontEnd={
//  id_product
// value_start
// description
// }


export async function POST(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("*******************************************");
  console.log(objFromFrontEnd);

  // 2 connect to DB
  await connectMongoDB();

  // 3- add data

   const my_data=   await CommentsModal.create({
    name: objFromFrontEnd.name,
    email: objFromFrontEnd.email,
    avis : objFromFrontEnd.avis,
   });


  // 4- Go back to frontend
  return NextResponse.json(my_data);
}
