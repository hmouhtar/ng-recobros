import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Config } from 'projects/recobros/src/constants';
import { AlertService } from '../../core/services/alert.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenExpirationDate;
  private isUserLoggedIn$: BehaviorSubject<boolean>;
  public isUserLoggedInO: Observable<boolean>;

  constructor(private http: HttpClient, private alertService: AlertService) {
    this.isUserLoggedIn$ = new BehaviorSubject<boolean>(
      this.currentUserToken !== null
    );

    this.isUserLoggedInO = this.isUserLoggedIn$.asObservable();
  }

  public get currentUserToken(): string | null {
    let token;
    try {
      token = localStorage.getItem('token');
    } catch (error) {
      token = null;
      console.error(error);
      this.alertService.error(
        'LocalStorage blocked by browser. Please enable cookies.'
      );
    }

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
  }

  public get isUserLoggedIn(): boolean {
    return this.isUserLoggedIn$.value;
  }

  login(userCredential: string, password: string): Promise<any> {
    return this.http
      .post(`${Config.apiURL}/api/login/user/doLogin`, {
        userCredential,
        password
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res['data']);
          this.isUserLoggedIn$.next(true);
        })
      )
      .toPromise();
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
