import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private isUserLoggedIn$: BehaviorSubject<boolean>;
  public isUserLoggedInO: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    this.isUserLoggedIn$ = new BehaviorSubject<boolean>(
      this.currentUserToken !== null
    );

    this.isUserLoggedInO = this.isUserLoggedIn$.asObservable();
  }

  public get currentUserToken() {
    return localStorage.getItem('token');
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
    this.router.navigate(['login']);
  }
}
