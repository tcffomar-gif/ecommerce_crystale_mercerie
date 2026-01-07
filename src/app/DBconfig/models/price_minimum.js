const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

// define the Schema (the structure of the article)
const Price_minimumSchema = new Schema({
   
    role: String,
    price_min: Number,

});

// Create a model based on that schema
const Price_minModal = models.Price_min || mongoose.model("Price_min", Price_minimumSchema);

// export the model
module.exports = Price_minModal;


