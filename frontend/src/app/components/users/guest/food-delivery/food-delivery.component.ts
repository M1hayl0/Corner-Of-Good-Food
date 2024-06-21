import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-food-delivery',
  templateUrl: './food-delivery.component.html',
  styleUrls: ['./food-delivery.component.css']
})
export class FoodDeliveryComponent implements OnInit {
  constructor(private restaurantService: RestaurantService){}

  guest: User = new User()
  guestAllOrders: Order[] = []
  currentOrders: Order[] = []
  outOfDateOrders: Order[] = []
  today: Date = new Date()


  ngOnInit(): void {
    this.guest = JSON.parse(localStorage.getItem("logged") ?? "")

    this.restaurantService.getAllOrdersGuest(this.guest.username).subscribe(
      orders => {
        this.guestAllOrders = orders
        this.currentOrders = []
        this.outOfDateOrders = []

        for(let order of this.guestAllOrders) {
          let endDate
          if(order.estimatedTime) {
            let estimatedTime = Number(order.estimatedTime.slice(3,5))
            endDate = new Date(order.dateAcceptReject)
            endDate.setMinutes(endDate.getMinutes() + estimatedTime)
          }

          if(order.status === "accepted" && endDate && endDate < new Date()) {
            this.outOfDateOrders.push(order)
          } else {
            this.currentOrders.push(order)
          }
        }
      }
    )
  }
}
