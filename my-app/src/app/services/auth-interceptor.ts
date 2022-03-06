import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Intercept all outgoing HTTP requests containing <any> data
// and add a header
// next: kinda like middleware; leave interceptor & go back to request cycle
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();

    // clone outgoing request to edit -> avoids side-effects
    const authRequest = req.clone({
      // OG headers + new header -> (should match backend)
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next.handle(authRequest); // forward the modified HTTP request to other parts
  }
}
