const uploads = require("../middlewere/file_middlewere")
const verifyCredentials = require("../middlewere/authmiddlewere")
const express = require("express")
const routes = express.Router()

const uploadResume = require("../controllers/resumeController")
const interviewQuestions = require("../controllers/interviewController")
const {mcqQuestions,  getCodingQuestion, updateMcq, updateCoding,} = require("../controllers/questionsController")
const runCode = require("../controllers/runCode")
const audioUpload = require("../middlewere/audio_middlewere")
const {getAudioQuestion, storeAnswer} = require("../controllers/audioController")
const getResultAnswer = require("../controllers/resultController")
const updateUserMcqAnswer = require("../controllers/updateUserAnswer")
const clearRecords = require("../controllers/deleteController")



routes.post("/uploads", verifyCredentials, uploads.single("fileData"), uploadResume)
routes.post("/questions", verifyCredentials, interviewQuestions)
routes.post("/audio/text", audioUpload.single("audio"), verifyCredentials, storeAnswer)
routes.post("/runcode", verifyCredentials, runCode)
routes.post("/results", verifyCredentials, getResultAnswer)

routes.get("/questions/mcq/:id", verifyCredentials, mcqQuestions)
routes.get("/questions/coding/:id", verifyCredentials, getCodingQuestion)
routes.get("/audio/challenge", verifyCredentials, getAudioQuestion)

routes.put("/questions/update/mcq/:id", verifyCredentials, updateMcq)
routes.put("/questions/update/coding/:id", verifyCredentials, updateCoding)
routes.put("/user/mcq/:id", verifyCredentials, updateUserMcqAnswer)

routes.delete("/delete", verifyCredentials, clearRecords)

module.exports = routes