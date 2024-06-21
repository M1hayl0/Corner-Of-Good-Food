import express from 'express'
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router()

userRouter.route("/login").post(
    (req, res)=>new UserController().login(req, res)
)

userRouter.route("/getUser").post(
    (req, res)=>new UserController().getUser(req, res)
)

userRouter.route("/getUserEmail").post(
    (req, res)=>new UserController().getUserEmail(req, res)
)

userRouter.route("/registerUser").post(
    (req, res)=>new UserController().registerUser(req, res)
)

userRouter.route("/changePassword").post(
    (req, res)=>new UserController().changePassword(req, res)
)

userRouter.route("/changeProfile").post(
    (req, res)=>new UserController().changeProfile(req, res)
)

userRouter.route("/getTotalGuests").get(
    (req, res)=>new UserController().getTotalGuests(req, res)
)

userRouter.route("/getAllWaiters").get(
    (req, res)=>new UserController().getAllWaiters(req, res)
)

userRouter.route("/getAllGuests").get(
    (req, res)=>new UserController().getAllGuests(req, res)
)

userRouter.route("/changeStatus").post(
    (req, res)=>new UserController().changeStatus(req, res)
)

userRouter.route("/changeUser").post(
    (req, res)=>new UserController().changeUser(req, res)
)

userRouter.route("/increaseDidntAppearTimes").post(
    (req, res)=>new UserController().increaseDidntAppearTimes(req, res)
)

userRouter.route("/registerWaiter").post(
    (req, res)=>new UserController().registerWaiter(req, res)
)

userRouter.route("/addRestaurantToWaiter").post(
    (req, res)=>new UserController().addRestaurantToWaiter(req, res)
)

export default userRouter;