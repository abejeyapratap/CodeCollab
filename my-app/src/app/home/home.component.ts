import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
      });
    this.authService.setToken();
  }

  ngOnDestroy() {
    // console.log('I destroyed component!');
    this.authListenerSubs.unsubscribe();
  }

  onLogin() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  onLogout() {
    this.authService.logout();
  }
}
