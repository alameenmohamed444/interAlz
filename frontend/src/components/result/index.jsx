import {useState, useEffect} from 'react'
import Navbar from "../navbar"
import Cookies from 'js-cookie'
import { TailSpin } from "react-loader-spinner";
import failure from '../../assets/failure.png'
import './index.css'
import {useNavigate} from 'react-router-dom'
const views = {
    success: "Success",
    failure: "Failure",
    loading: "Loading"
}

const Result = ()=>{
    const [currentView, updateCurrentView] = useState(views.loading)
    const [resultData, updateResultData] = useState(null)
    const [marks, updatemarks] = useState(null)
    const cookiesData = Cookies.get("jwtToken")
    const {token, username} = JSON.parse(cookiesData)
    const navigate = useNavigate()



    useEffect(()=>{
        const getAnswer = async ()=>{
            try{
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                        authorization: `Bearer ${token}`
                        
                    },
                    body: JSON.stringify({username: username})

                    

                }

                const response = await fetch("http://localhost:3000/interview/results", options)
                if(response.ok && response.status == 200){
                    const data = await response.json()
                    updateResultData(JSON.parse(data.data))
                    updatemarks({mcqRounds: data.mcqRounds, codingQuestions: data.codingQuestions, name:data.name})
                    console.log(JSON.parse(data.data))
                    updateCurrentView(views.success)
                }else{
                    updateCurrentView(views.failure)
                }

            }catch(error){
                updateCurrentView(views.failure)
                console.log(error)
            }
        }

        getAnswer()
    }, [])


    const renderSuccessView = ()=>{
        const {improvementAreas, learningRoadmap, summary} = resultData
        const {overallObservations, strengths} = summary
        const {mcqRounds, codingQuestions, name} = marks



        const deletePreviousRecords = async()=>{
            try{
                const options = {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': "application/json",
                        accept: 'application/json',
                        authorization: `Bearer ${token}`
                    }
                }

                const response = await fetch("http://localhost:3000/interview/delete", options)
                if(response.ok){
                    const data = await response.json()
                    console.log(data)
                    navigate("/uploadResume", {replace:true})
                 }
            }catch(error){
                console.log(error)
            }
        }



        return (
            <div>
            <Navbar selectedBar= "Result"/>
            <div className = "overall-result-section">


                <div className='candidate'>
                    <p>Candidate Name: {name}</p>
                    <p>Here is Your Interview Result</p>
                </div>

                <div className='mcq-section'> 
                    <ul>
                      <h1>MCQ Result</h1>
                      {mcqRounds.map(each=> <li>
                        <p>MCQ: {each.roundId}</p>
                        <p>Score: {each.score}</p>
                      </li>)}
                    </ul>
                </div>
                

                <div className='coding-section'>
                    <h1>Coding Results</h1>
                  <ul>
                    {
                        codingQuestions.map(each=><li>
                            <p>Coding: {each.questionId}</p>
                            <p>Score: {each.score}</p>
                        </li>)
                    }
                  </ul>
                </div>

                <div className='summary'>
                    <h1>Summary Of Your Performance</h1>
                    <ul>
                    {overallObservations.map((each, index)=>{
                        return (<li key = {`observation${index}`}>{each}</li>)
                    })} 
                    </ul>
                </div>

                <div className='strength'>
                    <h1>Your Strength</h1>
                    <ul>
                        {strengths.map((each, index)=>{
                            return (
                                <li key = {`strength${index}`}>
                                    <p><span>Area: </span>{each.area}</p>
                                    <p><span>Evidence: </span>{each.evidence}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className='improvement'>
                    <h1>Improvement Suggession</h1>
                    <ul>
                        {improvementAreas.map((each, index)=>{
                            return (
                                <li>
                                    <p>Areas: {each.area}</p>
                                    {each.evidence.map((evi)=>{
                                        return (
                                            <p>Evidence: {evi}</p>
                                        )
                                    })}
                                    <p>Prority: {each.priority}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                
                <div className='recommended'>
                    <h1>Recommended Practice</h1>
                    <ul>
                      <li>
                        {improvementAreas.map(each=>each.recommendedPractice.map((p, index)=>{
                            return (
                                <p key = {`practice${index}`}>{p}</p>
                            )
                        }))}    
                      </li>
                    </ul>
                </div>

                <div className='to-improve'>
                    <h1>To Improve</h1>
                    <ul>
                        {improvementAreas.map(each=>each.whatToImprove.map((p, index)=>{
                            return (
                                <p key = {`practice${index}`}>{p}</p>
                            )
                        }))} 
                    </ul>
                </div>
                

                <div className='learning'>
                    <h1>Learning RoadMap</h1>
                    <ul>
                        {
                            learningRoadmap.map((each, index)=>{
                                return (
                                    <li>
                                        <p>Area: {each.area}</p>
                                        <h2>Concepts</h2>
                                        {each.concepts.map((c, index)=>{
                                            return (
                                                <p key = {`c${index}`}>{c}</p>
                                            )
                                        })}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                
                <div className='practice'>
                    <h1>Practice</h1>
                    <ul>
                        {learningRoadmap.map(each=>each.practiceRecommendation.map((o, index)=>{
                            return (
                                <li>
                                    <p key = {`p${index}`}>{o}</p>
                                    <p>Reson: {each.reason}</p>
                                </li>
                            )
                        }))}
                    </ul>
                </div>
                
                <div className = "finish-btn-container">
                    <button className = "finish-btn" onClick = {deletePreviousRecords}>Finish</button>
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
                <TailSpin color="#4F46E5"/>
                <p>Generating Result</p>
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
    }
    
}

export default Result