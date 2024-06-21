import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dish } from 'src/app/models/dish';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-restaurants-admin',
  templateUrl: './restaurants-admin.component.html',
  styleUrls: ['./restaurants-admin.component.css']
})
export class RestaurantsAdminComponent implements OnInit {
  constructor(private restaurantService: RestaurantService, private userService: UserService) {}
  
  ngOnInit(): void {
    this.canvasInit()

    for (let i = 0; i < 7; i++) {
      this.newRestaurant.workingTime.push({"start": "00:00", "end": "00:00"})
    }

    this.restaurantsInit()
  }

  allRestaurants: Restaurant[] = []
  restaurants: Restaurant[] = []
  allReservations: Reservation[] = []

  nameAsc = true
  addressAsc = true
  typeAsc = true

  nameSearch: string = ""
  addressSearch: string = ""
  typeSearch: string = ""

  restaurantsInit() {
    this.userService.getAllWaiters().subscribe(
      allWaiters=>{
        this.restaurantService.getAllRestaurants().subscribe(
          allRestaurants=>{
            this.allRestaurants = allRestaurants
            this.restaurants = allRestaurants
            for(let restaurant of this.allRestaurants) {
              let waitersNamesArray: string[] = []
              for(let waiter of restaurant.waiters) {
                for(let waiter2 of allWaiters) {
                  if(waiter2.username === waiter) {
                    waitersNamesArray.push(waiter2.firstName + " " + waiter2.lastName)  
                  }
                }
              }
              restaurant.waitersNamesString = waitersNamesArray.join(", ")
            }

            this.restaurantService.getAllReservations().subscribe(
              allReservations=>{
                this.allReservations = allReservations

                for(let restaurant of this.allRestaurants) {
                  restaurant.averageRating = 0.0
                  restaurant.numOfRatings = 0
                }

                for(let reservation of this.allReservations) {
                  if(reservation.rating !== undefined) {
                    for (let restaurant of allRestaurants) {
                      if(reservation.restaurantName === restaurant.name && 
                        reservation.restaurantAddress === restaurant.address) {
                          restaurant.averageRating += reservation.rating
                          restaurant.numOfRatings++
                          break;
                      }
                    }
                  }
                }

                for(let restaurant of this.allRestaurants) {
                  if(restaurant.numOfRatings > 0) {
                    restaurant.averageRating /= restaurant.numOfRatings
                  }
                }
              }
            )
          }
        )
      }
    )
  }

  sortRestaurants(param: string) {
    if((this as any)[`${param}Asc`]) {
      this.restaurants.sort((a, b) => {
        if ((a as any)[`${param}`] < (b as any)[`${param}`]) { return -1; }
        if ((a as any)[`${param}`] > (b as any)[`${param}`]) { return 1; }
        return 0;
      });
      (this as any)[`${param}Asc`] = false
    } else {
      this.restaurants.sort((a, b) => {
        if ((a as any)[`${param}`] < (b as any)[`${param}`]) { return 1; }
        if ((a as any)[`${param}`] > (b as any)[`${param}`]) { return -1; }
        return 0;
      });
      (this as any)[`${param}Asc`] = true
    }
  }

  search() {
    this.restaurants = this.allRestaurants.filter(restaurant => {
      return (this.nameSearch ? restaurant.name.toLowerCase().includes(this.nameSearch.toLowerCase()) : true) &&
             (this.addressSearch ? restaurant.address.toLowerCase().includes(this.addressSearch.toLowerCase()) : true) &&
             (this.typeSearch ? restaurant.type.toLowerCase().includes(this.typeSearch.toLowerCase()) : true)
    })
  }

  stars: number[] = [1, 2, 3, 4, 5];
  isHalfFilled(i: number, rating: number): boolean {
    return i - 0.5 <= rating && rating < i
  }




  @ViewChild("canvas", {static: true}) canvasRef!: ElementRef
  @ViewChild("kitchen", {static: true}) kitchenRef!: ElementRef
  @ViewChild("wc", {static: true}) wcRef!: ElementRef
  @ViewChild("table", {static: true}) tableRef!: ElementRef
  @ViewChild("clear", {static: true}) clearRef!: ElementRef
  canvas: any
  kitchen: any
  wc: any
  table: any
  clear: any
  context: any

  prevMouseX: number = 0
  prevMouseY: number = 0
  snapshot: any
  isDrawing: boolean = false
  selectedTool: string = "kitchen"

  seats: number = 4
  elements: Array<any> = []
  elementsOverlap: Array<any> = []
  lastDraw: any

  newRestaurant: Restaurant = new Restaurant()
  message: string = ""
  
  canvasInit() {
    this.canvas = this.canvasRef.nativeElement
    this.kitchen = this.kitchenRef.nativeElement
    this.wc = this.wcRef.nativeElement
    this.table = this.tableRef.nativeElement
    this.clear = this.clearRef.nativeElement
    this.context = this.canvas.getContext("2d")
    
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.context.lineWidth = 5

    this.context.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40)
    this.context.strokeRect(40, 100, this.canvas.width - 80, this.canvas.height - 140)
    this.drawRestaurantName()

