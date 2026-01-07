import ProductModal from "app/DBconfig/models/product";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

// api/get_Products_plus_vendus_pagination_mobil
export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const category = searchParams.get('category');
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const searchTerm = searchParams.get('searchTerm');

    const skip = (page - 1) * limit;

    // Build query
    let query = { disponible: "disponible" };
    
    if (category) query.categorie = category;
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (searchTerm) {
      query.$or = [
        { 'title.fr': { $regex: searchTerm, $options: 'i' } },
        { 'title.ar': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Build sort
    let sort = {};
    switch(sortBy) {
      case 'price-asc': sort = { price: 1 }; break;
      case 'price-desc': sort = { price: -1 }; break;
      case 'name': sort = { 'title.fr': 1 }; break;
      default: sort = { createdAt: -1 }; break;
    }

    const [products, total] = await Promise.all([
      ProductModal.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ProductModal.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
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