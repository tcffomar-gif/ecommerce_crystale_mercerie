const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

const OrderSchema = new Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Référence à l'utilisateur
  array_product: [
    {
      id_product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Référence au produit
      quantite: Number, // Quantité du produit
      price: Number, // Quantité du produit
      caracteristique: { type: Map, of: String }, // Variantes dynamiques (couleur, diamètre, longueur, etc.)
      caracteristique_couleur: {
        type: { type: String, default: "" }, // Le type de la couleur
        img: { type: String, default: "" }, // L'URL de l'image
      },
    },
  ],
  status: { type: String, default: "en attente" }, // Statut de la commande
  createdAt: { type: Date, default: Date.now }, // Date de création
  customerDetails: {
    fullName: String, // Nom complet du client
    phoneNumber: String, // Numéro de téléphone
    wilaya: String, // Wilaya de livraison
    deliveryType: { type: String, enum: ["relayPoint", "homeDelivery"] }, // Type de livraison
    commune: String, // Commune (si livraison à domicile)
    address:String,
    relayPoint: {
      center_id: Number,       // ID du centre Yalidine (ex: 50101)
      name: String,            // Nom du point relais (ex: "Agence des 500 Logements Yalidine")
      address: String,         // Adresse complète
      commune_id: Number,      // ID de la commune
      commune_name: String,    // Nom de la commune (ex: "Batna")
      wilaya_id: Number,       // ID de la wilaya (ex: 5)
      wilaya_name: String,     // Nom de la wilaya (ex: "Batna")
    },
    

  },
  deliveryFees: Number, // Frais de livraison
  total: Number, // Total de la commande

   expiresAt: {
    type: Date,
    default: Date.now,
    //  expires: 4 * 60 //
    expires: 50 * 24 * 60 * 60 // 30 jours en secondes
  }

});


// Créer l'index TTL manuellement (optionnel, car expires fait déjà le travail)
OrderSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
// Create a model based on that schema
const OrderModal = models.Order || mongoose.model("Order", OrderSchema);

// export the model
module.exports = OrderModal;
