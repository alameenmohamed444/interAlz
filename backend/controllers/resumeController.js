const {updateResumebase} = require("../services/resumeData")
const path = require('path')
const {PDFParse} =  require("pdf-parse")
const {GoogleGenAI} = require('@google/genai')

const fs = require("fs")

const uploadResume = async (req, res, next)=>{
    const {name, userId} = req.body
    const {file} = req
    const llm = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
    try{

        const url = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        const resumeuploaded = await updateResumebase(name, url, userId)
        
        if (resumeuploaded){
            const resumeName = path.basename(url)
            const link = path.join(__dirname, "..", "uploads", resumeName)
            const buffer = await fs.promises.readFile(link)
            const parseUrl = new PDFParse({data: buffer})
            const textObject = await parseUrl.getText()
            const text = textObject.text.trim()
            const prompt =  `You are an expert ATS (Applicant Tracking System) parser and Tech Career Strategist. 

            Parse the provided resume ${text} and return ONLY a valid, raw JSON object (no Markdown backticks, no markdown formatting) matching the exact schema below.

            ### Extraction Rules:
            1. Skills: Group all technical skills into relevant categories (e.g., Languages, Frameworks, Databases & Cloud, Tools & AI).
            2. Experience: Calculate the total years of professional experience across all roles. Extract each role with its title, company, duration, and calculated tenure in years.
            3. Career Predictions & Suggestions: Based on the candidate's skills and trajectory (e.g., Node.js, React, Gemini API, Microservices, Team Leadership), suggest 3 relevant next-step job roles. Provide a concise, catchy description explaining why each role fits their profile.

            ### Expected JSON Output Structure:
            {
            "candidateName": "Candidate Name",
            "totalExperienceYears": 0,
            "rolesAndExperience": [
                {
                "roleTitle": "Job Title",
                "company": "Company Name",
                "duration": "Start Date - End Date",
                "calculatedYears": 0
                }
            ],
            "skills": {
                "Languages": [],
                "FrameworksAndLibraries": [],
                "DatabasesAndCloud": [],
                "ToolsAndAI": []
            },
            "predictedSuggestedRoles": [
                {
                "suggestedRole": "Role Title",
                "matchScore": "Percentage/High/Medium",
                "catchyDescription": "A punchy, 1-2 sentence description explaining why they are a strong fit based on their experience."
                }
            ]
            }`





            const response = await llm.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents : prompt
            })

            const generatedtext = response.text
            console.log(generatedtext)
            res.status(200).json({message: "Successfully Uploaded", name: name, file: generatedtext})
        }else{
            res.status(400).json({message:"Resume Upload Failed"})
        }

    }catch(error){
        next(error)
    }
}

module.exports = uploadResume