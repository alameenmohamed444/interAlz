import { useRef, useState } from 'react';
import Navbar from '../navbar/index.jsx'
import './index.css'
import Cookies from "js-cookie"
import{useNavigate} from 'react-router-dom'
import { TailSpin } from "react-loader-spinner";



const UploadResume = ()=>{
    const navigate = useNavigate()
    const [pdfUrl, changepdf] = useState(null)
    const formData = useRef(new FormData())
    const tokenData = Cookies.get("jwtToken")
    const [isLoading, updateIsLoading] = useState(false)
    const {token, username, userId} = JSON.parse(tokenData)


    const changeField = async (e)=>{
        const singleForm = e.target.files[0]
        const imageUrl = URL.createObjectURL(singleForm)
        
        changepdf(imageUrl)
        if (singleForm.type === "application/pdf" || singleForm.type === "application/octet-stream"){
            formData.current.set("fileData", singleForm)
            formData.current.set("name", username)
            formData.current.set("userId", userId)

        }else{
            alert("only PDF FORMAT is allowed")
        }

    }

    const uploadResume = async()=>{
        
        if (!formData.current.has("fileData")){
            alert("Upload File")
            return 
        }

        updateIsLoading(true)


        try{
            const options = {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`
            },
            body: formData.current
            }


            const response = await fetch("http://localhost:3000/resume/uploads", options)
            if (response.ok){
                const data = await response.json()
                navigate("/skills-extracted", {state: {text:data.file, name: data.name}})

            }
            }catch(error){
                updateIsLoading(false)
                console.log(error)
            }finally{
                updateIsLoading(false)
            }
            

    }


    return (
        <div>
            <Navbar selectedBar = 'Upload'/>
            {isLoading? <div className = "loader">
                <TailSpin color= "#4F46E5"/>
                <p>This may take few minutes</p>
            
            </div>:
            <div className = "upload-container">
               <div className="upload-box">
                  <div className = "text-container">
                    <h1>Upload Your Resume</h1>
                    <p>We'll use this to tailor your interview questions.</p>
                  </div>
                  <div className="upload-file">
                     <input type = 'file' single accept=".pdf" id = "fileInput" className="file-input" onChange={changeField}/>
                     <label htmlFor = "fileInput" className="upload-label">
                        <i className="fa-solid fa-file-arrow-up" id = "uploadIcon"></i>
                        Browse Your File
                     </label>
                     <p>PDF only max 5MB</p>
                  </div>
                  {pdfUrl && 
                  
                    <div className="image-selected-container">
                        <div className= "image-content-container">
                            <iframe src = {pdfUrl} className = "image-show"></iframe>
                            <p className="cancel-show">X</p>
                        </div>
                    </div>
                  
                  }
                </div> 
                <div className='upload-btn-container'>
                    <button onClick = {uploadResume}>Upload</button>
                </div>
            </div>
            }
        </div>
    )


};
 
export default UploadResume;