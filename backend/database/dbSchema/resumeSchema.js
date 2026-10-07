const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema({


    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userLogin",
        required: true
    },


    name: {
       type: String,
       required: true,
       lowercase: true
    },

    file: {
        required: true,
        type: String
    },

}, {timestamps: true})

const Resume = mongoose.model("Resume", resumeSchema)

module.exports = Resume