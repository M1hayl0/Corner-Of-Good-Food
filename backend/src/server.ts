import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/user.router'
import multer from "multer"
import restaurantRouter from './routers/restaurant.router'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("images/profileImages"))
app.use(express.static("images/menuImages"))

mongoose.connect('mongodb://127.0.0.1:27017/CornerOfGoodFoodDB')
mongoose.connection.once('open', ()=>{
    console.log("DB works")
})

const router = express.Router()
router.use("/user", userRouter)
router.use("/restaurant", restaurantRouter)

app.use("/", router)


const storageImage = multer.diskStorage({
    destination: function(req: any, file: any, cb: any) {
        cb(null, "images/profileImages")
    },
    filename: function(req: any, file: any, cb: any) {
        cb(null, "profile_image_" + file.originalname)
    },
})
const uploadImage = multer({ storage: storageImage })
app.post("/user/profileImage", uploadImage.single("file"), (req, res) => {});


const storageDish = multer.diskStorage({
    destination: function(req: any, file: any, cb: any) {
        cb(null, "images/menuImages")
    },
    filename: function(req: any, file: any, cb: any) {
        cb(null, "menu_image_" + file.originalname)
    },
})
const uploadDish = multer({ storage: storageDish })
app.post("/restaurant/dishImage", uploadDish.single("file"), (req, res) => {});


app.listen(4000, () => console.log(`Express server running on port 4000`))
