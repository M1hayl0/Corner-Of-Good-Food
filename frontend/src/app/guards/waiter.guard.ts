import { CanActivateFn } from '@angular/router';
import { User } from '../models/user';

export const waiterGuard: CanActivateFn = (route, state) => {
  let waiter: User = JSON.parse(localStorage.getItem("logged") ?? "")
  if(waiter.type === "waiter") return true
  else return false
};
