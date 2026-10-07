const userSchema = require("../database/dbSchema/userLoginSchema")
const bcrypt = require("bcrypt")

const signinGoogle = async (payload)=>{
    try{
        const {email, name} = payload
        const userExisits = await userSchema.findOne({email})
        if (!userExisits){
            const newUser = await userSchema.create({name, email, authType: "Google"}) 
            return newUser 
        }
        return null
    }catch(error){
        throw error

    }
}

const getUserDetailsGoogleLogin = async (payload)=>{
    try{
        const {email} = payload
        const getData = await userSchema.findOne({email})
        console.log(getData)
        if (!getData){
            return null
        }else{
            return getData
        }
    }catch(error){
        throw error
    }
}


const storeLocalSignin = async (name, email, password)=>{
    try{
        const newUser = await userSchema.create({name, email, password, authType: "Local"})
        if(newUser){
            return newUser
        }  
    }catch(error){
        throw error
    }
}



const checkLocalLogin = async (email, password)=>{
    try{
        const isExists = await userSchema.findOne({email})
        if (isExists){
            const correctPassword = await bcrypt.compare(password, isExists.password)
            if(correctPassword){
                return {message: "Success", payload:isExists}
            }else{
                return {message: "Incorrect Password"}
            }
        }else{
            return {message: "User doesn't exists"}
        }

    }catch(error){
        throw error
    }
}



module.exports = {signinGoogle,getUserDetailsGoogleLogin, storeLocalSignin, checkLocalLogin}