import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent {
  constructor(private userService: UserService){}

  step: number = 1
  user: User = new User()
  securityAnswer: string = ""
  newPassword: string = ""
  newPassword2: string = ""

  usernameMessage: string = ""
  securityAnswerMessage: string = ""
  newPasswordMessage: string = ""

  nextStep1() {
    this.userService.getUser(this.user.username).subscribe(
      user=>{
        if(!user) this.usernameMessage = "Entered user doesn't exists"
        else {
          this.usernameMessage = ""
          this.user = user
          this.step++
        }
      }
    )
  }

  nextStep2() {
    if(this.user.securityAnswer != this.securityAnswer) {
      this.securityAnswerMessage = "Wrong answer"
    } else {
      this.securityAnswerMessage = ""
      this.step++
    }
  }

  changePassword() {
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
          }
        )
      }
    }
  }
}
