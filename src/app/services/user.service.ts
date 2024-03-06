// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userRol: string = '';

  setUserRol(rol: string) {
    this.userRol = rol;
  }

  getUserRol(): string {
    return this.userRol;
  }
}
