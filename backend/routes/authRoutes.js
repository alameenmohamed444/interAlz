const express = require("express")
const {signin,login, localSignin, localLogin} = require("../controllers/authController") 


const routes = express.Router()
routes.post("/google/login", login)
routes.post("/google/signin", signin)
routes.post("/local/signin", localSignin)
routes.post("/local/login", localLogin)

module.exports = routes