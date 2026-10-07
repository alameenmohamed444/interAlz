const questionSchema = require("../database/dbSchema/userQuestionSchema")

const updateUserOption = async (userId, userAnswer, id, roundId)=>{
    try{
        const isUpdated = await questionSchema.findOneAndUpdate({userId}, {$set:{[`mcqRounds.${roundId}.questions.${id - 1}.answer`]: userAnswer}})
        return isUpdated
    }catch(error){
        throw Error(error)
    }
}

module.exports = updateUserOption 