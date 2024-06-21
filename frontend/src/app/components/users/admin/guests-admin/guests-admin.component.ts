import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-guests-admin',
  templateUrl: './guests-admin.component.html',
  styleUrls: ['./guests-admin.component.css']
})
export class GuestsAdminComponent implements OnInit {
  constructor(private userService: UserService) {}

  allGuests: User[] = []
  guest: User = new User()

  valid: boolean = true

  ngOnInit(): void {
    this.userService.getAllGuests().subscribe(
      guests=>this.allGuests = guests
    )
  }

  fieldCheck(fieldName: string, message: string) {
    if((this as any).guest[`${fieldName}`] === "") alert(message)
    if(this.valid) this.valid = (this as any).guest[`${fieldName}`] !== ""
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
    if(!emailRegex.test(this.guest.email)) {
      alert("Please enter a valid email")
      this.valid = false
    }
  }

  thirdLayerCheck() {
    this.userService.getUserEmail(this.guest.email).subscribe(
      user=>{
        if(user != null && user.username != this.guest.username) alert("There is already an account with an entered email")
        
        this.userService.changeUser(this.guest).subscribe(
          ret=> {
            if(!ret) alert("Successful data change")
            else alert("Data change failed")
            this.ngOnInit()
          }
        )
      }
    )
  }

  update(guest: User) {
    this.guest = guest
    this.valid = true
    this.firstLayerCheck()

    if(this.valid) {
      this.secondLayerCheck()

      if(this.valid) {
        this.thirdLayerCheck()
      }
    }
  }

  accept(guest: User) {
    guest.status = "active"
    this.userService.changeStatus(guest).subscribe(
      ret=> {
        if(!ret) alert("Successful status change")
        else alert("Status change failed")
        this.ngOnInit()
      }
    )
  }

  refuseDeactivate(guest: User) {
    guest.status = "blocked"
    this.userService.changeStatus(guest).subscribe(
      ret=> {
        if(!ret) alert("Successful status change")
        else alert("Status change failed")
        this.ngOnInit()
      }
    )
  }

}
