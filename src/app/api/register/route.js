import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
// import emailjs from "emailjs-com";

export async function POST(request) {
  try {
    // 1- Recevoir les données du front-end
    const { email, password , emailVerified } = await request.json();

    // 2- Se connecter à la base de données
    await connectMongoDB();

    // 3- Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModal.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà." },
        { status: 400 }
      );
    }

    // 4- Hacher le mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5- Générer un token de vérification
    const verificationToken = uuidv4();

    // 6- Créer l'utilisateur dans la base de données
    await UserModal.create({
      email,
      password: hashedPassword,
      name: " ",
      emailVerified: emailVerified,
      verificationToken,
    });

    // 7- Envoyer un email de vérification avec EmailJS
    const verificationLink = `${process.env.NEXT_PUBLIC_MY_URL}/fr/verify-email?token=${verificationToken}`;

    // emailjs.send(
    //   "service_b8yllxd", // Remplacez par votre Service ID
    //   "template_xqz6nbj", // Remplacez par votre Template ID
    //   {
    //     email,
    //     verificationLink,
    //   },
    //   "SxtJa7Epzc7oi8JKP" // Remplacez par votre User ID
    // );

    // 8- Répondre au front-end
    return NextResponse.json({
      message: "Compte créé avec succès. Veuillez vérifier votre email.",
      verificationLink
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return NextResponse.json(
      { message: "Une erreur s'est produite lors de l'inscription." , verificationLink:"false" },
      { status: 500 }
    );
  }
}