import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false;
  private token: string; // authenticated JWT to be used for authorization in other parts
  private authStatusListener = new BehaviorSubject<boolean>(false); // "push" auth status to rest of app

  constructor(private cookieService: CookieService) {}

  setToken() {
    this.token = this.cookieService.get('coco_auth');

    if (this.token) {
      this.isAuth = true;
      this.authStatusListener.next(true); // tell rest of app that authenticated
    }
    // console.log(this.token);
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

  deleteTokenInCookie() {
    this.cookieService.delete('coco_auth');
  }

  // return something that's "subscribable" to indicate global auth status
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {
    this.token = "";
    this.deleteTokenInCookie();
    this.authStatusListener.next(false); // tell rest of app that we logged out
  }

  getIsAuth() {
    return this.isAuth;
  }
}
