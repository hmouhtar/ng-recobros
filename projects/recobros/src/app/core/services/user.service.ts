import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http.post(`${Config.apiURL}/api/login/new`, user);
  }
}
