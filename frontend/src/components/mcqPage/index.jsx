import { useEffect, useState } from "react"
import correct from '../../assets/tick.png'
import wrong from '../../assets/wrong.png'
import './index.css'
import { TailSpin } from "react-loader-spinner";
import failure from '../../assets/failure.png'
import Cookies from "js-cookie"
import {useLocation, useNavigate, useParams} from "react-router-dom";

const views = {
    success: "Success",
    failure: "Failure",
    loading: "Loading"
}



const McqPage = ()=>{

    const navigate = useNavigate() 
    const params = useParams()
    const {id:mcqId} = params
    const [currentView, updateView] = useState(views.loading)
    const userData = Cookies.get("jwtToken")
    const {token} = JSON.parse(userData)    
    const [mcqData, updateMcq] = useState(null)
    const [questionCount, updateQuestionCount] = useState(0)
    const [choose, updateChoose] = useState(null)
    const [score, updateScore] = useState(0)
    const [timer, updateTimer] = useState(60 * 60)
    const [isFinished, updateIsFinished] = useState(false)
    const location = useLocation()       
    useEffect(()=>{
         const getMcq = async()=>{
            
            try{
                
                
                const options = {
                    method: "GET",
                    headers:{
                        "Content-Type": "application/json",
                        accept: "application/jon",
                        authorization: `Bearer ${token}`
                    }
                }
                const response = await fetch(`http://localhost:3000/interview/questions/mcq/${mcqId}`, options)
                if (response.ok){
                    const data = await response.json()
                    console.log(data)
                    updateMcq(data.data[0])
                    updateView(views.success)
                }
            }catch(error){
                console.log(error)
                updateView(views.failure)

            }
        }
        getMcq()
        

        
    }, [])

    
    useEffect(()=>{
        if(timer <= 0){
            updateIsFinished(true)
            return 
        }
        const timeId = setInterval(()=>{
            updateTimer(prevTime => prevTime - 1)
        }, 1000)

        return ()=>clearInterval(timeId)
    }, [timer])

    const renderSuccessView = ()=>{
        

        const changeAnswer = (e)=>{
            updateChoose(e.target.value)
        }


        const calculateScore = async()=>{
            if (choose === null){
                alert("choose an option")
                return
            }
            const currentQuestion = mcqData.questions[questionCount]
            const isCorrect = currentQuestion.correctAnswer === choose
            const newScore = isCorrect
            ? score + 1
            : score - 1
            updateScore(newScore)
            updateChoose(null)
            try{
                const options = {
                    method: "PUT",
                    headers:{
                        "Content-Type": "application/json",
                        accept: "application/json",
                        authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({userAnswer:choose, roundId: mcqId - 1})
                }
                const response = await fetch(`http://localhost:3000/interview/user/mcq/${mcqData.questions[questionCount].questionId}`, options)
                if(response.ok){
                    const nextQuestion = questionCount + 1

                    if (nextQuestion >= mcqData.questions.length) {
                        updateIsFinished(true)
                        return
                    }
                    updateQuestionCount(nextQuestion)       
                }
            
            }catch(error){
                console.log(error)
            }

            
            
            
            
        }

        const nextMcq = async()=>{
            try{
                    const {token} = JSON.parse(userData)
                    const {mcqId} = location.state
                    const options = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                        authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({isCompleted:true, score: score, roundId: mcqData.roundId})
                    
                }
                const response = await fetch(`http://localhost:3000/interview/questions/update/mcq/${mcqId}`, options)
                if (response.ok){
                    const data = await response.json()
                    console.log(data)
                    navigate("/interview", {replace:true})
                }
            }catch(error){
                console.log(error)
                updateView(views.failure)
            }
        }

        const minutes = String(Math.floor(timer / 60)).padStart(2, "0")
        const seconds = String((timer % 60)).padStart(2, "0")

        
        

        {return !isFinished ? (
            <div className="success-container">
                
                <div>
                    <h2>Round 1</h2>
                    <h2>{minutes}: {seconds}</h2>
                    <p>{questionCount}/5</p>
                </div>
                <hr/>
                {!isFinished && <div>
                    
                
                    <div className="mcq-container">
                        <p>{mcqData.questions[questionCount].question}</p>
                        <hr/>
                        
                        <div className = "questions-options-container">
                            {mcqData.questions[questionCount].options.map((each, index)=>(
                                <div key = {each.questionId}>
                                    <input type = "radio" name = "mcq" value = {each} checked = {each === choose} onChange = {changeAnswer} id={`option-${index}`}/>
                                    <label htmlFor= {`option-${index}`}>{each}</label>
                                </div>   
                            ))}
                        </div>
                    </div>
                    <div className = "question-button-container">
                        <button type = "button" onClick = {calculateScore} disabled = {choose === null}>Submit</button>
                    </div>
                </div>}
            </div>
        ):(
          <div className = "time-out-container">
            <div className="finish-container">
                <div className="mark-image-container">
                    <img src = {score >= 3 ? `${correct}`: `${wrong}`} alt = {score >= 3 ? "pass": "fail"} className="mark-image"/>
                </div>
                <h1>Round 1</h1>
                <p>score: {score}</p>
                <p>Grade: {score === mcqData.questions.length ? "Excellent": score >= (mcqData.questions.length - 2) ? "Good": "Poor"}</p>
                <p>Result: {score >= 3 ? "PASS": "FAIL"}</p>
                <button onClick = {nextMcq}>Next</button>
            </div>
          </div>
        )}
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
                <TailSpin color="#4F46E5"/>
                <p>This may take few minutes</p>
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

export default McqPage