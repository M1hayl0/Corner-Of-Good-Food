import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit{
  constructor(private restaurantService: RestaurantService){}

  waiterAllOrders: Order[] = []
  
  ngOnInit(): void {
    this.restaurantService.getAllOrdersWaiter().subscribe(
      orders => {
        this.waiterAllOrders = orders

        for(let order of this.waiterAllOrders) order.estimatedTime = "20-30 min"
      }
    )
  }

  accept(order: Order) {
    order.status = "accepted"
    order.dateAcceptReject = new Date()
    this.restaurantService.orderUpdate(order).subscribe(
      ret => {
        if(!ret) alert("Successful status change")
        else alert("Status change failed")
        this.ngOnInit()
      }
    )
  }
  
  reject(order: Order) {
    order.status = "rejected"
    order.estimatedTime = ""
    order.dateAcceptReject = new Date()
    this.restaurantService.orderUpdate(order).subscribe(
      ret => {
        if(!ret) alert("Successful status change")
        else alert("Status change failed")
        this.ngOnInit()
      }
    )
  }
}
