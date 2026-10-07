const questionSchema = require("../database/dbSchema/userQuestionSchema")


const getAudioQuestions = async (userId)=>{
    try{
        const interviewAudioQuestions = await questionSchema.findOne({userId}, "interviewQuestions")
        return interviewAudioQuestions
    }catch(error){
        throw new Error(error.message)
    }
}

const updateAudioQuestion = async (id, questionId, convertedAiText)=>{
    try{
        const index = questionId - 1
        const updatedAnswer = await questionSchema.findOneAndUpdate({userId:id}, {$set:{[`interviewQuestions.${index}.answer`]:  convertedAiText}})
         
        if(updatedAnswer){
            return updatedAnswer
        }
        return null
    }catch(error){
        console.log(error)
    }   
}



module.exports = {getAudioQuestions, updateAudioQuestion}