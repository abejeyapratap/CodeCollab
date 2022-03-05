import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogin() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  onGetToken() {
    this.authService.getToken();
  }
}
