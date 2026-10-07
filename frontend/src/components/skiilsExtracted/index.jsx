import { useEffect, useState } from 'react'
import Navbar from '../navbar/index.jsx'
import { useLocation } from 'react-router-dom'
import './index.css'
import {useNavigate} from 'react-router-dom'
const views = {
    successView: "Success",
    faliureView: "Faliure",
}

const SkillsExtracted = ()=>{
    const [view, changeView] = useState(views.successView)
    const location = useLocation()
    const {text, name} = location.state
    useEffect(()=>{
        const updateView = ()=>{
            if(!text && !name){
                changeView(views.faliureView)
            }
        }
        updateView()
    }, [])


    const renderSuccessView = ()=>{
        const navigate = useNavigate()
        const {candidateName = "N/A", totalExperienceYears = 0, rolesAndExperience = [], predictedSuggestedRoles = [], skills= {}} = JSON.parse(text)      
        const {Languages = [], FrameworksAndLibraries = [], DatabasesAndCloud = [], ToolsAndAI = []} = skills
        
        
        const startInterview = ()=>{
            navigate("/interview", {state: {data: skills}})
        }
        
        return (
            <div>
                <Navbar selectedBar = 'Upload'/>
                <div className = "skills-container">
                    <h1 className='extracted-head'>Here is What we extracted</h1>
                    <div className = "name-exp">
                        <p>name: {candidateName}</p>
                        <p>Years of expierence: {totalExperienceYears}</p>
                    </div>
                    {rolesAndExperience.length > 0 &&
                    <div className='roles-exp'>
                     <h1 className='roles-exp-head'>Roles And Experience</h1>
                    <ul>
                        {rolesAndExperience.map(eachRole=>

                        <li>
                            <h1>{eachRole.roleTitle}</h1>
                            <p>{eachRole.company}</p>
                            <p>{eachRole.duration}</p>
                            <p>{eachRole.calculatedYears} Years</p>
                        </li>

                        )
                        }
                    </ul>
                    </div>
                    }
                    <div className='skills'>
                    {
                        Languages.length > 0 && 
                        <div className='details-container'>
                            <h1>Lanuages</h1>
                            <ul>
                            {Languages.map(each=> <li>{each}</li>)}
                            </ul>
                        </div>
                    }

                    {
                        FrameworksAndLibraries.length > 0 && 
                        <div className='details-container'>
                            <h1>FrameworksAndLibraries</h1>
                            <ul>
                            {
                                FrameworksAndLibraries.map(each=><li>{each}</li>)
                            }
                            </ul>
                        </div>
                    }

                    {
                        DatabasesAndCloud.length > 0 && 
                        <div className='details-container'>
                            <h1>Databases And Cloud</h1>
                            <ul>
                            {
                                DatabasesAndCloud.map(each=><li>{each}</li>)
                            }
                            </ul>
                        </div>
                    }

                    {
                        ToolsAndAI.length > 0 && 
                        <div className='details-container'>
                            <h1>Tools and Ai</h1>
                            <ul>
                            {
                                ToolsAndAI.map(each=> <li>{each}</li>)
                            }
                            </ul>
                        </div>
                    }
                    </div>
                    <div className='suitable-roles'>
                        <ul>
                        <h1>Suitable Roles</h1>
                        {
                            predictedSuggestedRoles.map(each=>
                                <li>
                                    <div>
                                        <p>Role: {each.suggestedRole}</p>
                                        <p>{each.catchyDescription}</p>
                                    </div>
                                    <div className='score-container'>
                                        <p className='score'>{each.matchScore} Match</p>
                                    </div>
                                </li>
                            )
                        }
                        </ul>
                    </div>
                    <div className='interview-btn-container'>
                      <button type = "button" className='btn-interview' onClick = {startInterview}>Go For Interview</button>
                    </div>
                </div>
            </div>
    )
    }


    switch(view){
        case "Success":
            return renderSuccessView()
        case "Faliure":
            return renderFailureView()
        default:
            return null    
                
    }


}


export default SkillsExtracted