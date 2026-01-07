const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = mongoose.models;

// define the Schema (the structure of the article)
const Caracteristique_colorSchema = new Schema({
  // type: {
  //   fr: String, // Type en français
  //   ar: String, // Type en arabe
  // },


  type:String,
  img: {
      secure_url: String,
      public_id_url: String,
      },
    

});

// Create a model based on that schema
const Caracteristique_colorModal =
  models.Caracteristique_color ||
  mongoose.model("Caracteristique_color", Caracteristique_colorSchema);

// export the model
module.exports = Caracteristique_colorModal;
