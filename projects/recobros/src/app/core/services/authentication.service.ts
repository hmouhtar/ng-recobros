import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    let storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    if (storedUser !== null) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserToken(): string {
    return localStorage.getItem('token') || '';
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isUserLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(userCredential: string, password: string) {
    return this.http
      .post<any>(`${Config.apiURL}/api/login/user/doLogin`, {
        userCredential,
        password,
      })
      .pipe(
        map((user: User) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
