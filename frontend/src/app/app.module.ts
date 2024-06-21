import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/logins/login/login.component';
import { LoginAdminComponent } from './components/logins/login-admin/login-admin.component';
import { RegisterComponent } from './components/logins/register/register.component';
import { WaiterComponent } from './components/users/waiter/waiter.component';
import { GuestComponent } from './components/users/guest/guest.component';
import { AdminComponent } from './components/users/admin/admin.component';
import { PasswordChangeComponent } from './components/logins/password-change/password-change.component';
import { ForgottenPasswordComponent } from './components/logins/forgotten-password/forgotten-password.component';
import { ProfileComponent } from './components/logins/profile/profile.component';
import { HomePageComponent } from './components/home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginAdminComponent,
    RegisterComponent,
    WaiterComponent,
    GuestComponent,
    AdminComponent,
    PasswordChangeComponent,
    ForgottenPasswordComponent,
    ProfileComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
