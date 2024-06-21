import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaiterRoutingModule } from './waiter-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ReservationsWaiterComponent } from './reservations-waiter/reservations-waiter.component';
import { StatisticsComponent } from './statistics/statistics.component';


@NgModule({
  declarations: [
    DeliveriesComponent,
    ReservationsWaiterComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    WaiterRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class WaiterModule { }
