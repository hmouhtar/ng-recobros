import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AlertService } from '../../core/services/alert.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenExpirationDate;
  private isUserLoggedIn$: BehaviorSubject<boolean>;
  public isUserLoggedInO: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
    ) {
    this.isUserLoggedIn$ = new BehaviorSubject<boolean>(
      this.currentUserToken !== null
    );

    this.isUserLoggedInO = this.isUserLoggedIn$.asObservable();
  }

  public get currentUserToken() {
    try {
      let token = localStorage.getItem('token');
      if (token !== null && !this.tokenExpirationDate) {
        this.tokenExpirationDate =
          Number(JSON.parse(atob(token.split('.')[1]))['exp']) * 1000;
      }
      if (token !== null && new Date(this.tokenExpirationDate) < new Date()) {
        localStorage.removeItem('token');
        this.tokenExpirationDate = null;
        return null;
      }
      return token;
    } catch (error) {
      console.log(error);
      this.alertService.error('LocalStorage blocked by browser. Please enable cookies.');
      //this.alertService.subscribe(arg => this.property = arg);
      
    }
    return null;
  }


  public get isUserLoggedIn() {
    return this.isUserLoggedIn$.value;
  }

  login(userCredential: string, password: string) {
    return this.http
      .post(
        `${Config.apiURL}/api/login/user/doLogin`,
        {
          userCredential,
          password,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res);
          this.isUserLoggedIn$.next(true);
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
