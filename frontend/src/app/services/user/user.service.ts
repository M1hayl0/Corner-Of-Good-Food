import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string){
    return this.http.post<User>("http://localhost:4000/user/login", {username: username, password: password})
  }
  
  getUser(username: string){
    return this.http.post<User>("http://localhost:4000/user/getUser", {username: username})
  }

  getUserEmail(email: string){
    return this.http.post<User>("http://localhost:4000/user/getUserEmail", {email: email})
  }

  profileImage(profileImage: FormData){
    return this.http.post<any>("http://localhost:4000/user/profileImage", profileImage)
  }

  registerUser(user: User){
    return this.http.post<number>("http://localhost:4000/user/registerUser", {user: user})
  }

  changePassword(user: User){
    return this.http.post<number>("http://localhost:4000/user/changePassword", {user: user})
  }

  changeProfile(user: User){
    return this.http.post<number>("http://localhost:4000/user/changeProfile", {user: user})
  }

  getTotalGuests(){
    return this.http.get<number>("http://localhost:4000/user/getTotalGuests")
  }

  getAllWaiters(){
    return this.http.get<User[]>("http://localhost:4000/user/getAllWaiters")
  }

  getAllGuests(){
    return this.http.get<User[]>("http://localhost:4000/user/getAllGuests")
  }

  changeStatus(guest: User){
    return this.http.post<number>("http://localhost:4000/user/changeStatus", {guest: guest})
  }

  changeUser(user: User){
    return this.http.post<number>("http://localhost:4000/user/changeUser", {user: user})
  }

  increaseDidntAppearTimes(guest: string){
    return this.http.post<User>("http://localhost:4000/user/increaseDidntAppearTimes", {guest: guest})
  }

  registerWaiter(user: User){
    return this.http.post<number>("http://localhost:4000/user/registerWaiter", {user: user})
  }

  addRestaurantToWaiter(waiter: User){
    return this.http.post<number>("http://localhost:4000/user/addRestaurantToWaiter", {waiter: waiter})
  }
}
