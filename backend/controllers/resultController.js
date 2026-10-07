const {getQuestions} = require("../services/resumeData")
const aiModel = require("../utils/resultModel")

const {resultPrompt} = require("../utils/prompts")



const getResultAnswer = async(req, res, next)=>{
    try{
        const {id} = req
        const {username} = req.body
        const userAnswers = await getQuestions(username)
        if(userAnswers){
            const {mcqRounds, codingQuestions, interviewQuestions, name} = userAnswers
            const prompt = resultPrompt(mcqRounds, codingQuestions, interviewQuestions, name)
            const aiAnalyse = await aiModel(prompt)
            if (aiAnalyse){
                
                return res.status(200).json({data: aiAnalyse.trim(), mcqRounds, codingQuestions, name})
            }else{
                return res.status(400).json({data: "Something Went Wrong Please try Again Later"})
            }
        }else{
            return res.status(400).json({data: null})
        }
    }catch(error){
        next(error)
    }
}


module.exports = getResultAnswer