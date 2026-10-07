const {GoogleGenAI} = require('@google/genai')

const generateAnswer = async (prompt, file)=>{
    try{
        const model = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
        const response = await model.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents : [
                {
                    text: prompt
                },
                {
                    inlineData:{
                        mimeType: file.mimetype,
                        data: file.buffer.toString("base64")
                    }
                }
            ]
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

module.exports = generateAnswer