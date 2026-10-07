import Logo from '../../assets/logoimage.webp'
import './index.css'
import {GoogleLogin} from '@react-oauth/google'
import Cookies from 'js-cookie'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const SignIn = ()=>{
    const navigate = useNavigate()
    const [name, updateName] = useState("")
    const [email, updateEmail] = useState("")
    const [password, updatePassword] = useState("")


    const successHandler = async(credentailResponse)=>{
        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({token:credentailResponse.credential})
        }
        const response = await fetch("http://localhost:3000/api/auth/google/signin", options)
        const data = await response.json()
        if (response.ok && data.jwtToken){
            Cookies.set("jwtToken", {token:data.jwtToken, username:data.newUser.name})
            navigate("/")
        }else{
            alert(data.message)
        }
        
    }

    const errorHandler = (error)=>{
        console.log(error)
    }


    const changeName = (e)=>{
        updateName(e.target.value)
    }

    const chageEmail = (e)=>{
        updateEmail(e.target.value)
    }

    const changePassword = (e)=>{
        updatePassword(e.target.value)
    }


    const submitCredentials = async(e)=>{
        if(password.length < 6){
            alert("password is too short atleast 6")
            return
        }
        e.preventDefault()
        if(name && email && password){
            const userData = {name, email, password}
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json"
                },
                body: JSON.stringify(userData)
            } 
            const response = await fetch("http://localhost:3000/api/auth/local/signin", options)
            const data = await response.json()
            console.log(data)
            if (!response.ok){
                alert(data.message)
                return 
            }
            Cookies.set("jwtToken", JSON.stringify({token: data.token, username: data.username, userId: data.userId}))
            navigate("/uploadResume")
        }else{
            alert("Fill all the Fields")
        }
    }

    return (
        <div className='signin-container'>
          <div>
            <div className='logo-container'>
                <img src= {Logo} className='img-style'/>
                <h1>Welcome To Interalz</h1>
                <p>Signin to start your interview</p>
            </div>
            <div className='form-container'>
              <form>
                <div>
                  <label htmlFor = "username">username</label>
                  <input type = "text" id = "username" value = {name} onChange = {changeName}/>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input type = "text" id = "email" value = {email} onChange = {chageEmail}/>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type = "password" id = "password" value = {password} onChange = {changePassword}/>
                </div>
                <div className='btn-container'>
                    <button type = "submit" className='signin-btn' onClick = {submitCredentials}>signin</button>
                </div>
                <div className='various-login'>
                    <p>or continue with</p>
                    <div className='social-btn-container'>
                        <div>
                            <GoogleLogin onSuccess={successHandler} onError={errorHandler}/>
                        </div>
                    </div>
                </div>
              </form>
              <div className='tablet-container'>
                <div className='features-container'>
                    <div className='icon-container'>
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                        <h1>Ai-Powered-Interview</h1>
                        <p>practice improve and ace your next interview</p>
                    </div>
                </div>
                <div className='features-container'>
                    <div className='icon-container'>
                        <i className="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h1>Ai-Monk-Interviews</h1>
                        <p>Practice realistic interviews with an AI interviewer</p>
                    </div>
                </div>
                <div className='features-container'>
                    <div className='icon-container'>
                        <i className="fa-solid fa-chart-column"></i>
                    </div>
                    <div>
                        <h1>Performance Analysis</h1>
                        <p>Track your strengths, weaknesses, and interview score</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default SignIn