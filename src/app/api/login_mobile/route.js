import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // 1- Recevoir les données du front-end
    const { email, password } = await request.json();

    // 2- Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { message: "L'email et le mot de passe sont requis.", success: false },
        { status: 400 }
      );
    }

    // 3- Se connecter à la base de données
    await connectMongoDB();

    // 4- Trouver l'utilisateur
    const user = await UserModal.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect.", success: false },
        { status: 401 }
      );
    }

    // 5- Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect.", success: false },
        { status: 401 }
      );
    }

  

    // 7- Générer le token JWT
    const authToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "my_id_user_inf",
      { expiresIn: "7d" }
    );



    // 9- Répondre au front-end
    return NextResponse.json({
      message: "Connexion réussie.",
      success: true,
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    });

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json(
      { 
        message: "Une erreur s'est produite lors de la connexion.", 
        success: false 
      },
      { status: 500 }
    );
  }
}