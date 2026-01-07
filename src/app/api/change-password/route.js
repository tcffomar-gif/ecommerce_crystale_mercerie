
import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";








export async function POST(request) {
  // 1- Receive data from Front-end
  const objFromFrontEnd = await request.json();
  console.log("***********************registerr*****************************");
  console.log(objFromFrontEnd);

  // 2- connect to DB
  await connectMongoDB();


  const user = await UserModal.findOne({ email: objFromFrontEnd.email }); //get information of admin
   
  if (!user) {
    return NextResponse.json({ message: "Utilisateur non trouvé.", erreur:true });
  }
  
  // data from front end
   const currentPassword= objFromFrontEnd.currentPassword
   const newPassword= objFromFrontEnd.newPassword

  // 3. Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
    if (!isPasswordValid) {
      return NextResponse.json({message: "Mot de passe actuel incorrect.",  erreur:true });
    }

      // 4. Hacher le nouveau mot de passe
      const salt = await bcrypt.genSalt();
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // 5. Mettre à jour le mot de passe dans la base de données
      user.password = hashedNewPassword;
      await user.save();



  // 4- Go back to frontend
  return NextResponse.json({message: "Mot de passe mis à jour avec succès.",  erreur:false});
}
