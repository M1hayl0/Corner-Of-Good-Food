import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private userService: UserService, private router: Router){}

  user: User = new User()
  profileImage: File | null = null;
  valid: boolean = true

  profileImageUrl: string = ""

  firstNameMessage: string = ""
  lastNameMessage: string = ""
  addressMessage: string = ""
  phoneMessage: string = ""
  emailMessage: string = ""
  creditCardMessage: string = ""
  profileImageMessage: string = ""
  
  basePath: string = this.router.url

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("logged") ?? "")
    if(this.user.profileImageName == "") this.profileImageUrl = "../../../assets/defaultProfileImage.png"
    else this.profileImageUrl = "http://localhost:4000/" + this.user.profileImageName

    this.basePath = this.router.url.substring(0, this.basePath.lastIndexOf('/'));
  }

  fieldCheck(fieldName: string, message: string) {
    (this as any)[`${fieldName}Message`] = (this as any).user[`${fieldName}`] === "" ? message : "";
    if(this.valid) this.valid = (this as any).user[`${fieldName}`] !== ""
  }

  firstLayerCheck() {
    this.fieldCheck("firstName", "You must enter a first name");
    this.fieldCheck("lastName", "You must enter a last name");
    this.fieldCheck("address", "You must enter an address");
    this.fieldCheck("phone", "You must enter a phone number");
    this.fieldCheck("email", "You must enter an email");
    this.fieldCheck("creditCard", "You must enter a credit card number");
  }

  secondLayerCheck() {
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
    this.userService.getUserEmail(this.user.email).subscribe(
      user=>{
        this.emailMessage = user != null && user.username != this.user.username ? "There is already an account with an entered email" : ""
        
        if(!user || user.username === this.user.username) {
          if(this.profileImage) this.user.profileImageName = "profile_image_" + this.profileImage.name
          localStorage.setItem("logged", JSON.stringify(this.user))

          this.userService.changeProfile(this.user).subscribe(
            ret=>{
              if(!ret) alert("Successful profile change")
              else alert("Profile change failed")
  
              if(this.profileImage) {
                const formData = new FormData()
                formData.append("file", this.profileImage)
                this.userService.profileImage(formData).subscribe()
              }
            }
          )
        }
      }
    )
  }

  changeProfile() {
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
