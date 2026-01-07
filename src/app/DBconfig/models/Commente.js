const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

// define the Schema (the structure of the article)
const CommentsSchema = new Schema({
   
    id_product:{ type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    email: String,
    avis : String,
    rating : Number,
    createdAt: { type: Date, default: Date.now }, // Date de création
});

// Create a model based on that schema
const CommentsModal = models.Commente || mongoose.model("Commente", CommentsSchema);

// export the model
module.exports = CommentsModal;


