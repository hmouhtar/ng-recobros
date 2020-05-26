import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';
import { shareReplay, map } from 'rxjs/operators';
import { Field } from '../../shared/models/field';
import { RolesService } from './roles.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _currentUser: Promise<User>;
  constructor(private http: HttpClient) {}

  register(data) {
    return this.http.post(`${Config.apiURL}/api/login/user`, data).toPromise();
  }

  editUser(userID: number, data) {
    return this.http
      .put(`${Config.apiURL}/api/manager/user/${userID}`, data)
      .toPromise();
  }

  deleteUser(username: string) {
    return this.http
      .delete(`${Config.apiURL}/api/login/user?username=${username}`, {
        responseType: 'text',
      })
      .toPromise();
  }

  getRoleFields(role: string, context: 'new' | 'edit', user?: User) {
    return Field.processField.call(
      this,
      User.getRoleFields(role).filter(
        (field) => field.context === undefined || field.context === context
      ),
      context,
      user
    );
  }

  getUserFields(context: 'new' | 'edit', user?: User): Promise<Field[]> {
    return Field.processField.call(
      this,
      User.getUserFields().filter(
        (field) => field.context === undefined || field.context === context
      ),
      context,
      user
    );
  }

  getUsers(
    page: number = 0,
    size: number = 25,
    sort: string = 'name,asc'
  ): Promise<User[]> {
    return this.http
      .get<User[]>(`${Config.apiURL}/api/manager/ownerUsers`, {
        params: {
          page: String(page),
          size: String(size),
          sort,
        },
      })
      .pipe(map((getUsersRequest) => getUsersRequest['content']))
      .toPromise();
  }

  getUser(username: string): Promise<User> {
    return this.http
      .get<User>(`${Config.apiURL}/api/login/user/${username}`)
      .toPromise();
  }

  getCurrentUser(): Promise<User> {
    if (!this._currentUser) {
      this._currentUser = this.http
        .get<User>(`${Config.apiURL}/api/manager/user`)
        .toPromise();
    }

    return this._currentUser;
  }
}
