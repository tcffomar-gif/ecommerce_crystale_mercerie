import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1. Connect to DB
    await connectMongoDB();

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5; // 5 produits par page par défaut

    // 3. Calculate skip value
    const skip = (page - 1) * limit;

    // 4. Get paginated data
    const arr_data = await ProductModal.find({ disponible: "disponible" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 5. Get total count for pagination info
    const total = await ProductModal.countDocuments({ disponible: "disponible" });
    const totalPages = Math.ceil(total / limit);

    // 6. Return data with pagination info
    return NextResponse.json({
      products: arr_data,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        limit
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}