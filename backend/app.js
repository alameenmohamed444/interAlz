const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

const initializeDatabase = require("./database/databaseIntialise")

const authRoutes = require("./routes/authRoutes")
const routes = require("./routes/interviewRoute")

const multer = require('multer')
const app = express()




const initializeServer = async ()=>{
    try{
        await initializeDatabase()
        app.listen(process.env.PORT, ()=>{
            console.log(`Server listening at the port ${process.env.PORT}`)
        })
    }catch(error){
        process.exit(1)
    }
}
initializeServer()



app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

})) 


app.use("/api/auth", authRoutes)


app.use("/resume", routes)

app.use("/interview", routes)


app.use((err, req, res, next)=>{
    if (err instanceof multer.MulterError){
        res.status(500).json({message: `Error From multer: ${err.message}`})
    }

    if (err.code === 11000){
        res.status(500).json({message: "User already exists"})
    }else{
        res.status(500).json({message: `Error From Server: ${err.message}`})
    }

    next()
})

