const updateUserOption = require("../services/updateUserOption")

const updateUserMcqAnswer = async (req, res, next)=>{
    try{
        const{id:userId} = req
        const {id} = req.params
        const {userAnswer, roundId} = req.body
        console.log("roundId", roundId)
        console.log("mcq", id)
        console.log(userAnswer)
        if(userId && id && userAnswer){
            const isUpdated = await updateUserOption(userId, userAnswer, id, roundId)
            if(isUpdated){
                return res.status(200).json({data: "Success"})
            }else{
                return res.status(400).json({data:"Failure"})
            }
        }

    }catch(error){
        next(error)
    }
}

module.exports = updateUserMcqAnswer