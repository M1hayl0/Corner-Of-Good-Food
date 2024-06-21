import { Dish } from "./dish"

export class Order {
    guest: string = ""
    restaurantName: string = ""
    restaurantAddress: string = ""
    cart: Dish[] = []
    totalPrice: number = 0
    status: string = "" //can be waiting, accepted, rejected
    estimatedTime: string = ""
    date: Date = new Date()
    dateAcceptReject: Date = new Date()
}
  