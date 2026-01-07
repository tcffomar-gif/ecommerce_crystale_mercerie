import { connectMongoDB } from "app/DBconfig/mongodb";
import ProductModal from "app/DBconfig/models/product";
import { NextResponse } from "next/server";
import Price_minModal from "app/DBconfig/models/price_minimum";

export async function GET(request) {
  try {
  
    await connectMongoDB();

  
  const resulta = await Price_minModal.findOne({ role: "price" });
  


    

    return NextResponse.json(resulta);
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    return NextResponse.json({error: error.message }, { status: 500 });
  }
}