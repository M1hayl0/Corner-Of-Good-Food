import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-reservations-waiter',
  templateUrl: './reservations-waiter.component.html',
  styleUrls: ['./reservations-waiter.component.css']
})
export class ReservationsWaiterComponent implements OnInit {
  constructor(private restaurantSerivce: RestaurantService, private userService: UserService) {}

  @ViewChild("canvas", {static: false}) canvasRef!: ElementRef
  canvas: any
  context: any
  
  waiter: User = new User()
  allWaitingReservationsForRestaurant: Reservation[] = []
  allAcceptedReservationsForRestaurant: Reservation[] = []
  allAcceptedRejectedReservationsForRestaurantForWaiter: Reservation[] = []
  restaurant: Restaurant = new Restaurant()
  selectedReservation: Reservation = new Reservation()

  displayList: boolean = false
  reservedTables: any = []
  notReservedTables: any = []

  ngOnInit(): void {
    this.waiter = JSON.parse(localStorage.getItem("logged") ?? "")
    this.restaurantSerivce.getWaitersRestaurant(this.waiter.username).subscribe(
      restaurant=>{
        if(!restaurant) alert("Waiter is unemployed")
        else {
          this.restaurant = restaurant
          this.restaurantSerivce.getWaitingReservationsForRestaurant(this.restaurant).subscribe(
            reservations=>{
              this.allWaitingReservationsForRestaurant = reservations
              this.allWaitingReservationsForRestaurant = this.allWaitingReservationsForRestaurant.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

              this.restaurantSerivce.getAcceptedRejectedReservationsForRestaurant(this.restaurant).subscribe(
                reservations2=>{
                  this.allAcceptedReservationsForRestaurant = reservations2
                  
                  this.allAcceptedRejectedReservationsForRestaurantForWaiter = []
                  for (let reservation of this.allAcceptedReservationsForRestaurant) {
                    if(reservation.waiter === this.waiter.username) {
                      this.allAcceptedRejectedReservationsForRestaurantForWaiter.push(reservation)
                    }
                  }

                  this.drawCanvas()
                }
              )
            }
          )
        }
      }
    )
  }

  accept(reservation: Reservation) {
    if(!reservation.table) alert("Click on the guest and choose the table")
    else {
      reservation.status = "accepted"
      reservation.waiter = this.waiter.username
      this.restaurantSerivce.acceptReservation(reservation).subscribe(
        ret => {
          if(!ret) alert("Successful reservation accept")
          else alert("Reservation accept failed")
          this.ngOnInit()
        }
      ) 
    }
  }

  reject(reservation: Reservation) {
    reservation.status = "rejected"
    reservation.waiter = this.waiter.username
    this.restaurantSerivce.rejectReservation(reservation).subscribe(
      ret => {
        if(!ret) alert("Successful reservation reject")
        else alert("Reservation reject failed")
        this.ngOnInit()
      }
    ) 
  }

  displayCanvas(reservation: Reservation) {
    if(this.selectedReservation.table) {
      for(let table of this.notReservedTables) {
        if(table.x === this.selectedReservation.table.x && table.y === this.selectedReservation.table.y && table.r === this.selectedReservation.table.r) {
          this.drawCircle(table.seats, this.selectedReservation.table.x, this.selectedReservation.table.y, this.selectedReservation.table.r, this.selectedReservation.table.sAngle, this.selectedReservation.table.eAngle)
        }
      }
    }
    this.selectedReservation = reservation
    this.drawDate()
    if(!reservation.table) {
      this.displayList = true
    } else this.displayList = false
  }

  drawCanvas() {
    this.canvas = this.canvasRef.nativeElement
    this.context = this.canvas.getContext("2d")

    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.context.lineWidth = 5

    this.context.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40)
    this.context.strokeRect(40, 100, this.canvas.width - 80, this.canvas.height - 140)
    this.drawRestaurantName()

    for (let element of this.restaurant.canvas) {
      if(element.type == "Kitchen" || element.type == "Wc") {
        this.drawRect(element.type, element.x, element.y, element.width, element.height)
      } else if(element.type == "Table") {
        this.drawCircle(element.seats, element.x, element.y, element.r, element.sAngle, element.eAngle)
      }
    }
  }

  drawRestaurantName() {
    this.context.strokeRect(40, 40, 400, 40)
    this.context.fillStyle = "#fcf4bc"
    this.context.fillRect(40, 40, 400, 40)
    this.context.fillStyle = "black"
    
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(this.restaurant.name, 40 + 400 / 2, 40 + 40 / 2);
  }

  drawRect(text: string, x: number, y: number, w: number, h: number) {
    this.context.strokeRect(x, y, w, h)
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(text, x + w / 2, y + h / 2)
  }

  drawCircle(seats: number, x: number, y: number, r: number, sAngle: number, eAngle: number, color = "white", textColor = "black") {
    this.context.beginPath()
    this.context.arc(x, y, r, sAngle, eAngle)
    this.context.fillStyle = color
    this.context.fill()
    this.context.stroke()
    this.context.fillStyle = textColor
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(seats.toString(), x, y)
  }

  drawDate() {
    this.context.fillStyle = "white"
    this.context.fillRect(580, 30, 190, 40)
    
    let date = new Date(this.selectedReservation.date)
    let dayS = String(date.getDate()).padStart(2, '0')
    let monthS = String(date.getMonth() + 1).padStart(2, '0')
    let yearS = date.getFullYear()
    let hoursS = String(date.getHours()).padStart(2, '0')
    let minutesS = String(date.getMinutes()).padStart(2, '0')
    let textDate = `${dayS}.${monthS}.${yearS}.`
    let textTime = `${hoursS}:${minutesS}`
    let text = textDate + " " + textTime
    this.context.fillStyle = "black"
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(text, 680, 50)

    let reservationDateEnd = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), date.getHours() + this.selectedReservation.hours, date.getMinutes())
    for(let element of this.reservedTables) {
      this.drawCircle(element.seats, element.x, element.y, element.r, element.sAngle, element.eAngle)
    }

    this.reservedTables = []
    for(let reservation of this.allAcceptedReservationsForRestaurant) {
      let startDate: Date = new Date(reservation.date)
      let endDate: Date = new Date(reservation.date)
      endDate.setHours(endDate.getHours() + reservation.hours);
      if((reservation.restaurantName === this.restaurant.name && reservation.restaurantAddress === this.restaurant.address) && 
        ((date >= startDate && date <= endDate) || 
        (reservationDateEnd >= startDate && reservationDateEnd <= endDate))) {
        this.reservedTables.push(reservation.table)
      }
    }

    if(this.selectedReservation.table) {
      this.drawCircle(this.selectedReservation.table.seats, this.selectedReservation.table.x, this.selectedReservation.table.y, this.selectedReservation.table.r, this.selectedReservation.table.sAngle, this.selectedReservation.table.eAngle, "yellow", "yellow")
      for(let table of this.reservedTables) {
        this.drawCircle(table.seats, table.x, table.y, table.r, table.sAngle, table.eAngle, "red", "red")
      }
    }

    this.notReservedTables = []
    for(let element of this.restaurant.canvas) {
      if(element.type === "Table" && !this.reservedTables.includes(element)) {
        this.notReservedTables.push(element)
      }
    }
  }  

  changeTableSelected() {
    for(let table of this.notReservedTables) {
      this.drawCircle(table.seats, table.x, table.y, table.r, table.sAngle, table.eAngle, "white", "black")
    }
    this.drawCircle(this.selectedReservation.table.seats, this.selectedReservation.table.x, this.selectedReservation.table.y, this.selectedReservation.table.r, this.selectedReservation.table.sAngle, this.selectedReservation.table.eAngle, "yellow", "yellow")  
    for(let table of this.reservedTables) {
      this.drawCircle(table.seats, table.x, table.y, table.r, table.sAngle, table.eAngle, "red", "red")
    }
  }

  guestAppeared(reservation: Reservation, appeared: boolean) {
    reservation.guestAppeared = appeared
    this.restaurantSerivce.guestAppeared(reservation).subscribe(
      ret1 => {
        if(!ret1) {
          if(!appeared) {
            this.userService.increaseDidntAppearTimes(reservation.guest).subscribe(
              ret2 => {
                if(ret2) {
                  this.userService.getUser(reservation.guest).subscribe(
                    guest => {
                      if(guest) {
                        if(guest.didntAppearTimes >= 3) {
                          guest.status = "blocked"
                          this.userService.changeStatus(guest).subscribe(
                            ret3=> {
                              if(!ret3) alert("Successful change")
                              else alert("Change failed")
                              this.reject(reservation)
                            }
                          )
                        } else {
                          this.reject(reservation)
                        }
                      } else alert("Change failed")
                    }
                  )
                } else alert("Change failed")
              }
            )
          }
        } else alert("Change failed")
        this.ngOnInit()
      }
    )
  }

  dateMoreThan30MinutesAgo(date: Date) {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - new Date(date).getTime();
    const minutesDifference = timeDifference / (1000 * 60);
    return minutesDifference > 30;
  }
    
  dateMoreThan30MinutesAgoAndLessThan3Hours(date: Date) {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - new Date(date).getTime();
    const minutesDifference = timeDifference / (1000 * 60);
    return minutesDifference > 30 && minutesDifference < 180;
  }

  addOneHour(reservation: Reservation) {
    reservation.hours = 4
    this.restaurantSerivce.addOneHour(reservation).subscribe(
      ret => {
        if(!ret) alert("Successful change")
        else alert("Change failed")
      }
    )
  }
}
