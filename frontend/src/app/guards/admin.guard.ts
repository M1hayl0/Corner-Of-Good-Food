import { CanActivateFn } from '@angular/router';
import { User } from '../models/user';

export const adminGuard: CanActivateFn = (route, state) => {
  let admin: User = JSON.parse(localStorage.getItem("logged") ?? "")
  if(admin.type === "admin") return true
  else return false
};
