const {answerServicesCoding, answerServicesMcq, updateMcqAnswer, updateCodingAnswer} = require("../services/questionServices") 

const mcqQuestions = async(req, res, next)=>{
    try{
        const {id} = req
        const{id:roundId} = req.params
        const mcqQuestions = await answerServicesMcq(id, roundId)
        console.log(mcqQuestions)
        const {mcqRounds} = mcqQuestions
        if (mcqQuestions){
            res.status(200).json({message: "Success", data: mcqRounds})
        }else{
            res.status(400).json({messae: "cannot find the resources"})
        }
    }catch(error){
        next(error)
    }
}




const getCodingQuestion = async(req, res, next)=>{
    try{
        const {id} = req
        
        const {id:codingId} = req.params
        console.log("codingId", codingId)
        if(id){
            const codingData = await answerServicesCoding(id, codingId)
            
            if(codingData){
                const {codingQuestions} = codingData
                console.log(codingQuestions)
                res.status(200).json({message:"Success", data: codingQuestions})
            }else{
                res.status(400).json({message:"Cannot Find the Resource You are looking"})
            }
        }else{
            res.status(400).json({message: "cannot find the user", id})
        }
    }catch(error){
        next(error)
    }
}




const updateMcq = async (req, res, next)=>{
    try{
        const {id} = req
        const {id: roundId} = req.params
        const {isCompleted, score} = req.body
        const checkScore = score < 0 ? 0: score 
        console.log(roundId)
        const isUpdated = await updateMcqAnswer(id, isCompleted, checkScore, roundId)
        if(isUpdated){
            return res.status(200).json({message: "Success", data:isUpdated})
        }else{
            return res.status(400).json({message: "Failure", data:null})
        }
    }catch(error){
        next(error)
    }
}




const updateCoding = async(req, res, next)=>{
    try{
        const {id} = req
        const {questionId, score, isCompleted, code} = req.body
        const dbResponse = await updateCodingAnswer(id, questionId, score, isCompleted, code)
        if (dbResponse){
            res.status(200).json({message: "Success", data: dbResponse})
        }else{
            res.status(400).json({message: "Failure", data: null})
        }
    }catch(error){
        next(error)
    }
}




module.exports =  {mcqQuestions, getCodingQuestion, updateMcq,updateCoding}