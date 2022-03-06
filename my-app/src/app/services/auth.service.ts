import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string; // authenticated JWT to be used for authorization in other parts

  constructor(private cookieService: CookieService) {}

  setToken() {
    this.token = this.cookieService.get('coco_auth');
    console.log(this.token);
  }

  getToken() {
    return this.token;
    /* const token = this.cookieService.get('coco_auth');
    if (!token) {
      console.log('DNE');
      return null;
    } else {
      console.log('Token found: ', token);
      return token;
    } */
  }

  deleteToken() {
    this.cookieService.delete('coco_auth');
  }
}
