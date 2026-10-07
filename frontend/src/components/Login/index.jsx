import './index.css'
import Logo from '../../assets/logoimage.webp'
import {GoogleLogin} from '@react-oauth/google'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'
const Login = ()=>{
    const navigate = useNavigate()
    const [password, changepassword] = useState("")
    const [email, changeEmail] = useState("")







    const renderSuccess = async (credentailResponse)=>{
        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                accept: "application/json"
            },
            body: JSON.stringify({token:credentailResponse.credential})
        }
        const response = await fetch("http://localhost:3000/api/auth/google/login", options)
        const data = await response.json()
        console.log(data)
        if (response.ok && data.jwtToken){
            const storageData = {token: data.jwtToken, username: data.username, userId: data.userId}
            Cookies.set("jwtToken", JSON.stringify(storageData), {expires: 7})
            navigate("/uploadResume")
        }
    }

    const renderError = (error)=>{
        console.log(error)
    }


    const submitCredentials = async(e)=>{
        e.preventDefault()
        const userData = {email, password}
        const options = {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify(userData)
        }
        const response = await fetch("http://localhost:3000/api/auth/local/login", options)
        
        if(response.ok){
            const data = await response.json()
            if(response.status == "200"){
                Cookies.set("jwtToken", JSON.stringify({token: data.token, username: data.name}))
                console.log(data)
                navigate("/uploadResume")
            }else{
                alert(data.message)
            }
            
        }
        
    
    }


    const updateEmail = (e)=>{
        changeEmail(e.target.value)
    }
    const updatepassword = (e)=>{
        changepassword(e.target.value)
    }

    return (
        <div className='login-container'>
          <div>
            <div className='logo-container'>
                <img src= {Logo} className='img-style'/>
                <h1>Welcome back</h1>
                <p>Login to continue your interview</p>
            </div>
            <div className='form-container'>
              <form>
                <div>
                  <label htmlFor = "email">email</label>
                  <input type = "text" id = "email" value = {email} onChange={updateEmail}/>
                </div>
                <div>
                    <label htmlFor='password'>password</label>
                    <input type = "password" id = "password" value = {password} onChange = {updatepassword}/>
                </div>
                <div className='btn-container'>
                    <button type = "submit" className='login-btn' onClick = {submitCredentials}>Login</button>
                </div>
                <div className='various-login'>
                    <p>or continue with</p>
                    <div className='social-btn-container'>
                        <div>
                            <GoogleLogin onSuccess={renderSuccess} onError={renderError}/>
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
};

export default Login;