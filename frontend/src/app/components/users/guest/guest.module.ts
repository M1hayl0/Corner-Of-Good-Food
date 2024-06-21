import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { FormsModule } from '@angular/forms';
import { RestaurantComponent } from './restaurants/restaurant/restaurant.component';
import { HttpClientModule } from '@angular/common/http';
import { ReservationsGuestComponent } from './reservations-guest/reservations-guest.component';
import { FoodDeliveryComponent } from './food-delivery/food-delivery.component';


@NgModule({
  declarations: [
    RestaurantsComponent,
    RestaurantComponent,
    ReservationsGuestComponent,
    FoodDeliveryComponent
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DatePipe],
})
export class GuestModule { }
