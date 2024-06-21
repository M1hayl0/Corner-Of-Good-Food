import express from 'express'
import UserModel from '../models/user'
import * as CryptoJS from 'crypto-js'

export class UserController {
    login = (req: express.Request, res: express.Response)=>{
        const hash = CryptoJS.SHA256(req.body.password)
        let encryptedPassword = hash.toString(CryptoJS.enc.Hex)

        UserModel.findOne({username: req.body.username, password: encryptedPassword})
            .then(user=>{res.json(user)})
            .catch(err=>{console.log(err)})
    }

    getUser = (req: express.Request, res: express.Response)=>{
        UserModel.findOne({username: req.body.username})
            .then(user=>{res.json(user)})
            .catch(err=>{console.log(err)})
    }

    getUserEmail = (req: express.Request, res: express.Response)=>{
        UserModel.findOne({email: req.body.email})
            .then(user=>{res.json(user)})
            .catch(err=>{console.log(err)})
    }

    registerUser = (req: express.Request, res: express.Response)=>{
        const hash = CryptoJS.SHA256(req.body.user.password)
        let encryptedPassword = hash.toString(CryptoJS.enc.Hex)

        new UserModel({
            username: req.body.user.username,
            password: encryptedPassword,
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            type: req.body.user.type,
            
            securityQuestion: req.body.user.securityQuestion,
            securityAnswer: req.body.user.securityAnswer,
            gender: req.body.user.gender,
            address: req.body.user.address,
            phone: req.body.user.phone,
            email: req.body.user.email,
            profileImageName: req.body.user.profileImageName,
            creditCard: req.body.user.creditCard,
            status: req.body.user.status,
            didntAppearTimes: req.body.user.didntAppearTimes
        }).save()
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    changePassword = (req: express.Request, res: express.Response)=>{
        const hash = CryptoJS.SHA256(req.body.user.password)
        let encryptedPassword = hash.toString(CryptoJS.enc.Hex)

        UserModel.updateOne({username: req.body.user.username}, {password: encryptedPassword})
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    changeProfile = (req: express.Request, res: express.Response)=>{
        UserModel.updateOne({username: req.body.user.username}, 
            {
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                address: req.body.user.address,
                phone: req.body.user.phone,
                email: req.body.user.email,
                profileImageName: req.body.user.profileImageName,
                creditCard: req.body.user.creditCard
            }
        )
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    getTotalGuests = (req: express.Request, res: express.Response)=>{
        UserModel.find({type: "guest"})
            .then(guests=>{res.json(guests.length)})
            .catch(err=>{console.log(err)})
    }

    getAllWaiters = (req: express.Request, res: express.Response)=>{
        UserModel.find({type: "waiter"})
            .then(waiter=>{res.json(waiter)})
            .catch(err=>{console.log(err)})
    }

    getAllGuests = (req: express.Request, res: express.Response)=>{
        UserModel.find({type: "guest"})
            .then(waiter=>{res.json(waiter)})
            .catch(err=>{console.log(err)})
    }

    changeStatus = (req: express.Request, res: express.Response)=>{
        UserModel.updateOne({username: req.body.guest.username}, {status: req.body.guest.status})
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    changeUser = (req: express.Request, res: express.Response)=>{
        UserModel.updateOne({username: req.body.user.username}, 
            {
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                address: req.body.user.address,
                phone: req.body.user.phone,
                email: req.body.user.email
            }
        )
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    increaseDidntAppearTimes = (req: express.Request, res: express.Response)=>{
        UserModel.updateOne({username: req.body.guest}, { $inc: { didntAppearTimes: 1 } })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    registerWaiter = (req: express.Request, res: express.Response)=>{
        const hash = CryptoJS.SHA256(req.body.user.password)
        let encryptedPassword = hash.toString(CryptoJS.enc.Hex)

        new UserModel({
            username: req.body.user.username,
            password: encryptedPassword,
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            type: req.body.user.type,
            
            securityQuestion: req.body.user.securityQuestion,
            securityAnswer: req.body.user.securityAnswer,
            gender: req.body.user.gender,
            address: req.body.user.address,
            phone: req.body.user.phone,
            email: req.body.user.email,
            profileImageName: req.body.user.profileImageName,
            creditCard: req.body.user.creditCard,
            status: req.body.user.status,
            restaurantName: req.body.user.restaurantName,
            restaurantAddress: req.body.user.restaurantAddress
        }).save()
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }

    addRestaurantToWaiter = (req: express.Request, res: express.Response)=>{
        UserModel.updateOne({
                username: req.body.waiter.username
            }, {
                restaurantName: req.body.waiter.restaurantName,
                restaurantAddress: req.body.waiter.restaurantAddress
            })
            .then(ok=>{res.json(0)})
            .catch(err=>{
                res.json(1)
                console.log(err)
            })
    }
}