import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/logins/login/login.component';
import { LoginAdminComponent } from './components/logins/login-admin/login-admin.component';
import { RegisterComponent } from './components/logins/register/register.component';
import { GuestComponent } from './components/users/guest/guest.component';
import { WaiterComponent } from './components/users/waiter/waiter.component';
import { AdminComponent } from './components/users/admin/admin.component';
import { ForgottenPasswordComponent } from './components/logins/forgotten-password/forgotten-password.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { guestGuard } from './guards/guest.guard';
import { waiterGuard } from './guards/waiter.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path: "homePage", component: HomePageComponent},
  {path: "", redirectTo: "homePage", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "loginAdmin", component: LoginAdminComponent},
  {path: "register", component: RegisterComponent},
  {path: "forgottenPassword", component: ForgottenPasswordComponent},
  {path: "guest", canActivate: [guestGuard], component: GuestComponent, loadChildren: () => import("./components/users/guest/guest.module").then(m => m.GuestModule)},
  {path: "waiter", canActivate: [waiterGuard], component: WaiterComponent, loadChildren: () => import("./components/users/waiter/waiter.module").then(m => m.WaiterModule)},
  {path: "admin", canActivate: [adminGuard], component: AdminComponent, loadChildren: () => import("./components/users/admin/admin.module").then(m => m.AdminModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
