//Also known as the class, contains the logic for the application's main page.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

declare var io: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  // private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  /* Initialization logic to fetch token when component is bootstrapped no matter what page */
  ngOnInit() {
    /* this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        // this.isUserAuthenticated = isAuthenticated;
      }); */
    this.authService.setToken(); // called once before anything else in App
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
    // console.log('I destroyed component!');
    // this.authListenerSubs.unsubscribe();
  }
}
