import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private userService: UserService, private router: Router){}

  user: User = new User()
  profileImage: File | null = null;
  valid: boolean = true

  usernameMessage: string = ""
  passwordMessage: string = ""
  securityQuestionMessage: string = ""
  securityAnswerMessage: string = ""
  firstNameMessage: string = ""
  lastNameMessage: string = ""
  addressMessage: string = ""
  phoneMessage: string = ""
  emailMessage: string = ""
  creditCardMessage: string = ""
  profileImageMessage: string = ""

  fieldCheck(fieldName: string, message: string) {
    (this as any)[`${fieldName}Message`] = (this as any).user[`${fieldName}`] === "" ? message : "";
    if(this.valid) this.valid = (this as any).user[`${fieldName}`] !== ""
  }

  firstLayerCheck() {
    this.fieldCheck("username", "You must enter a username");
    this.fieldCheck("password", "You must enter a password");
    this.fieldCheck("securityQuestion", "You must enter a security question");
    this.fieldCheck("securityAnswer", "You must enter a security answer");
    this.fieldCheck("firstName", "You must enter a first name");
    this.fieldCheck("lastName", "You must enter a last name");
    this.fieldCheck("address", "You must enter an address");
    this.fieldCheck("phone", "You must enter a phone number");
    this.fieldCheck("email", "You must enter an email");
    this.fieldCheck("creditCard", "You must enter a credit card number");
  }  

  secondLayerCheck() {
    if(this.user.password.length < 6) this.passwordMessage = "The length of the password must be at least 6 characters"
    else if(this.user.password.length > 10) this.passwordMessage = "The length of the password must be a maximum of 10 characters"
    else if((this.user.password.match(/[A-Z]/g) || []).length < 1) this.passwordMessage = "Password must have at least one capital letter"
    else if((this.user.password.match(/[a-z]/g) || []).length < 3) this.passwordMessage = "The password must have at least three lowercase letters"
    else if((this.user.password.match(/[0-9]/g) || []).length < 1) this.passwordMessage = "The password must have at least one number"
    else if((this.user.password.match(/[^\w]/g) || []).length < 1) this.passwordMessage = "Password must have at least one special character"
    else if((this.user.password[0].match(/[a-zA-Z]/g) || []).length < 1) this.passwordMessage = "Password must start with a letter"
    else this.passwordMessage = ""

    this.valid = this.passwordMessage === ""

    const emailRegex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
    if(!emailRegex.test(this.user.email)) {
      this.emailMessage = "Please enter a valid email"
      this.valid = false
    } else this.emailMessage = ""

    const creditCardRegex = /^\d{4} \d{4} \d{4} \d{4}$/
    if(!creditCardRegex.test(this.user.creditCard)) {
      this.creditCardMessage = "Enter your credit card number in the format xxxx xxxx xxxx xxxx"
      this.valid = false
    } else this.creditCardMessage = ""
  }

  thirdLayerCheck() {
    this.userService.getUser(this.user.username).subscribe(
      user1=>{
        this.usernameMessage = user1 != null ? "The username is already taken" : ""

        this.userService.getUserEmail(this.user.email).subscribe(
          user2=>{
            this.emailMessage = user2 != null ? "There is already an account with an entered email" : ""
            
            if(!user1 && !user2) {
              this.user.type = "guest"
              this.user.status = "inactive"
              this.user.didntAppearTimes = 0
              if(this.profileImage) this.user.profileImageName = "profile_image_" + this.profileImage.name

              this.userService.registerUser(this.user).subscribe(
                ret1=>{
                  if(!ret1) alert("Successful registration")
                  else alert("Registration failed")

                  if(this.profileImage) {
                    const formData = new FormData()
                    formData.append("file", this.profileImage)
                    this.userService.profileImage(formData).subscribe()
                  }

                  this.router.navigate(["login"])
                }
              )
            }
          }
        )
      }
    )
  }

  registration() {
    this.valid = true
    this.firstLayerCheck()

    if(this.valid) {
      this.secondLayerCheck()

      if(this.valid) {
        this.thirdLayerCheck()
      }
    }
  }

  profileImageProcess(event: any) {
    const min = 100
    const max = 300
    const reader = new FileReader()
    const file = event.target.files[0]
    
    reader.onload = (e: any) => {
      const img = new Image()
      img.onload = () => {
        if(img.width < min || img.height < min || img.width > max || img.height > max) {
          this.profileImageMessage = "The image size must be between 100x100 and 300x300 pixels"
        } else {
          this.profileImageMessage = ""
          this.profileImage = file
        }
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file);
  }
}
