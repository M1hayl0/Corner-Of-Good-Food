import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userService: UserService, private router: Router){}

  username: string = ""
  password: string = ""

  login() {
    this.userService.login(this.username, this.password).subscribe(
      user=>{
        if(user==null) alert("Incorrectly entered data")
        else {
          if(user.status !== "active") {
            alert("Your account is not active")
          } else {
            localStorage.setItem("logged", JSON.stringify(user))
            if(user.type == "guest") {
              this.router.navigate(["guest"])
            } else if(user.type == "waiter") {
              this.router.navigate(["waiter"])
            } else if(user.type == "admin") {
              alert("You cannot log in as an administrator")
            } 
          }
        }
      }
    )
  }
}
