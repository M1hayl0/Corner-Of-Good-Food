import express from 'express'
import RestaurantModel from '../models/restaurant'
import ReservationModel from '../models/reservation'
import OrderModel from '../models/order'
import restaurant from '../models/restaurant'

export class RestaurantController {
    getAllRestaurants = (req: express.Request, res: express.Response)=>{
        RestaurantModel.find()
            .then(restaurants=>{res.json(restaurants)})
            .catch(err=>{console.log(err)})
    }

    reservation = (req: express.Request, res: express.Response)=>{
        new ReservationModel({
            restaurantName: req.body.reservation.restaurantName,
            restaurantAddress: req.body.reservation.restaurantAddress,
            table: req.body.reservation.table,
            date: req.body.reservation.date,
            seats: req.body.reservation.seats,
            description: req.body.reservation.description,
            guest: req.body.reservation.guest,
            waiter: req.body.reservation.waiter,
            status: req.body.reservation.status,
            hours: req.body.reservation.hours
        }).save()
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    getAllReservations = (req: express.Request, res: express.Response)=>{
        ReservationModel.find()
            .then(reservations=>{res.json(reservations)})
            .catch(err=>{console.log(err)})
    }

    getAllReservationsGuest = (req: express.Request, res: express.Response)=>{
        ReservationModel.find({guest: req.body.guest})
            .then(reservations=>{res.json(reservations)})
            .catch(err=>{console.log(err)})
    }

    cancelReservation = (req: express.Request, res: express.Response)=>{
        ReservationModel.deleteOne({
                restaurantName: req.body.reservation.restaurantName,
                restaurantAddress: req.body.reservation.restaurantAddress,
                table: req.body.reservation.table,
                date: req.body.reservation.date
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    rate = (req: express.Request, res: express.Response)=>{
        ReservationModel.updateOne({
                restaurantName: req.body.reservation.restaurantName,
                restaurantAddress: req.body.reservation.restaurantAddress,
                table: req.body.reservation.table,
                date: req.body.reservation.date
            }, {
                comment: req.body.reservation.comment,
                rating: req.body.reservation.rating
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    order = (req: express.Request, res: express.Response)=>{
        new OrderModel({
            guest: req.body.order.guest,
            restaurantName: req.body.order.restaurantName,
            restaurantAddress: req.body.order.restaurantAddress,
            cart: req.body.order.cart,
            totalPrice: req.body.order.totalPrice,
            status: req.body.order.status,
            date: req.body.order.date
        }).save()
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    getAllOrdersGuest = (req: express.Request, res: express.Response)=>{
        OrderModel.find({guest: req.body.guest})
            .then(orders=>{res.json(orders)})
            .catch(err=>{console.log(err)})
    }

    getAllOrdersWaiter = (req: express.Request, res: express.Response)=>{
        OrderModel.find({status: "waiting"})
            .then(orders=>{res.json(orders)})
            .catch(err=>{console.log(err)})
    }

    orderUpdate = (req: express.Request, res: express.Response)=>{
        OrderModel.updateOne({
                guest: req.body.order.guest,
                restaurantName: req.body.order.restaurantName,
                restaurantAddress: req.body.order.restaurantAddress,
                date: req.body.order.date
            }, {
                status: req.body.order.status,
                estimatedTime: req.body.order.estimatedTime,
                dateAcceptReject: req.body.order.dateAcceptReject
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    saveRestaurant = (req: express.Request, res: express.Response)=>{
        let restaurant = {
            name: req.body.restaurant.name,
            address: req.body.restaurant.address,
            type: req.body.restaurant.type,
            waiters: req.body.restaurant.waiters,
            phone: req.body.restaurant.phone,
            map: req.body.restaurant.map,
            canvas: req.body.restaurant.canvas,
            workingTime: req.body.restaurant.workingTime,
            menu: req.body.restaurant.menu,
            description: req.body.restaurant.description
        }

        new RestaurantModel(restaurant).save()
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    getWaitersRestaurant = (req: express.Request, res: express.Response)=>{
        RestaurantModel.findOne({ waiters: { $in: [req.body.waiter] } })
            .then(restaurants=>{res.json(restaurants)})
            .catch(err=>{console.log(err)})
    }

    getWaitingReservationsForRestaurant = (req: express.Request, res: express.Response)=>{
        ReservationModel.find({ status: "waiting", restaurantName: req.body.restaurant.name,  restaurantAddress: req.body.restaurant.address})
            .then(reservations=>{res.json(reservations)})
            .catch(err=>{console.log(err)})
    }

    acceptReservation = (req: express.Request, res: express.Response)=>{
        ReservationModel.updateOne({
                restaurantName: req.body.reservation.restaurantName,
                restaurantAddress: req.body.reservation.restaurantAddress,
                date: req.body.reservation.date
            }, {
                waiter: req.body.reservation.waiter,
                status: req.body.reservation.status,
                table: req.body.reservation.table
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    rejectReservation = (req: express.Request, res: express.Response)=>{
        ReservationModel.updateOne({
                restaurantName: req.body.reservation.restaurantName,
                restaurantAddress: req.body.reservation.restaurantAddress,
                table: req.body.reservation.table,
                date: req.body.reservation.date
            }, {
                waiter: req.body.reservation.waiter,
                status: req.body.reservation.status,
                reasonForRejection: req.body.reservation.reasonForRejection
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    getAcceptedRejectedReservationsForRestaurant = (req: express.Request, res: express.Response)=>{
        ReservationModel.find({ status: {$in: ["accepted", "rejected"]}, restaurantName: req.body.restaurant.name,  restaurantAddress: req.body.restaurant.address})
            .then(reservations=>{res.json(reservations)})
            .catch(err=>{console.log(err)})
    }

    guestAppeared = (req: express.Request, res: express.Response)=>{
        ReservationModel.updateOne({
                restaurantName: req.body.reservation.restaurantName,
                restaurantAddress: req.body.reservation.restaurantAddress,
                table: req.body.reservation.table,
                date: req.body.reservation.date
            }, {
                guestAppeared: req.body.reservation.guestAppeared
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    getAllAcceptedReservations = (req: express.Request, res: express.Response)=>{
        ReservationModel.find({ status: "accepted"})
            .then(reservations=>{res.json(reservations)})
            .catch(err=>{console.log(err)})
    }

    addOneHour = (req: express.Request, res: express.Response)=>{
        ReservationModel.updateOne({
                restaurantName: req.body.reservation.restaurantName,
                restaurantAddress: req.body.reservation.restaurantAddress,
                table: req.body.reservation.table,
                date: req.body.reservation.date
            }, {
                hours: req.body.reservation.hours
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    addDish = (req: express.Request, res: express.Response)=>{
        RestaurantModel.updateOne({
                name: req.body.restaurantName,
                address: req.body.restaurantAddress
            }, {
                $push: { menu: req.body.dish }
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    addWaiterToRestaurant = (req: express.Request, res: express.Response)=>{
        RestaurantModel.updateOne({
                name: req.body.restaurant.name,
                address: req.body.restaurant.address
            }, {
                waiters: req.body.restaurant.waiters 
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }
}