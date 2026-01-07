const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

// define the Schema (the structure of the article)
const CaracteristiqueSchema = new Schema({
   
    type: {
      fr: String, // Type en français
      ar: String, // Type en arabe
    },
    array_value: [
      {
        value: String, // Valeur de l'option (ex: "12", "17", "25")
        priceAdjustment:  { type: Number, required: false }, // Ajustement de prix par rapport au prix de base (peut être positif ou négatif)
        // Ex: +500 pour la longueur 25 (si basePrice=2000, le prix devient 2500)
      }
    ],



});

// Create a model based on that schema
const CaracteristiqueModal = models.Caracteristique || mongoose.model("Caracteristique", CaracteristiqueSchema);

// export the model
module.exports = CaracteristiqueModal;


