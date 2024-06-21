import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordChangeComponent } from 'src/app/components/logins/password-change/password-change.component';
import { ProfileComponent } from 'src/app/components/logins/profile/profile.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ReservationsWaiterComponent } from './reservations-waiter/reservations-waiter.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {path: "profile", component: ProfileComponent},
  {path: "", redirectTo: "profile", pathMatch: "full"},
  {path: "passwordChange", component: PasswordChangeComponent},
  {path: "reservations", component: ReservationsWaiterComponent},
  {path: "deliveries", component: DeliveriesComponent},
  {path: "statistics", component: StatisticsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaiterRoutingModule { }
