import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private restaurantService: RestaurantService) {}

  restaurant: Restaurant = new Restaurant()
  reservation: Reservation = new Reservation()
  reservationWay: boolean = true
  allAcceptedReservations: Reservation[] = []
  reservedTables: any = []
  guest: User = new User()

  seatsMessage: string = ""
  canvasMessage: string = ""
  dateMessage: string = ""
  timeMessage: string = ""

  ngOnInit(): void {
    this.restaurant = JSON.parse(localStorage.getItem("restaurant") ?? "")
    for (let dish of this.restaurant.menu) dish.numberOfDishesToAdd = 1

    this.reservation.restaurantName = this.restaurant.name
    this.reservation.restaurantAddress = this.restaurant.address
    
    this.guest = JSON.parse(localStorage.getItem("logged") ?? "")
    this.reservation.guest = this.guest.username

    this.restaurantService.getAllAcceptedReservations().subscribe(
      allAcceptedReservations=>{
        this.allAcceptedReservations = allAcceptedReservations

        this.restaurant.comments = []
        for(let reservation of this.allAcceptedReservations) {
          if(reservation.comment !== undefined) {
            if(reservation.restaurantName === this.restaurant.name && 
              reservation.restaurantAddress === this.restaurant.address) {
                this.restaurant.comments.push(reservation.comment)
            }
          }
        }
      }
    )
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  changeReservationWay() {
    this.reservation.description = ""
    this.reservation.table = null
    this.reservationWay = !this.reservationWay
    if (!this.reservationWay) {
      setTimeout(() => {
        this.drawCanvas()
        this.listener()
      });
    }
  }



  reservationDateStr: string = ""
  reservationTimeStr: string = ""
  reservationDescription: string = ""

  reservation1() {
    let valid = true

    if(this.reservationDateStr === "") {
      this.dateMessage = "Choose the date"
      valid = false
    } else this.dateMessage = ""

    if(this.reservationTimeStr === "") {
      this.timeMessage = "Choose the time"
      valid = false
    } else this.timeMessage = ""

    if (valid) {
      let [year, month, day] = this.reservationDateStr.split('-').map(Number)
      let [hours, minutes] = this.reservationTimeStr.split(':').map(Number)
      this.reservation.date = new Date(year, month - 1, day, hours, minutes)
      this.reservation.table = this.selectedTable
      
      let reservationEnd = new Date(year, month - 1, day, hours + 3, minutes)
      let dayInWeek = this.reservation.date.getDay()
      let hoursEndNum = reservationEnd.getHours() + 24 * (reservationEnd.getDay() - this.reservation.date.getDay())
      let hoursEnd = hoursEndNum.toString().padStart(2, '0')
      let minutesEnd = reservationEnd.getMinutes().toString().padStart(2, '0')
      const timeEndString = `${hoursEnd}:${minutesEnd}`;
      
      if(this.restaurant.workingTime[dayInWeek].start > this.reservationTimeStr ||
        this.restaurant.workingTime[dayInWeek].end < timeEndString) {
          this.timeMessage = "Restaurant is closed"
          valid = false
      }

      if(valid) {
        this.reservation.table = null
        this.reservation.waiter = ""
        this.reservation.status = "waiting"
        this.reservation.hours = 3
        this.restaurantService.reservation(this.reservation).subscribe(
          ret=> {
            if(!ret) alert("Successful reservation")
            else alert("Reservation failed")
            this.ngOnInit()
          }
        )
      }
    }
  }



  @ViewChild("canvas", {static: false}) canvasRef!: ElementRef
  canvas: any
  context: any
  selectedTable: any

  ngAfterViewInit() {
    if (!this.reservationWay) {
      this.drawCanvas()
      this.listener()
    }
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
    if(this.reservationDateStr == "" || this.reservationTimeStr == "") return
    this.context.fillStyle = "white";
    this.context.fillRect(580, 30, 190, 40)
    
    let [yearS, monthS, dayS] = this.reservationDateStr.split('-');
    let dateStr = dayS + "." + monthS + "." + yearS
    
    let text = dateStr + " " + this.reservationTimeStr
    this.context.fillStyle = "black"
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(text, 680, 50)

    if(this.reservationDateStr == "" || this.reservationTimeStr == "") return
    let [year, month, day] = this.reservationDateStr.split('-').map(Number)
    let [hours, minutes] = this.reservationTimeStr.split(':').map(Number)
    this.reservation.date = new Date(year, month - 1, day, hours, minutes)
    let reservationDateStart = this.reservation.date
    let reservationDateEnd = new Date(year, month - 1, day, hours + 3, minutes)
    
    for(let element of this.reservedTables) {
      this.drawCircle(element.seats, element.x, element.y, element.r, element.sAngle, element.eAngle)
    }

    this.reservedTables = []
    for(let reservation of this.allAcceptedReservations) {
      let startDate: Date = new Date(reservation.date)
      let endDate: Date = new Date(reservation.date)
      endDate.setHours(endDate.getHours() + reservation.hours);
      if((reservation.restaurantName === this.restaurant.name && reservation.restaurantAddress === this.restaurant.address) && 
        ((reservationDateStart >= startDate && reservationDateStart <= endDate) || 
        (reservationDateEnd >= startDate && reservationDateEnd <= endDate))) {
        this.drawCircle(reservation.table.seats, reservation.table.x, reservation.table.y, reservation.table.r, reservation.table.sAngle, reservation.table.eAngle, "red", "red")
        this.reservedTables.push(reservation.table)
      }
    }
  }

  initReservedTables() {
    if(this.reservationDateStr == "" || this.reservationTimeStr == "") return
    let [year, month, day] = this.reservationDateStr.split('-').map(Number)
    let [hours, minutes] = this.reservationTimeStr.split(':').map(Number)
    this.reservation.date = new Date(year, month - 1, day, hours, minutes)
    let reservationDateStart = this.reservation.date
    let reservationDateEnd = new Date(year, month - 1, day, hours + 3, minutes)

    this.reservedTables = []
    for (let reservation of this.allAcceptedReservations) {
      let startDate: Date = new Date(reservation.date)
      let endDate: Date = new Date(reservation.date)
      endDate.setHours(endDate.getHours() + reservation.hours);
      if((reservation.restaurantName === this.restaurant.name && reservation.restaurantAddress === this.restaurant.address) && 
        ((reservationDateStart > startDate && reservationDateStart < endDate) || 
        (reservationDateEnd > startDate && reservationDateEnd < endDate))) {
        this.reservedTables.push(reservation.table)
      }
    }
  }

  listener() {
    this.canvas.addEventListener("click", (e: any)=>{
      const x = e.offsetX
      const y = e.offsetY
      let foundTable = false
      
      for(let element of this.restaurant.canvas) {
        if(element.type === "Table" && this.isPointInCircle(x, y, element) && !this.isReserved(element.x, element.y)) {
          foundTable = true
          if(this.selectedTable) {
            this.drawCircle(this.selectedTable.seats, this.selectedTable.x, this.selectedTable.y, this.selectedTable.r, this.selectedTable.sAngle, this.selectedTable.eAngle)
          }
          this.drawCircle(element.seats, element.x, element.y, element.r, element.sAngle, element.eAngle, "green")
          this.selectedTable = element
          break
        }
      }
      
      if(!foundTable) {
        this.drawCircle(this.selectedTable.seats, this.selectedTable.x, this.selectedTable.y, this.selectedTable.r, this.selectedTable.sAngle, this.selectedTable.eAngle)
        this.selectedTable = null
      }
    })
  }

  isPointInCircle(x: any, y: any, circle: any) {
    return x > circle.x - circle.r && x < circle.x + circle.r && y > circle.y - circle.r && y < circle.y + circle.r;
  }

  isReserved(x: number, y: number) {
    for (let table of this.reservedTables) {
      if(x === table.x && y === table.y) {
        return true
      }
    }
    return false
  }

  reservation2() {
    let valid = true

    if(this.reservationDateStr === "") {
      this.dateMessage = "Choose the date"
      valid = false
    } else this.dateMessage = ""

    if(this.reservationTimeStr === "") {
      this.timeMessage = "Choose the time"
      valid = false
    } else this.timeMessage = ""

    if(!this.selectedTable) {
      this.canvasMessage = "Choose the table"
      valid = false
    } else this.canvasMessage = ""
    
    if(this.selectedTable) {
      if(this.selectedTable.seats < this.reservation.seats) {
        this.seatsMessage = "There aren't enough seats"
        valid = false
      } else this.seatsMessage = ""
    } else this.seatsMessage = ""

    if (valid) {
      let [year, month, day] = this.reservationDateStr.split('-').map(Number)
      let [hours, minutes] = this.reservationTimeStr.split(':').map(Number)
      this.reservation.date = new Date(year, month - 1, day, hours, minutes)
      this.reservation.table = this.selectedTable
      
      let reservationEnd = new Date(year, month - 1, day, hours + 3, minutes)
      let dayInWeek = this.reservation.date.getDay()
      let hoursEndNum = reservationEnd.getHours() + 24 * (reservationEnd.getDay() - this.reservation.date.getDay())
      let hoursEnd = hoursEndNum.toString().padStart(2, '0')
      let minutesEnd = reservationEnd.getMinutes().toString().padStart(2, '0')
      const timeEndString = `${hoursEnd}:${minutesEnd}`
      
      if(this.restaurant.workingTime[dayInWeek].start > this.reservationTimeStr ||
        this.restaurant.workingTime[dayInWeek].end < timeEndString) {
          this.timeMessage = "Restaurant is closed"
          valid = false
      }

      if(valid) {
        this.reservation.description = ""
        this.reservation.waiter = ""
        this.reservation.status = "waiting"
        this.reservation.hours = 3
        this.restaurantService.reservation(this.reservation).subscribe(
          ret=> {
            if(!ret) alert("Successful reservation")
            else alert("Reservation failed")
            this.ngOnInit()
          }
        )
      }
    }
  }



  cart: any[] = []
  totalPrice: number = 0

  addToCart(dish: any) {
    const existingItem = this.cart.find(item => item.name === dish.name);
    if (existingItem) {
      existingItem.numberOfDishes += dish.numberOfDishesToAdd;
    } else {
      dish.numberOfDishes = dish.numberOfDishesToAdd
      this.cart.push(dish);
    }
    this.getTotalPrice()
  }

  removeFromCart(dish: any) {
    const index = this.cart.indexOf(dish);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.getTotalPrice()
  }

  changeQuantity(dish: any, change: number) {
    dish.numberOfDishes += change
    if (dish.numberOfDishes <= 0) {
      this.removeFromCart(dish);
    }
    this.getTotalPrice()
  }

  getTotalPrice() {
    this.totalPrice = 0
    for (let dish of this.cart) {
      if(dish.numberOfDishes > 0) this.totalPrice += dish.priceInEuros * dish.numberOfDishes
    }
  }

  order() {
    let order = new Order()
    order.guest = this.guest.username
    order.restaurantName = this.restaurant.name
    order.restaurantAddress = this.restaurant.address
    for (let dish of this.cart) {
      dish.numberOfDishesToAdd = undefined
    }
    order.cart = this.cart
    order.totalPrice = this.totalPrice
    order.status = "waiting"
    order.date = new Date()

    this.restaurantService.order(order).subscribe(
      ret=>{
        if(!ret) alert("Successful order")
        else alert("Order failed")

        for (let dish of this.cart) {
          dish.numberOfDishesToAdd = 1
        }
      }
    )
  }
}
