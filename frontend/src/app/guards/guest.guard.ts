import { CanActivateFn } from '@angular/router';
import { User } from '../models/user';

export const guestGuard: CanActivateFn = (route, state) => {
  let guest: User = JSON.parse(localStorage.getItem("logged") ?? "")
  if(guest.type === "guest") return true
  else return false
};
