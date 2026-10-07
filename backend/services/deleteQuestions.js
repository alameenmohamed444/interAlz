const questionSchema = require("../database/dbSchema/userQuestionSchema")

const deleteResources = async (id)=>{
    try{
        const isDeleted = await questionSchema.findOneAndDelete({userId:id})
        return isDeleted
    
    }catch(error){
        console.log(error)
    }
}

module.exports = deleteResources