import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordChangeComponent } from 'src/app/components/logins/password-change/password-change.component';
import { ProfileComponent } from 'src/app/components/logins/profile/profile.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantComponent } from './restaurants/restaurant/restaurant.component';
import { ReservationsGuestComponent } from './reservations-guest/reservations-guest.component';
import { FoodDeliveryComponent } from './food-delivery/food-delivery.component';

const routes: Routes = [
  {path: "profile", component: ProfileComponent},
  {path: "", redirectTo: "profile", pathMatch: "full"},
  {path: "passwordChange", component: PasswordChangeComponent},
  {path: "restaurants", component: RestaurantsComponent},
  {path: "restaurants/restaurant", component: RestaurantComponent},
  {path: "reservations", component: ReservationsGuestComponent},
  {path: "foodDelivery", component: FoodDeliveryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
