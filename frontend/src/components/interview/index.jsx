import { useEffect, useState } from 'react';
import Navbar from '../navbar/index.jsx'
import { TailSpin } from "react-loader-spinner";
import { useLocation } from 'react-router-dom';
import  Cookies from 'js-cookie'
import './index.css'
import failure from '../../assets/failure.png'
import { useNavigate } from 'react-router-dom';

const views = {
    success: "Success",
    failure: "Failure",
    loading: "Loading"
}

const Interview = ()=>{

    const navigate = useNavigate()
    const [currentView, updateCurrentView] = useState(views.loading)
    const [aiData, updateAiData] = useState(null)
    const tokenData = Cookies.get("jwtToken")
    const {token, username} = JSON.parse(tokenData)
    const location = useLocation()

    useEffect(()=>{
        const getInterviewQuestions = async()=>{
            try{
                const {data = {}} = location.state || {}
                const {Languages = [], FrameworksAndLibraries = [], DatabasesAndCloud = [], ToolsAndAI = []} = data
                console.log(data)
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                        accept: "application/json",
                        authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({Languages, FrameworksAndLibraries, DatabasesAndCloud, ToolsAndAI, username})
                }
                
                const response = await fetch("http://localhost:3000/interview/questions", options)
                console.log(response)
                if (response.ok){
                    const responseData = await response.json()
                    const formatedData = responseData.data
                    console.log(formatedData)
                    updateCurrentView(views.success)
                    updateAiData(formatedData)
                }else{
                    updateCurrentView(views.failure)
                }
            }catch(error){
                updateCurrentView(views.failure)
            }
            }
        getInterviewQuestions()
    }, [location.state])


    useEffect(()=>{
        if (!aiData) return
        const {mcqRounds = [], codingQuestions = []} = aiData
        const isEveryMcqCompleted = mcqRounds.every(item=>item.isCompleted === true || item.isCompleted === "true")
        const isEveryCodingQuestionCompleted = codingQuestions.every(item=>item.isCompleted === true || item.isCompleted === "true")
        const hasQuestions = mcqRounds.length > 0 && codingQuestions.length > 0
        const isInterviewComplted = isEveryCodingQuestionCompleted && isEveryMcqCompleted && hasQuestions
        if(isInterviewComplted){
            
            navigate("/audio/interview")
        } 
    }, [aiData])

    const successRender = ()=>{
        const {mcqRounds, codingQuestions} = aiData


        



        return (
            <div>
                <Navbar selectedBar = "Interview"/>
                <div className='interview-question-container'>
                    <div className='interview-text'>
                        <h1>Here are the questions</h1>
                        <p>be Bold and ace the questions</p>
                    </div>
                    <ul className = "question-container">
                        {

                            mcqRounds.map(eachmcq=>{
                                const isCompleted = eachmcq.isCompleted === true || eachmcq.isCompleted === "true";
                                return (
                                <li key = {eachmcq.roundId} className='question-items'>
                                    <p>{eachmcq.title}</p>
                                    <p>MCQ</p>
                                    <button  className='go-button' disabled = {isCompleted} onClick = {()=>{
                                        navigate(`/mcq/${eachmcq.roundId}`)
                                    }}>
                                        <i className="fa-solid fa-play icon-go-style"></i>
                                    </button>
                                </li>)
                                }

                            )
                        }


                        {
                            codingQuestions.map(eachQues=>{
                                const isCompleted = eachQues.isCompleted === true || eachQues.isCompleted === "true";
                                return (
                                <li key = {eachQues.questionId} className='question-items'>
                                    <p>{eachQues.title}</p>
                                    <div className = "calculate-score-bar">
                                        <div></div>
                                    </div>
                                    <button className='go-button' disabled = {isCompleted} onClick = {()=>{
                                        navigate(`/coding/${eachQues.questionId}`)
                                    }}>
                                        <i className="fa-solid fa-play icon-go-style"></i>
                                    </button>
                                </li>)
                                }
                            )
                        }

                    </ul>
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

    const renderLoader = ()=>{
        return (
            <div className='loading-view'>
                <TailSpin color='#4F46E5'/>
                <p>This may takes few minutes</p>
            </div>
        )
    }




    switch(currentView){
        case "Success":
            return successRender()
        case "Failure":
            return renderFailureView()   
        case "Loading":
            return renderLoader()    
    }
}

export default Interview