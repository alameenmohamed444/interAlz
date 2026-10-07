import { useEffect, useRef, useState } from "react"
import Navbar from "../navbar"
import './index.css'
import Cookies from 'js-cookie'
import { TailSpin } from "react-loader-spinner";
import failure from '../../assets/failure.png'
import { useNavigate } from "react-router-dom";
import Editor from '@monaco-editor/react'

const views = {
    success: "Success",
    failure: "Failure",
    loading: "Loading"
}


const RecordComponent = ()=>{
    const [isStartRecording, updateIsStrartRecording] = useState(false)
    const [currentView, updateView] = useState(views.loading)
    
    const recorderRef = useRef(null)
    const mediaRef = useRef(null)
    const chunckRef = useRef([])
    const [recordedAudio, updateRecordedAudio] = useState("")
    const [disabledbtn, updateDisabledbtn] = useState(true)
    const [audioQuestion, updateAudioQuestion] = useState(null)
    const [currentIndex, updatecurrentIndex] = useState(0)
    const [coding, updateValue] = useState(null)
    const cookiesData = Cookies.get("jwtToken")
    const {token} = JSON.parse(cookiesData)
    const navigate = useNavigate()
    
    
    

    useEffect(()=>{
        if(!audioQuestion) return 


        const speech = new SpeechSynthesisUtterance(audioQuestion.questionData.question)

        speech.onend = ()=>{
            console.log("finished Speaking")
            updateDisabledbtn(false)
        }

        speechSynthesis.speak(speech)

        

    }, [audioQuestion])

    
    useEffect(()=>{
        if (currentView !== "Loading") return 
        const getAudioInterviewQuestion = async()=>{
            try{
                const option = {
                    method: "GET",
                    headers:{
                        "Content-Type": "application/json",
                        accept: "application/json",
                        authorization: `Bearer ${token}`
                    }
                }
                const questionResponse = await fetch("http://localhost:3000/interview/audio/challenge", option)
                if(questionResponse.ok){
                    const data = await questionResponse.json()
                    updateAudioQuestion({questionData:data.audioQuestions.interviewQuestions[currentIndex], allQuestion:data.audioQuestions})
                    
                    updateView(views.success)
                    updateDisabledbtn(true)
                }
            }catch(error){
                console.log(error)
                updateView(views.failure)
            }
        }
        
        getAudioInterviewQuestion()
        
    }, [currentView, currentIndex])

    useEffect(()=>{
        if (!recordedAudio) return
        const storeAnswer = async()=>{
            console.log(recordedAudio)
            try{
                
                const formData = new FormData()
                formData.append("questionId", audioQuestion.questionData.questionId)
                formData.append("audio", recordedAudio)
                const options = {
                    method: "POST",
                    headers:{
                        
                        accept: "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: formData
                }
                const response = await fetch("http://localhost:3000/interview/audio/text", options)
                if(response.ok){
                    const data = await response.json()
                    console.log(data)
                    updateView(views.success)
                }
            }catch(error){
                console.log(error)
            }finally{
                updateDisabledbtn(false)
            }
        
        }
        storeAnswer()    
    }, [recordedAudio])
    

    const renderSuccessView = ()=>{

        const stopRecording = ()=>{
            
            updateIsStrartRecording(false)
            updateDisabledbtn(true)
            
            recorderRef.current.onstop = ()=>{
                
                console.log("Recording Stoped")
                
                const blob = new Blob(chunckRef.current, {type: recorderRef.current.mimeType})
                
                updateRecordedAudio(blob)
                if(audioQuestion.questionData.questionId === 15){
                    navigate("/interview/result")
                }
                updatecurrentIndex(prevIndex=> prevIndex + 1)
                updateView(views.loading) 
                
                

            }
            

            recorderRef.current.stop()

            mediaRef.current.getTracks().forEach(element => {
                element.stop()
            });       

        }

        
        const startRecording = async ()=>{
            updateIsStrartRecording(true)
            chunckRef.current = []
            try{
                const stream = await navigator.mediaDevices.getUserMedia({audio:true})
                mediaRef.current = stream
                
                recorderRef.current = new MediaRecorder(stream)
                recorderRef.current.onstart = ()=>{
                    console.log("Recording Started")
                }


                recorderRef.current.ondataavailable = (event)=>{
                    chunckRef.current.push(event.data)
                }
                recorderRef.current.start()
                
            }catch(error){
                alert("MicroPhone Access Required")
            }
        }

        const getValue = (value)=>{
            updateValue(value)
        }
        

        return (
            <div>
                <Navbar selectedBar = "Interview"/>
                <div className="audio-interview-container">
                    <div className="ai-question-container">
                        <h1>AI Question <span className="robot-span"><i className="fa-solid fa-robot robot-icon"></i></span></h1>
                        {audioQuestion && <div className="text-box">{audioQuestion.questionData.question}</div>}
                    </div>
                    <div>
                        <button className="mic-btn">
                        <span>
                            <i className="fa-solid fa-microphone microphone-style"></i>
                        </span>
                        </button>
                    </div>

                    <div>
                        
                    </div>

                    <div className="start-stop-container">
                        {isStartRecording ? <button className="start-stop" onClick={stopRecording} disabled = {disabledbtn}>Stop</button>: <button className="start-stop" onClick={startRecording} disabled ={disabledbtn}>Start</button>}
                    </div>
                </div>
            </div>
        ) 

    }


    const renderFailureView = ()=>{
        return (
            <div className='failure-view'>
                <div>
                    <img src = {failure} alt = "image" className = "failure-image"/>
                </div>
                <h1>Faliure</h1>
                <p>Something Went Wrong</p>
                <p>Please try again Later</p>
            </div>
        )
    }

    const renderLoadingView = ()=>{
        return (
            <div className="loading-view">
                <TailSpin color = "#4F46E5"/>
                <p>Setting Up Question</p>
            </div>
        )
    }

    switch(currentView){
        case "Success":
            return renderSuccessView()
        case "Failure":
            return renderFailureView()
        case "Loading":
            return renderLoadingView()
        default: 
            return null            
    }

    
}

export default RecordComponent