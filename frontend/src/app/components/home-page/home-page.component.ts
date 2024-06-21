import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { UserService } from 'src/app/services/user/user.service';
import { Reservation } from 'src/app/models/reservation';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(private restaurantService: RestaurantService, private userService: UserService){}

  totalRestaurants: number = 0
  totalGuests: number = 0
  allRestaurants: Restaurant[] = []
  restaurants: Restaurant[] = []
  allReservations: Reservation[] = []

  nameAsc = true
  addressAsc = true
  typeAsc = true

  nameSearch: string = ""
  addressSearch: string = ""
  typeSearch: string = ""

  last24Hours: number = 0
  last7Days: number = 0
  lastMonth: number = 0

  ngOnInit(): void {
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
    
            this.totalRestaurants = this.allRestaurants.length
    
            this.userService.getTotalGuests().subscribe( 
              totalGuests=> {
                this.totalGuests = totalGuests

                this.restaurantService.getAllReservations().subscribe(
                  allReservations=>{
                    this.allReservations = allReservations

                    let now = new Date()
                    for(let reservation of this.allReservations) {
                      const differenceInDays = (now.getTime() - new Date(reservation.date).getTime()) / (1000 * 60 * 60 * 24)
                      console.log(differenceInDays)
                      console.log(new Date(reservation.date))
                      if(differenceInDays <= 1 && differenceInDays >= 0) this.last24Hours++
                      if(differenceInDays <= 7 && differenceInDays >= 0) this.last7Days++
                      if(differenceInDays <= 30 && differenceInDays >= 0) this.lastMonth++
                    }
                  }
                )
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
}
