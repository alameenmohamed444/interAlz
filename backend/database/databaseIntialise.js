const mongoose = require("mongoose")

const initializeDatabase = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongoose Started")
    }catch(error){
        console.log(error)
    }
}

module.exports = initializeDatabase