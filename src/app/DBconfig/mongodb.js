const mongoose = require('mongoose');

 


 
  export const connectMongoDB = async () => {
    try {
      console.log(process.env.MONGO_URL)
      await mongoose.connect(process.env.MONGO_URL);
      console.log("connected to MongoDB");
    } catch (error) {
      console.log("ERROR WITH CONNECTING  MongoDB", error);
    }
  };
