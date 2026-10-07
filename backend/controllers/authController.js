const {OAuth2Client} = require('google-auth-library')
const {signinGoogle,getUserDetailsGoogleLogin, storeLocalSignin, checkLocalLogin} = require("../services/authServices")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const signin = async(req, res, next)=>{
    const client = new OAuth2Client(process.env.SERVER_CLIENT_ID)
    try{
        const {token} = req.body
        const verification = await client.verifyIdToken({idToken:token, audience: process.env.SERVER_CLIENT_ID})
        const payload = verification.getPayload()
        const data = await signinGoogle(payload)

        if(!data){
            return res.status(200).json({success: false, message: "User Already exists try another email"})
        }

        const jwtPayload = {
            userId: data._id,
            name: data.name,
            email: data.email,
        }
        const jwtToken = jwt.sign(jwtPayload, process.env.SECRET_ID, {expiresIn: "7d"})
        return res.status(200).json({success: true, jwtToken, username: data.name, userId: data._id})
        
    }catch(error){
        next(error)
    }
}


const login = async (req, res, next)=>{
    const client = new OAuth2Client(process.env.SERVER_CLIENT_ID)
    try{
        const {token} = req.body
        const verification = await client.verifyIdToken({idToken:token, audience: process.env.SERVER_CLIENT_ID})
        const payload = verification.getPayload()
        const data = await getUserDetailsGoogleLogin(payload)

        if(!data){
            return res.status(200).json({message: "User Not Found"})
        }

        const jwtPayload = {
            userId: data._id,
            name: data.name,
            email: data.email,
        }        
        const jwtToken = jwt.sign(jwtPayload, process.env.SECRET_ID, {expiresIn: "7d"})
        return res.status(200).json({success: true, jwtToken, username: data.name, userId: data._id})
        
    }catch(error){
        next(error)
    }
}

const localSignin = async (req, res, next)=>{
    try{
        const {name, email, password} = req.body
        if(name && email && password){
            const hasedPassword = await bcrypt.hash(password, 10)
            const newUser = await storeLocalSignin(name, email, hasedPassword)
            const token = jwt.sign({name, userId: newUser._id}, process.env.SECRET_ID, {expiresIn: "7d"})
            return res.status(200).json({message: "Sucessfull Signin", token, username:newUser.name, userId: newUser._id})
        }else{
            return res.status(201).json({message: "Fill all the fields"}) 
        }  
    }catch(error){
        next(error)
    }
}

const localLogin = async(req, res, next)=>{
    try{
        const {email, password} = req.body
        const checked = await checkLocalLogin(email, password)
        
        if (checked.message !== "Success"){
            return res.status(400).json({message:checked.message})
        }
        const token = jwt.sign({name: checked.name, userId: checked._id}, process.env.SECRET_ID, {expiresIn: "7d"}) 
        return res.status(200).json({token: token, name: checked.name, userId: checked._id})      
    }catch(error){
        next(error)
    }
}


module.exports = {signin, login, localSignin, localLogin}