//Also known as the class, contains the logic for the application's main page.

import { Component } from '@angular/core';

declare var io: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  // constructor() {
  //   let socketScript = document.createElement('script');
  //   let googleScript = document.createElement('script');
  //   socketScript.type = 'text/javascript';
  //   googleScript.type = 'text/javascript';
  //   socketScript.src = 'https://cdn.socket.io/4.4.1/socket.io.min.js';
  //   googleScript.src = 'https://apis.google.com/js/platform.js';
  //   socketScript.onload = () => {
  //     let socket = io('localhost:3000');
  //   }
  //   document.getElementsByTagName('head')[0].appendChild(socketScript);
  //   document.getElementsByTagName('head')[0].appendChild(googleScript);
  // }
}
