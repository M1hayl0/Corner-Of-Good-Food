import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  constructor(private userService: UserService, private router: Router){}
  
  user: User = new User()

  oldPassword: string = ""
  newPassword: string = ""
  newPassword2: string = ""

  oldPasswordMessage: string = ""
  newPasswordMessage: string = ""

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("logged") ?? "")
  }

  changePassword() {
    this.userService.login(this.user.username, this.oldPassword).subscribe(
      user=>{
        if(user==null) {
          this.oldPasswordMessage = "You entered the wrong old password"
        } else {
          this.oldPasswordMessage = ""
          if(this.newPassword != this.newPassword2) this.newPasswordMessage = "The passwords entered are different"
          else {
            if(this.newPassword.length < 6) this.newPasswordMessage = "The length of the password must be at least 6 characters"
            else if(this.newPassword.length > 10) this.newPasswordMessage = "The length of the password must be a maximum of 10 characters"
            else if((this.newPassword.match(/[A-Z]/g) || []).length < 1) this.newPasswordMessage = "Password must have at least one capital letter"
            else if((this.newPassword.match(/[a-z]/g) || []).length < 3) this.newPasswordMessage = "The password must have at least three lowercase letters"
            else if((this.newPassword.match(/[0-9]/g) || []).length < 1) this.newPasswordMessage = "The password must have at least one number"
            else if((this.newPassword.match(/[^\w]/g) || []).length < 1) this.newPasswordMessage = "Password must have at least one special character"
            else if((this.newPassword[0].match(/[a-zA-Z]/g) || []).length < 1) this.newPasswordMessage = "Password must start with a letter"
            else { 
              this.newPasswordMessage = ""
              
              this.user.password = this.newPassword
              this.userService.changePassword(this.user).subscribe(
                ret=>{
                  if(!ret) alert("Successful password change")
                  else alert("Password change failed")
                
                  this.router.navigate(["login"])
                }
              )
            }
          }
        }
      }
    )
  }
}
