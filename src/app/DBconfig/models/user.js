const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

// define the Schema (the structure of the article)
const userSchema  = new Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  emailVerified: { type: Boolean, default: false }, // Champ pour vérifier l'email
  verificationToken: String, // Token de vérification
});

// Create a model based on that schema
const UserModal  = models.User || mongoose.model("User", userSchema );

// export the model
module.exports = UserModal ;