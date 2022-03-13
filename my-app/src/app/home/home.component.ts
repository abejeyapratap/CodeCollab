import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authListenerSubs: Subscription;
  user: User | null;

  // fetch token on page re-load & start timer
  /* @HostListener('window:load')
  onLoad() {
    // console.log('setting token');
    this.authService.setToken();
    if (this.authService.getToken()) {
      this.authService.setTokenTimer();
    }
  } */

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
        this.user = this.authService.getUser(); // update user upon change
      });
    // this.authService.setToken(); // maybe delete?
  }

  ngOnDestroy() {
    // console.log('I destroyed component!');
    this.authListenerSubs.unsubscribe();
  }

  onLogin() {
    window.location.href = environment.apiUrl + '/auth/google';
  }

  onLogout() {
    this.authService.logout();
  }
}
