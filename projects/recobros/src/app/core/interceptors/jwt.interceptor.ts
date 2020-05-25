import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { Config } from 'projects/recobros/src/constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authenticationService.currentUserToken !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.currentUserToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
