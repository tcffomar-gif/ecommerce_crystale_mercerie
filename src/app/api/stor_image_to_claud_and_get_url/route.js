import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { uploadStream } from "assets/UploadImg_cloudinary";
import ProductModal from "app/DBconfig/models/product";

export async function POST(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.formData();
  console.log("***********************registerr*****************************");
  console.log(objFromFrontEnd);

  // 2- connect to DB
  await connectMongoDB();

  //   upload image in cloudinary and get url
  // add image to cloudinary & get url

  const machinImg = objFromFrontEnd.get("file");

  const bytes = await machinImg.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadedImg = await uploadStream(buffer);
  console.log(uploadedImg);
  console.log("donnnnnnneeeeeeeee");

  const img_url = uploadedImg;



  // 4- Go back to frontend
  return NextResponse.json({img_url});
}
