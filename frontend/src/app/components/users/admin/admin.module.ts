import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RestaurantsAdminComponent } from './restaurants-admin/restaurants-admin.component';
import { GuestsAdminComponent } from './guests-admin/guests-admin.component';
import { WaitersAdminComponent } from './waiters-admin/waiters-admin.component';


@NgModule({
  declarations: [
    RestaurantsAdminComponent,
    GuestsAdminComponent,
    WaitersAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdminModule { }
