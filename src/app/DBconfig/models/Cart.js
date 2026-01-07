const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;





const CartSchema = new Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  id_product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantite: Number,
  caracteristique: { type: Map, of: String },
  caracteristique_couleur: {
    type: { type: String },
    img: { type: String },
  },
  priceData: {
    basePrice: Number,       // Prix de base du produit
    priceAdjustment: Number, // Ajustement total des caractéristiques
    unitPrice: Number,       // Prix unitaire final (basePrice + priceAdjustment)
    totalPrice: Number       // Prix total (unitPrice * quantite)
  },
     expiresAt: {
    type: Date,
    default: Date.now,
    //  expires: 4 * 60 //
    expires: 14 * 24 * 60 * 60 // 30 jours en secondes
  }
}, { timestamps: true });


// Créer l'index TTL manuellement (optionnel, car expires fait déjà le travail)
CartSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
// Create a model based on that schema
const CartModal = models.Cart || mongoose.model("Cart", CartSchema);

// export the model
module.exports = CartModal;


