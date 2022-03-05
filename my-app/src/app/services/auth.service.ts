import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private cookieService: CookieService) {}

  getToken() {
    const token = this.cookieService.get("coco_auth");
    if (!token) {
      console.log("DNE");
      return null;
    } else {
      console.log("Token found");
      return token;
    }
  }
}
