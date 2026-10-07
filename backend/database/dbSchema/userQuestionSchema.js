const mongoose = require("mongoose")

const UserQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userLogin",
        required: true
    },
    name:{
        type: String,
        required: true,
        lowercase: true
    },
    mcqRounds: {
        type: Array,
        required: true
    },
    codingQuestions:{
        type: Array,
        required: true
    },
    interviewQuestions:{
        type:Array,
        required: true
    }

})

const questionSchema = mongoose.model("UserQuestion", UserQuestionSchema)
module.exports = questionSchema