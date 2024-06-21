import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dish } from 'src/app/models/dish';
import { Order } from 'src/app/models/order';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private http: HttpClient) { }

  getAllRestaurants(){
    return this.http.get<Restaurant[]>("http://localhost:4000/restaurant/getAllRestaurants")
  }

  reservation(reservation: Reservation){
    return this.http.post<number>("http://localhost:4000/restaurant/reservation", {reservation: reservation})
  }

  getAllReservations(){
    return this.http.get<Reservation[]>("http://localhost:4000/restaurant/getAllReservations")
  }

  getAllReservationsGuest(guest: string){
    return this.http.post<Reservation[]>("http://localhost:4000/restaurant/getAllReservationsGuest", {guest: guest})
  }

  cancelReservation(reservation: Reservation) {
    return this.http.post<number>("http://localhost:4000/restaurant/cancelReservation", {reservation: reservation})
  }

  rate(reservation: Reservation) {
    return this.http.post<number>("http://localhost:4000/restaurant/rate", {reservation: reservation})
  }

  order(order: Order) {
    return this.http.post<number>("http://localhost:4000/restaurant/order", {order: order})
  }

  getAllOrdersGuest(guest: string){
    return this.http.post<Order[]>("http://localhost:4000/restaurant/getAllOrdersGuest", {guest: guest})
  }

  getAllOrdersWaiter(){
    return this.http.get<Order[]>("http://localhost:4000/restaurant/getAllOrdersWaiter")
  }

  orderUpdate(order: Order){
    return this.http.post<number>("http://localhost:4000/restaurant/orderUpdate", {order: order})
  }

  saveRestaurant(restaurant: Restaurant){
    return this.http.post<number>("http://localhost:4000/restaurant/saveRestaurant", {restaurant: restaurant})
  }

  getWaitersRestaurant(waiter: string){
    return this.http.post<Restaurant>("http://localhost:4000/restaurant/getWaitersRestaurant", {waiter: waiter})
  }

  getWaitingReservationsForRestaurant(restaurant: Restaurant){
    return this.http.post<Reservation[]>("http://localhost:4000/restaurant/getWaitingReservationsForRestaurant", {restaurant: restaurant})
  }

  acceptReservation(reservation: Reservation){
    return this.http.post<number>("http://localhost:4000/restaurant/acceptReservation", {reservation: reservation})
  }

  rejectReservation(reservation: Reservation){
    return this.http.post<number>("http://localhost:4000/restaurant/rejectReservation", {reservation: reservation})
  }

  getAcceptedRejectedReservationsForRestaurant(restaurant: Restaurant){
    return this.http.post<Reservation[]>("http://localhost:4000/restaurant/getAcceptedRejectedReservationsForRestaurant", {restaurant: restaurant})
  }

  guestAppeared(reservation: Reservation){
    return this.http.post<number>("http://localhost:4000/restaurant/guestAppeared", {reservation: reservation})
  }

  getAllAcceptedReservations(){
    return this.http.get<Reservation[]>("http://localhost:4000/restaurant/getAllAcceptedReservations")
  }

  addOneHour(reservation: Reservation){
    return this.http.post<number>("http://localhost:4000/restaurant/addOneHour", {reservation: reservation})
  }

  addDish(restaurantName: string, restaurantAddress: string, dish: Dish){
    return this.http.post<number>("http://localhost:4000/restaurant/addDish", {restaurantName: restaurantName, restaurantAddress: restaurantAddress, dish: dish})
  }

  dishImage(dishImage: FormData){
    return this.http.post<any>("http://localhost:4000/restaurant/dishImage", dishImage)
  }

  addWaiterToRestaurant(restaurant: Restaurant){
    return this.http.post<number>("http://localhost:4000/restaurant/addWaiterToRestaurant", {restaurant: restaurant})
  }
}
