import express from 'express'
import { RestaurantController } from '../controllers/restaurant.controller';

const restaurantRouter = express.Router()

restaurantRouter.route("/getAllRestaurants").get(
    (req, res)=>new RestaurantController().getAllRestaurants(req, res)
)

restaurantRouter.route("/reservation").post(
    (req, res)=>new RestaurantController().reservation(req, res)
)

restaurantRouter.route("/getAllReservations").get(
    (req, res)=>new RestaurantController().getAllReservations(req, res)
)

restaurantRouter.route("/getAllReservationsGuest").post(
    (req, res)=>new RestaurantController().getAllReservationsGuest(req, res)
)

restaurantRouter.route("/cancelReservation").post(
    (req, res)=>new RestaurantController().cancelReservation(req, res)
)

restaurantRouter.route("/rate").post(
    (req, res)=>new RestaurantController().rate(req, res)
)

restaurantRouter.route("/order").post(
    (req, res)=>new RestaurantController().order(req, res)
)

restaurantRouter.route("/getAllOrdersGuest").post(
    (req, res)=>new RestaurantController().getAllOrdersGuest(req, res)
)

restaurantRouter.route("/getAllOrdersWaiter").get(
    (req, res)=>new RestaurantController().getAllOrdersWaiter(req, res)
)

restaurantRouter.route("/orderUpdate").post(
    (req, res)=>new RestaurantController().orderUpdate(req, res)
)

restaurantRouter.route("/saveRestaurant").post(
    (req, res)=>new RestaurantController().saveRestaurant(req, res)
)

restaurantRouter.route("/getWaitersRestaurant").post(
    (req, res)=>new RestaurantController().getWaitersRestaurant(req, res)
)

restaurantRouter.route("/getWaitingReservationsForRestaurant").post(
    (req, res)=>new RestaurantController().getWaitingReservationsForRestaurant(req, res)
)

restaurantRouter.route("/acceptReservation").post(
    (req, res)=>new RestaurantController().acceptReservation(req, res)
)

restaurantRouter.route("/rejectReservation").post(
    (req, res)=>new RestaurantController().rejectReservation(req, res)
)

restaurantRouter.route("/getAcceptedRejectedReservationsForRestaurant").post(
    (req, res)=>new RestaurantController().getAcceptedRejectedReservationsForRestaurant(req, res)
)

restaurantRouter.route("/guestAppeared").post(
    (req, res)=>new RestaurantController().guestAppeared(req, res)
)

restaurantRouter.route("/getAllAcceptedReservations").get(
    (req, res)=>new RestaurantController().getAllAcceptedReservations(req, res)
)

restaurantRouter.route("/addOneHour").post(
    (req, res)=>new RestaurantController().addOneHour(req, res)
)

restaurantRouter.route("/addDish").post(
    (req, res)=>new RestaurantController().addDish(req, res)
)

restaurantRouter.route("/addWaiterToRestaurant").post(
    (req, res)=>new RestaurantController().addWaiterToRestaurant(req, res)
)

export default restaurantRouter;