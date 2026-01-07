import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, verificationLink) {
  // Configurer le transporteur (utilisez votre service d'email)
  const transporter = nodemailer.createTransport({
    service: "gmail", // Exemple avec Gmail
    auth: {
      user: process.env.EMAIL_USER, // Votre email
      pass: process.env.EMAIL_PASSWORD, // Votre mot de passe
    },
  });

  // Configurer l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Vérification de votre compte",
    html: `<p>Cliquez sur ce lien pour vérifier votre compte : <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  // Envoyer l'email
  await transporter.sendMail(mailOptions);
}