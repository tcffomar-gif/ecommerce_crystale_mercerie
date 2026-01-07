import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token manquant." },
        { status: 400 }
      );
    }

    // Se connecter à la base de données
    await connectMongoDB();

    // Trouver l'utilisateur avec le token
    const user = await UserModal.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json(
        { message: "Token invalide ou expiré." },
        { status: 400 }
      );
    }

    // Marquer l'email comme vérifié et supprimer le token
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email vérifié avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email :", error);
    return NextResponse.json(
      { message: "Une erreur s'est produite lors de la vérification de l'email." },
      { status: 500 }
    );
  }
}