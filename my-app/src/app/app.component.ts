//Also known as the class, contains the logic for the application's main page.

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  constructor() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '';
  }
}