import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent {
  constructor(private router: Router){}

  logout() {
    localStorage.removeItem("logged")
    this.router.navigate(["login"])
  }
}
