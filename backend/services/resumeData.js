const Resume = require('../database/dbSchema/resumeSchema')
const questionSchema = require('../database/dbSchema/userQuestionSchema')
const userSchema = require("../database/dbSchema/userLoginSchema")

const updateResumebase = async (name, url, userId)=>{
    try{

        if(url != "" && name != ""){
            const isAlreadyExists = await Resume.findOne({userId})
            if(isAlreadyExists){
                const resumeDetails = await Resume.findOneAndDelete({userId})
                const questionCleared = await questionSchema.findOneAndDelete({userId})
                if(resumeDetails && questionCleared){
                    console.log("deleted Successfully")
                }
            }             
            const resumeuploaded = await Resume.create({
                userId: userId,
                name: name.toLowerCase(),
                file: url
            })
            console.log(resumeuploaded)
            return resumeuploaded
      }
    }catch(error){
        throw error
    }
}


const getQuestions = async (name)=>{
    const isDataExists = await questionSchema.findOne({name:name.toLowerCase()}) 
        if(isDataExists){
            return isDataExists
        }else{
            return null
        }
}

const updateQuestion = async(text, name)=>{
    try{
        const parsedData = JSON.parse(text)
        const {mcqRounds, codingQuestions, interviewQuestions} = parsedData
        const isUserExists = await userSchema.findOne({name:name.toLowerCase()})
        if (!isUserExists){
            throw Error("User Not Found") 
        } 
        
        const created = await questionSchema.create({userId: isUserExists._id, name:name.toLowerCase(), mcqRounds : mcqRounds, codingQuestions: codingQuestions, interviewQuestions: interviewQuestions})
        return created


    }catch(error){
        throw Error(error.message)
    }
}

module.exports = {updateResumebase, updateQuestion, getQuestions}