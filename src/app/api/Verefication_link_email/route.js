import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "L'email est requis." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const existingUser = await UserModal.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Cet email n'existe pas." },
        { status: 400 }
      );
    }

    if (existingUser.emailVerified) {
      return NextResponse.json(
        { message: "Cet email est déjà vérifié." },
        { status: 400 }
      );
    }

    const verificationToken = uuidv4();
    const verificationLink = `${process.env.NEXT_PUBLIC_MY_URL}/fr/verify-email?token=${verificationToken}`;

    existingUser.verificationToken = verificationToken;
    await existingUser.save();

    return NextResponse.json({
      message: "Veuillez vérifier votre email.",
      verificationLink,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification :", error);
    return NextResponse.json(
      { message: "Une erreur s'est produite lors de la vérification.", verificationLink: "false" },
      { status: 500 }
    );
  }
}