    this.canvas.addEventListener("mousedown", this.startDraw.bind(this))
    this.canvas.addEventListener("mousemove", this.drawing.bind(this))
    this.canvas.addEventListener("mouseup", this.endDraw.bind(this))

    this.clear.addEventListener("click", () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.elements = []
      this.elementsOverlap = []
      this.context.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40)
      this.context.strokeRect(40, 100, this.canvas.width - 80, this.canvas.height - 140)
      this.drawRestaurantName()
    })

    this.kitchen.addEventListener("click", () => {
      this.selectedTool = "kitchen"
      this.wc.classList.remove("active")
      this.table.classList.remove("active")
      this.kitchen.classList.add("active")
    })

    this.wc.addEventListener("click", () => {
      this.selectedTool = "wc"
      this.kitchen.classList.remove("active")
      this.table.classList.remove("active")
      this.wc.classList.add("active")
    })

    this.table.addEventListener("click", () => {
      this.selectedTool = "table"
      this.kitchen.classList.remove("active")
      this.wc.classList.remove("active")
      this.table.classList.add("active")
    })
  }

  drawRestaurantName() {
    this.context.strokeRect(40, 40, 400, 40)
    this.context.fillStyle = "#fcf4bc"
    this.context.fillRect(40, 40, 400, 40)
    this.context.fillStyle = "black"
    
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(this.newRestaurant.name, 40 + 400 / 2, 40 + 40 / 2);
  }

  startDraw(e: any) {
    if(!this.isOverlap({"x": e.offsetX, "y": e.offsetY, "width": 0, "height": 0}) 
      && e.offsetX >= 40 && e.offsetX <= 40 + this.canvas.width - 80 && e.offsetY >= 100 && e.offsetY <=  100 + this.canvas.height - 140) {
      this.isDrawing = true
      this.prevMouseX = e.offsetX
      this.prevMouseY = e.offsetY
      this.context.beginPath()
      this.snapshot = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  drawing(e: any) {
    if(!this.isDrawing) return

    if(this.selectedTool !== "table") {
      if(!this.isOverlap({"x": e.offsetX, "y": e.offsetY, "width": this.prevMouseX - e.offsetX, "height": this.prevMouseY - e.offsetY})
        && e.offsetX >= 40 && e.offsetX <= 40 + this.canvas.width - 80 && e.offsetY >= 100 && e.offsetY <=  100 + this.canvas.height - 140) {
        this.context.putImageData(this.snapshot, 0, 0)
  
        if(this.selectedTool === "wc") {
          this.drawWc(e)
        } else if(this.selectedTool === "kitchen") {
          this.drawKitchen(e)
        }
      }
    } else {
      const centerX = this.prevMouseX
      const centerY = this.prevMouseY
      const radius = Math.sqrt(Math.pow((this.prevMouseX - e.offsetX), 2) + Math.pow((this.prevMouseY - e.offsetY), 2))

      if(this.isOverlap({"x": centerX - radius, "y": centerY - radius, "width": 2 * radius, "height": 2 * radius})) return
  
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const pointX = centerX + radius * Math.cos(angle)
        const pointY = centerY + radius * Math.sin(angle)
        if(pointX < 40 || pointX > 40 + this.canvas.width - 80 || pointY < 100 || pointY > 100 + this.canvas.height - 140) return
      }

      this.context.putImageData(this.snapshot, 0, 0)
      this.drawTable(e)
    }
  }

  drawKitchen(e: any) {
    this.context.strokeRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY)
    this.lastDraw = {"type": "Kitchen", "x": e.offsetX, "y": e.offsetY, "width": this.prevMouseX - e.offsetX, "height": this.prevMouseY - e.offsetY}
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText("Kitchen", this.prevMouseX + (e.offsetX - this.prevMouseX) / 2, this.prevMouseY + (e.offsetY - this.prevMouseY) / 2)
  }

  drawWc(e: any) {
    this.context.strokeRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY)
    this.lastDraw = {"type": "Wc", "x": e.offsetX, "y": e.offsetY, "width": this.prevMouseX - e.offsetX, "height": this.prevMouseY - e.offsetY}
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText("Wc", this.prevMouseX + (e.offsetX - this.prevMouseX) / 2, this.prevMouseY + (e.offsetY - this.prevMouseY) / 2)
  }

  drawTable(e: any) {
    this.context.beginPath()
    let radius = Math.sqrt(Math.pow((this.prevMouseX - e.offsetX), 2) + Math.pow((this.prevMouseY - e.offsetY), 2))
    this.context.arc(this.prevMouseX, this.prevMouseY, radius, 0, 2 * Math.PI)
    this.lastDraw = {"type": "Table", "seats": this.seats, "x": this.prevMouseX, "y": this.prevMouseY, "r": radius, "sAngle": 0, "eAngle": 2 * Math.PI}
    this.context.stroke()
    this.context.font = "20px Arial"
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.fillText(this.seats, this.prevMouseX, this.prevMouseY)
  }

  normalizeRect(rect: any) {
    const normalizedRect = { ...rect };
  
    if (rect.width < 0) {
      normalizedRect.x += rect.width;
      normalizedRect.width = Math.abs(rect.width);
    }
  
    if (rect.height < 0) {
      normalizedRect.y += rect.height;
      normalizedRect.height = Math.abs(rect.height);
    }
  
    return normalizedRect;
  }

  isRectangleOverlap(newRect: any, existingRect: any): boolean {
    const normNewRect  = this.normalizeRect(newRect);
    const normExistingRect = this.normalizeRect(existingRect);

    return !(
      normNewRect.x > normExistingRect.x + normExistingRect.width ||
      normNewRect.x + normNewRect.width < normExistingRect.x ||
      normNewRect.y > normExistingRect.y + normExistingRect.height ||
      normNewRect.y + normNewRect.height < normExistingRect.y
    );
  }
  
  isOverlap(newElement: any): boolean {
    for(let existingRect of this.elementsOverlap) {
      if(this.isRectangleOverlap(newElement, existingRect)) {
        return true;
      }
    }
    return false;
  }

  endDraw() {
    if(this.lastDraw) {
      this.isDrawing = false
      this.elements.push(this.lastDraw)
      if(this.lastDraw.type !== "Table") this.elementsOverlap.push(this.lastDraw)
      else this.elementsOverlap.push({"type": "Table", "x": this.lastDraw.x - this.lastDraw.r, "y": this.lastDraw.y - this.lastDraw.r, "width": 2 * this.lastDraw.r, "height": 2 * this.lastDraw.r})
    }
 }

  saveRestaurant() {
    let kitchenCount = 0
    let wcCount = 0
    let tableCount = 0
    for(let element of this.elements) {
      if(element.type === "Kitchen") kitchenCount++
      else if(element.type === "Wc") wcCount++
      else if(element.type === "Table") tableCount++
    }

    if(this.newRestaurant.name === "") this.message = "Enter restaurant name"
    else if(this.newRestaurant.address === "") this.message = "Enter restaurant address"
    else if(this.newRestaurant.type === "") this.message = "Enter restaurant type"
    else if(this.newRestaurant.phone === "") this.message = "Enter restaurant phone"
    else if(kitchenCount < 1) this.message = "There must be at least one kitchen"
    else if(wcCount < 1) this.message = "There must be at least one wc"
    else if(tableCount < 3) this.message = "There must be at least 3 tables"
    else {
      this.message = ""
      this.newRestaurant.canvas = this.elements
      this.newRestaurant.menu = []
      this.newRestaurant.waiters = []
      
      this.restaurantService.saveRestaurant(this.newRestaurant).subscribe(
        ret=> {
          if(!ret) alert("Successful restaurant save")
          else alert("Restaurant save failed")
        }
      )
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      try {
        this.elements = JSON.parse(content)
        for (let element of this.elements) {
          if(element.type !== "Table") this.elementsOverlap.push(element)
          else this.elementsOverlap.push({"type": "Table", "x": element.x - element.r, "y": element.y - element.r, "width": 2 * element.r, "height": 2 * element.r})
          
          if(element.type == "Kitchen" || element.type == "Wc") {
            this.drawRect(element.type, element.x, element.y, element.width, element.height)
          } else if(element.type == "Table") {
            this.drawCircle(element.seats, element.x, element.y, element.r, element.sAngle, element.eAngle)
          }
        }
      } catch (error) {
        alert("Error")
      }
    }

    if (file) {
      reader.readAsText(file)
    } else {
      alert("Error")
    }
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



  restaurantForDish: Restaurant = new Restaurant()
  newDish: Dish = new Dish()
  dishImage: File | null = null;
  dishMessage: string = ""

  dishImageProcess(event: any) {
    const reader = new FileReader()
    const file = event.target.files[0]
    
    reader.onload = (e: any) => {
      const img = new Image()
      img.onload = () => {
        this.dishImage = file
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file);
  }

  addDish() {
    if(this.newDish.name === "" || this.newDish.ingredients === "" || !this.dishImage) {
      this.dishMessage = "Input all data for dish"
    } else {
      this.dishMessage = ""
      this.newDish.numberOfDishes = undefined
      this.newDish.numberOfDishesToAdd = undefined
      this.newDish.dishImageName =  "menu_image_" + this.dishImage.name

      this.restaurantService.addDish(this.restaurantForDish.name, this.restaurantForDish.address, this.newDish).subscribe(
        ret=>{
          if(!ret) alert("Dish successfully added")
          else alert("Dish addition failed")

          if(this.dishImage) {
            const formData = new FormData()
            formData.append("file", this.dishImage)
            this.restaurantService.dishImage(formData).subscribe()
          }
        }
      )
    }
  }

}
