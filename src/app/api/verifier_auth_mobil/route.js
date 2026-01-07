import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // 1- Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Aucun token fourni.", success: false },
        { status: 401 }
      );
    }

    // 2- Extraire le token
    const token = authHeader.substring(7);

    // 3- Se connecter à la base de données
    await connectMongoDB();

    // 4- Vérifier le token JWT
    const decoded = jwt.verify(token, "my_id_user_inf");
    
    // 5- Trouver l'utilisateur
    const user = await UserModal.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé.", success: false },
        { status: 404 }
      );
    }

    // 6- Préparer les données utilisateur
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    };

    // 7- Répondre au front-end
    return NextResponse.json({
      message: "Token vérifié avec succès.",
      success: true,
      user: userData,
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return NextResponse.json(
      { 
        message: "Token invalide ou expiré.", 
        success: false 
      },
      { status: 401 }
    );
  }
}