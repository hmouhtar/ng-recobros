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
    // add authorization header with jwt token if available
    console.log(request.url);
    if (request.url === `${Config.apiURL}/api/manager/roles`) {
      console.log('Yohooo');
      return of(
        new HttpResponse({
          status: 200,
          body: [
            {
              role: 'COMPANY_MANAGER',
              capabilities: ['CREATE_EMPLOYEE_MANAGER', 'cap2'],
            },
            {
              role: 'EMPLOYEE_MANAGER',
              capabilities: ['CREATE_COMPANY_MANAGER', 'cap2'],
            },
            { role: 'EMPLOYEE', capabilities: ['cap1', 'cap2'] },
          ],
        })
      );
    }
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
