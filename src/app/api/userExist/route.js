import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";


export async function POST(request) {
// 1- Receive data from Front-end
const objFromFrontEnd = await request.json()
console.log("*******************************************")
console.log(objFromFrontEnd)

// 2- connect to DB
     await connectMongoDB()

// 3- verifier si user existe
const user = await UserModal.findOne({ email: objFromFrontEnd.email });



// 4- Go back to frontend and send a varibale
return NextResponse.json({user})

}