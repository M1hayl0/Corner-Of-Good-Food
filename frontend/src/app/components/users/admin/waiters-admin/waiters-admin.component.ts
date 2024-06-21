import { Component } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-waiters-admin',
  templateUrl: './waiters-admin.component.html',
  styleUrls: ['./waiters-admin.component.css']
})
export class WaitersAdminComponent {
  constructor(private userService: UserService, private restaurantService: RestaurantService) {}

  allWaiters: User[] = []
  allRestaurants: Restaurant[] = []
  waiter: User = new User()

  valid: boolean = true

  ngOnInit(): void {
    this.userService.getAllWaiters().subscribe(
      waiters=> {
        this.allWaiters = waiters
        
        this.restaurantService.getAllRestaurants().subscribe(
          restaurants=>this.allRestaurants = restaurants
        )
      }
    )
  }

  fieldCheck(fieldName: string, message: string) {
    if((this as any).waiter[`${fieldName}`] === "") alert(message)
    if(this.valid) this.valid = (this as any).waiter[`${fieldName}`] !== ""
  }

  firstLayerCheck() {
    this.fieldCheck("firstName", "You must enter a first name");
    this.fieldCheck("lastName", "You must enter a last name");
    this.fieldCheck("address", "You must enter an address");
    this.fieldCheck("phone", "You must enter a phone number");
    this.fieldCheck("email", "You must enter an email");
  }

  secondLayerCheck() {
    const emailRegex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
    if(!emailRegex.test(this.waiter.email)) {
      alert("Please enter a valid email")
      this.valid = false
    }
  }

  thirdLayerCheck() {
    this.userService.getUserEmail(this.waiter.email).subscribe(
      user=>{
        if(user != null && user.username != this.waiter.username) alert("There is already an account with an entered email")
        
        this.userService.changeUser(this.waiter).subscribe(
          ret=> {
            if(!ret) alert("Successful data change")
            else alert("Data change failed")
            this.ngOnInit()
          }
        )
      }
    )
  }

  update(waiter: User) {
    this.waiter = waiter
    this.valid = true
    this.firstLayerCheck()

    if(this.valid) {
      this.secondLayerCheck()

      if(this.valid) {
        this.thirdLayerCheck()
      }
    }
  }

  deactivate(waiter: User) {
    waiter.status = "blocked"
    this.userService.changeStatus(waiter).subscribe(
      ret=> {
        if(!ret) alert("Successful status change")
        else alert("Status change failed")
        this.ngOnInit()
      }
    )
  }




  waiter2: User = new User()
  profileImage: any
  valid2: boolean = true

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

  fieldCheck2(fieldName: string, message: string) {
    (this as any)[`${fieldName}Message`] = (this as any).waiter2[`${fieldName}`] === "" ? message : "";
    if(this.valid) this.valid = (this as any).waiter2[`${fieldName}`] !== ""
  }

  firstLayerCheck2() {
    this.fieldCheck2("username", "You must enter a username");
    this.fieldCheck2("password", "You must enter a password");
    this.fieldCheck2("securityQuestion", "You must enter a security question");
    this.fieldCheck2("securityAnswer", "You must enter a security answer");
    this.fieldCheck2("firstName", "You must enter a first name");
    this.fieldCheck2("lastName", "You must enter a last name");
    this.fieldCheck2("address", "You must enter an address");
    this.fieldCheck2("phone", "You must enter a phone number");
    this.fieldCheck2("email", "You must enter an email");
    this.fieldCheck2("creditCard", "You must enter a credit card number");
  }  

  secondLayerCheck2() {
    if(this.waiter2.password.length < 6) this.passwordMessage = "The length of the password must be at least 6 characters"
    else if(this.waiter2.password.length > 10) this.passwordMessage = "The length of the password must be a maximum of 10 characters"
    else if((this.waiter2.password.match(/[A-Z]/g) || []).length < 1) this.passwordMessage = "Password must have at least one capital letter"
    else if((this.waiter2.password.match(/[a-z]/g) || []).length < 3) this.passwordMessage = "The password must have at least three lowercase letters"
    else if((this.waiter2.password.match(/[0-9]/g) || []).length < 1) this.passwordMessage = "The password must have at least one number"
    else if((this.waiter2.password.match(/[^\w]/g) || []).length < 1) this.passwordMessage = "Password must have at least one special character"
    else if((this.waiter2.password[0].match(/[a-zA-Z]/g) || []).length < 1) this.passwordMessage = "Password must start with a letter"
    else this.passwordMessage = ""

    this.valid = this.passwordMessage === ""

    const emailRegex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
    if(!emailRegex.test(this.waiter2.email)) {
      this.emailMessage = "Please enter a valid email"
      this.valid = false
    } else this.emailMessage = ""

    const creditCardRegex = /^\d{4} \d{4} \d{4} \d{4}$/
    if(!creditCardRegex.test(this.waiter2.creditCard)) {
      this.creditCardMessage = "Enter your credit card number in the format xxxx xxxx xxxx xxxx"
      this.valid = false
    } else this.creditCardMessage = ""
  }

  thirdLayerCheck2() {
    this.userService.getUser(this.waiter2.username).subscribe(
      user1=>{
        this.usernameMessage = user1 != null ? "The username is already taken" : ""

        this.userService.getUserEmail(this.waiter2.email).subscribe(
          user2=>{
            this.emailMessage = user2 != null ? "There is already an account with an entered email" : ""
            
            if(!user1 && !user2) {
              this.waiter2.type = "waiter"
              this.waiter2.status = "active"
              this.waiter2.restaurantName = ""
              this.waiter2.restaurantName = ""
              if(this.profileImage) this.waiter2.profileImageName = this.profileImage.name

              this.userService.registerWaiter(this.waiter2).subscribe(
                ret1=>{
                  if(!ret1) alert("Successful registration")
                  else alert("Registration failed")

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
    )
  }

  registration() {
    this.valid = true
    this.firstLayerCheck2()

    if(this.valid) {
      this.secondLayerCheck2()

      if(this.valid) {
        this.thirdLayerCheck2()
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



  waiterAdd: User = new User()
  restaurantAddWaiter: Restaurant = new Restaurant()

  addWaiter() {
    this.waiterAdd.restaurantName = this.restaurantAddWaiter.name
    this.waiterAdd.restaurantAddress = this.restaurantAddWaiter.address
    this.restaurantAddWaiter.waiters.push(this.waiterAdd.username)

    this.userService.addRestaurantToWaiter(this.waiterAdd).subscribe(
      ret1=>{
        if(!ret1) alert("Successful change")
        else alert("Change failed")

        this.restaurantService.addWaiterToRestaurant(this.restaurantAddWaiter).subscribe(
          ret2=>{
            if(!ret2) alert("Successful change")
            else alert("Change failed")
          }
        )
      }
    )
  }
}
