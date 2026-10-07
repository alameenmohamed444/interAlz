const questionSchema = require("../database/dbSchema/userQuestionSchema")

const answerServicesCoding = async (userId, codingId)=>{
    try{

        const questions = await questionSchema.findOne({userId }, {codingQuestions: {$elemMatch:{questionId: Number(codingId)} }})
        console.log("userId",userId)
        console.log("CodingId:", codingId)
        
        if (questions){
            return questions
        }else{
            return null
        }
    }catch(error){
        throw Error(error.message)
    }

}

const answerServicesMcq = async(userId, roundId)=>{
    try{
        const isData = await questionSchema.findOne({userId}, {mcqRounds:{$elemMatch:{roundId: Number(roundId)}}})
        if(isData){
            return isData
        }else{
            return null
        }
    }catch(error){
        throw Error(error.message)
    }
}

const updateMcqAnswer = async (id, isCompleted, score, roundId)=>{
    try{
        const responseDb = await questionSchema.findOneAndUpdate(
            {userId:id, "mcqRounds.roundId": Number(roundId)}, 
            {$set:{"mcqRounds.$.isCompleted": String(isCompleted), 
            "mcqRounds.$.score": Number(score)}}, {new:true})
        if(responseDb){
            return responseDb
        }else{
            console.log(responseDb)
        }
    }catch(error){
        throw Error(error.message)
    }
}

const updateCodingAnswer = async(id, questionId, score, isCompleted, code)=>{
    try{
        const codingResponse = await questionSchema.findOneAndUpdate(
            {userId:id, "codingQuestions.questionId": Number(questionId)}, 
            {$set:{"codingQuestions.$.isCompleted": String(isCompleted), 
            "codingQuestions.$.score": Number(score), "codingQuestions.$.code": code}}, {new:true})
        if (codingResponse){
            return codingResponse
        }else{
            console.log(codingResponse)
        }    
    }catch(error){
        throw Error(error.message)
    }
}





module.exports = {answerServicesCoding, answerServicesMcq, updateMcqAnswer, updateCodingAnswer}