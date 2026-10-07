const jwt = require("jsonwebtoken")

const verifyCredentials = (req, res, next)=>{
    try{
        const {authorization} = req.headers
        if(!authorization || !authorization.startsWith("Bearer")){
            res.status(400).json({success: false, message: "Authorization is missing"})
        }else{
            const token = authorization.split(" ")[1]
             
            if(!token){
                return res.status(400).json({success: false, message: "token is missing"})
            }else{
                const payload = jwt.verify(token, process.env.SECRET_ID)
                console.log(payload.userId)
                req.id = payload.userId
                console.log(payload.userId)
                next()
            }
        }
    }catch(error){
        next(error)
    }
}

module.exports = verifyCredentials