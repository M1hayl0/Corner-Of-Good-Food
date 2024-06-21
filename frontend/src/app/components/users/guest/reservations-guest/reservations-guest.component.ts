import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { User } from 'src/app/models/user';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-reservations-guest',
  templateUrl: './reservations-guest.component.html',
  styleUrls: ['./reservations-guest.component.css']
})
export class ReservationsGuestComponent implements OnInit {
  constructor(private restaurantService: RestaurantService){}

  guest: User = new User()
  guestAllReservations: Reservation[] = []
  currentReservations: Reservation[] = []
  outOfDateReservations: Reservation[] = []
  today: Date = new Date()
  
  stars: number[] = [1, 2, 3, 4, 5]
  currentRating = 0

  ngOnInit(): void {
    this.guest = JSON.parse(localStorage.getItem("logged") ?? "")

    this.restaurantService.getAllReservationsGuest(this.guest.username).subscribe(
      reservations => {
        this.guestAllReservations = reservations
        this.currentReservations = []
        this.outOfDateReservations = []

        for(let reservation of this.guestAllReservations) {
          reservation.rating2 = 1
          if(new Date(reservation.date) >= this.today) {
            this.currentReservations.push(reservation)
          } else {
            this.outOfDateReservations.push(reservation)
          }
        }

        this.outOfDateReservations.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }
    )
  }

  cancelReservation(reservation: Reservation) {
    if(((new Date(reservation.date).getTime() - this.today.getTime()) / (1000 * 60)) < 45) {
      alert("It is to late to cancel this reservation.")
    } else {
      this.restaurantService.cancelReservation(reservation).subscribe(
        ret=>{
          if(!ret) alert("Successful cancelation")
          else alert("Cancelation failed")
          this.ngOnInit()
        }
      )
    }
  }

  isHalfFilled(i: number, rating: number): boolean {
    return i - 0.5 <= rating && rating < i
  }

  rate(reservation: Reservation) {
    if(!reservation.comment2 || !reservation.rating2) alert("Enter a comment and rating")
    else if(reservation.guestAppeared === false) alert("You can't rate this reservation. You didn't appear at the restaurant.")
    else {
      reservation.comment = reservation.comment2
      reservation.rating = reservation.rating2

      this.restaurantService.rate(reservation).subscribe(
        ret=>{
          if(!ret) alert("Successful rating")
          else alert("Rating failed")
          this.ngOnInit()
        }
      )
    }
  }

  setRating(rating: number, reservation: Reservation) {
    reservation.rating2 = rating;
  }

  dateMoreThan45MinutesAgo(date: Date) {
    const currentTime = new Date();
    const timeDifference =  new Date(date).getTime() - currentTime.getTime();
    const minutesDifference = timeDifference / (1000 * 60);
    return minutesDifference >= 45;
  }
}
