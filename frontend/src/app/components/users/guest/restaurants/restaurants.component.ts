import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent {
  constructor(private restaurantService: RestaurantService, private userService: UserService, private router: Router){}

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

                    let now = new Date()
                    for(let reservation of this.allReservations) {
                      const differenceInDays = (now.getTime() - new Date(reservation.date).getTime()) / (1000 * 60 * 60 * 24)
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

  stars: number[] = [1, 2, 3, 4, 5];
  isHalfFilled(i: number, rating: number): boolean {
    return i - 0.5 <= rating && rating < i
  }

  navigateToRestaurant(restaurant: Restaurant) {
    localStorage.setItem("restaurant", JSON.stringify(restaurant))
    this.router.navigate(["guest/restaurants/restaurant"]);
  }

}
