const mongoose = require("mongoose")

const userSchemaGoogle = new mongoose.Schema(
    {


    name:{
        type: String,
        trim:true,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
    },

    authType:{
        type: String,
        enum: ["Google", "Local"]
    }
    }, {timestamps: true} 

)
 
const userSchema = mongoose.model("userLogin", userSchemaGoogle)

module.exports = userSchema
