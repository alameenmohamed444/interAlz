const deleteData = require("../services/deleteQuestions")

const clearRecords = async (req, res, next)=>{
    try{
        const {id} = req
        const deleteResources = deleteData(id)
        if(deleteResources){
            return res.status(200).json({data:deleteResources})
        }else{
            return res.status(400).json({data: deleteResources})
        }
    }catch(error){
        next(error)
    }
}

module.exports = clearRecords