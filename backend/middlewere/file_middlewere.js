const multer = require("multer")
const {v4: uuidv4} = require("uuid")
const path = require("path")

const pathName = path.join(__dirname, "../uploads")

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, pathName)
    },
    filename: (req, file, cb)=>{
        const name = path.extname(file.originalname)
        const newName = `${uuidv4()}${name}`
        cb(null, newName)


    }
})

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: (req, file, cb)=>{
        if (file.mimetype === "application/pdf" || file.mimetype === "application/octet-stream"){
            cb(null, true)
        }else{
            cb(new Error("File Type is Not Matched Only PDF is ALlowed "), false)

        }
    }
})

module.exports = uploads