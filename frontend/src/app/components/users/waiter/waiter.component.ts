import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent {
  constructor(private router: Router){}

  logout() {
    localStorage.removeItem("logged")
    this.router.navigate(["login"])
  }
}
