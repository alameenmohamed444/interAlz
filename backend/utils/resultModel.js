const {GoogleGenAI} = require('@google/genai')

const generateResult = async (prompt)=>{
    const model = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
    try{
        
        
        const response = await model.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents : prompt,
        })
        
        if(response){
            const generatedtext = response.text
            
            return generatedtext
        }else{
            return Error("something Went Wrong")
        }
        
    }catch(error){
        console.log(error)
    }
}

module.exports = generateResult