import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'
export const ProtectedRoute = ({children})=>{
    const jwt = Cookies.get("jwtToken")
    if(!jwt || jwt === "undefined"){
        return <Navigate to="/login" replace />
    }
    try{
        const {token} = JSON.parse(jwt)
        if (!token){
            return <Navigate to = "/login" replace/>
        }
        else{
            return children
        }
    }catch(error){
        console.log(`Error from Token ${error}`)
        Cookies.remove("jwtToken")
        return <Navigate to = "/login" replace/>
    }
}

export const LoginOrSignin = ({children})=>{
    const cookiesData = Cookies.get("jwtToken")
    if(!cookiesData || cookiesData === "undefined"){
        return children
    }
    try{
        const {token} = JSON.parse(cookiesData)
        if (token){
            return <Navigate to = "/uploadResume" replace/>
        }
    }catch(error){
        console.log(`Error from Token ${error}`)
        Cookies.remove("jwtToken")
        return <Navigate to = "/login" replace/>
    }
}
