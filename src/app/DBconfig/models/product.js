const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

const productSchema = new Schema({
  variant: [{ type: mongoose.Schema.Types.ObjectId, ref: "Caracteristique" }],
  variant_color: [{ type: mongoose.Schema.Types.ObjectId, ref: "Caracteristique_color" }],
  categorie: String,
  title: {
    fr: String, // Titre en français
    ar: String, // Titre en arabe
  },
  price: Number,
  ancien_price: Number,
  array_ProductImg: [{
    secure_url: String,
    public_id_url: String,
  }],
  disponible: String,
  description: {
    fr: String, // Description en français
    ar: String, // Description en arabe
  },
  comments: [
  { type: mongoose.Schema.Types.ObjectId, ref: "Commente" }
  ],
  reduction: [ // Changement ici : passage à un tableau d'objets
    {
      reduction: Number, // Pourcentage de réduction
      quantite: Number, // Quantité applicable pour cette réduction
      dateDebut: Date, // Optionnel : date de début de la réduction
      dateFin: Date, // Optionnel : date de fin de la réduction
    },
  ],
  purchaseCount: { type: Number, default: 0 }, // Nouveau champ pour suivre les achats
  createdAt: { type: Date, default: Date.now } // Nouvel attribut ajouté ici
});

const ProductModal = models.Product || mongoose.model("Product", productSchema);
module.exports = ProductModal;
