import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  constructor(private restaurantService: RestaurantService){}

  waiter: User = new User()
  allRestaurants: Restaurant[] = []
  allReservations: Reservation[] = []
  
  ngOnInit(): void {
    this.waiter = JSON.parse(localStorage.getItem("logged") ?? "")

    this.restaurantService.getAllRestaurants().subscribe(
      restaurants=>{
        this.allRestaurants = restaurants
        this.restaurantService.getAllReservations().subscribe(
          reservations=>{
            this.allReservations = reservations

            this.allReservations = this.allReservations.sort(
              (a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
              }
            )

            this.generateGuestsPerDays();
            this.generateGuestsInRestaurant();
            this.generateDaysInWeek();
          }
        )
      }
    )
  }

  generateGuestsPerDays() {
    const ctx = document.getElementById('guestsPerDays') as HTMLCanvasElement
    let map = new Map<string, number>();

    for(let reservation of this.allReservations) {
      if(reservation.waiter === this.waiter.username) {
        let date = new Date(reservation.date).toDateString()
        if(!map.has(date)) {
          map.set(date, reservation.seats)
        } else {
          map.set(date, (map.get(date) ?? 0) + reservation.seats)
        }
      }
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from(map.keys()),
        datasets: [{
          label: 'Number of guests per days',
          data: Array.from(map.values()),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }


  generateGuestsInRestaurant() {
    const ctx = document.getElementById('guestsInRestaurant') as HTMLCanvasElement;
    let map = new Map<string, number>();

    let waiters: string[] = []
    for (let restaurant of this.allRestaurants) {
      for (let waiter of restaurant.waiters) {
        if(waiter === this.waiter.username) {
          waiters = restaurant.waiters
          break
        }
      }
      if(waiters.length !== 0) break
    }
    
    for (let reservation of this.allReservations) {
      for (let waiter of waiters) {
        if(reservation.waiter === waiter) {
          if(!map.has(waiter)) {
            map.set(waiter, reservation.seats)
          } else {
            map.set(waiter, (map.get(waiter) ?? 0) + reservation.seats)
          }
        }
      }
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Array.from(map.keys()),
        datasets: [{
          label: 'Distribution of guests among the waiters',
          data: Array.from(map.values()),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pie Chart'
          }
        }
      }
    })
  }

  generateDaysInWeek() {
    let cntReservations = [0, 0, 0, 0, 0, 0, 0]
    let cntDays = [0, 0, 0, 0, 0, 0, 0]
    let average = [0, 0, 0, 0, 0, 0, 0]
    let currentDate = new Date()
    for (let reservation of this.allReservations) {
      let date = new Date(reservation.date)

      let differenceInMonths = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
      if(differenceInMonths < 24 && differenceInMonths >= 0) {
        cntReservations[(date.getDay() + 6) % 7]++
      }
    }

    let date24MonthsAgo = new Date()
    date24MonthsAgo.setMonth(currentDate.getMonth() - 24)
    let tempDate = new Date(date24MonthsAgo)

    while (tempDate <= currentDate) {
      cntDays[(tempDate.getDay() + 6) % 7]++
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    for (let i = 0; i < average.length; i++) {
      average[i] = cntReservations[i] / cntDays[i];
    }

    const ctx = document.getElementById('daysInWeek') as HTMLCanvasElement
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Average number of bookings in the last 24 months per day in week',
          data: average,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 52, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 52, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}
