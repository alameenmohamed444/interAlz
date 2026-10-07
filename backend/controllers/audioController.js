const generateAnswer = require("../utils/ai-model")
const {getAudioPrompt} = require("../utils/prompts") 
const {getAudioQuestions, updateAudioQuestion} = require("../services/audioQuestions")

const storeAnswer = async (req, res, next)=>{
    try{
        
        const {file, id} = req
        const {questionId} = req.body
        
        const prompt = getAudioPrompt()
        
        const convertedAiText = await generateAnswer(prompt, file)
        
        const isUpdated = await updateAudioQuestion(id, questionId, convertedAiText)
        if(isUpdated){
            return res.status(200).json({text: convertedAiText})
        }
        next(isUpdated)
    }catch(error){
        next(error)
    }
}


const getAudioQuestion = async (req, res, next)=>{
    try{
        const {id} = req
        const isAvailable = await getAudioQuestions(id)
        if(isAvailable){
            res.status(200).json({audioQuestions: isAvailable})
        }

    }catch(error){
        next(error)
    }
}


module.exports = {getAudioQuestion, storeAnswer}