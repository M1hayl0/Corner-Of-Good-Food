import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  constructor(private userService: UserService, private router: Router){}

  username: string = ""
  password: string = ""

  login() {
    this.userService.login(this.username, this.password).subscribe(
      user=>{
        if(user==null) alert("Incorrectly entered data")
        else {
          localStorage.setItem("logged", JSON.stringify(user))
          if(user.type == "guest") {
            alert("You cannot log in as a guest")
          } else if(user.type == "waiter") {
            alert("You cannot register as a waiter")
          } else if(user.type == "admin") {
            this.router.navigate(["admin"])
          } 
        }
      }
    )
  }
}
