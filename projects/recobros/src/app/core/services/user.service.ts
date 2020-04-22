import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http.post(`${Config.apiURL}/api/login/new`, user);
  }

  getCurrentUser() {
    return this.http
      .get(`${Config.apiURL}/api/manager/user`)
      .pipe(shareReplay(1));
  }
}
