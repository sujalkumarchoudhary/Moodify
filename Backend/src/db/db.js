const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI+"/MoodifyDB")
        console.log("Databse connected succesfully")

    }
    catch(error){
        console.log("Databse connection error", error);
    }
}

module.exports = connectDB;