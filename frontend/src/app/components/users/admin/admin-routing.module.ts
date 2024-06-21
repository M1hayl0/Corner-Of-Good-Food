import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestsAdminComponent } from './guests-admin/guests-admin.component';
import { WaitersAdminComponent } from './waiters-admin/waiters-admin.component';
import { RestaurantsAdminComponent } from './restaurants-admin/restaurants-admin.component';

const routes: Routes = [
  {path: "guests", component: GuestsAdminComponent},
  {path: "", redirectTo: "guests", pathMatch: "full"},
  {path: "waiters", component: WaitersAdminComponent},
  {path: "restaurants", component: RestaurantsAdminComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
