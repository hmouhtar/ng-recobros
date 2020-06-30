import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';
import { map } from 'rxjs/operators';
import { Field } from '../../shared/models/field';
import { PageRequest, Page } from '../services/paginated.datasource';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _currentUser: Promise<User>;
  constructor(private http: HttpClient) {}

  register(data): Promise<any> {
    return this.http.post(`${Config.apiURL}/api/login/user`, data).toPromise();
  }

  editUser(userID: number, data): Promise<any> {
    return this.http
      .put(`${Config.apiURL}/api/manager/user/${userID}`, data)
      .toPromise();
  }

  deleteUser(username: string): Promise<any> {
    return this.http
      .delete(`${Config.apiURL}/api/login/user?username=${username}`)
      .toPromise();
  }

  getRoleFields(
    role: string,
    context: 'new' | 'edit',
    user?: User
  ): Promise<Field[]> {
    console.log(role);
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
  getUsersPage(request: PageRequest<User>): Observable<Page<User>> {
    return this.http.get<Page<User>>(
      `${Config.apiURL}/api/manager/ownerUsers`,
      {
        params: {
          size: String(request.size),
          page: String(request.page),
          sort: `${request.sort?.property},${request.sort?.order}`
        }
      }
    );
    // .pipe(map((res) => res["data"]));
  }

  getUsers(page = 0, size = 25, sort = 'name,asc'): Promise<User[]> {
    return this.http
      .get<User[]>(`${Config.apiURL}/api/manager/ownerUsers`, {
        params: {
          page: String(page),
          size: String(size),
          sort
        }
      })
      .pipe(map((getUsersRequest) => getUsersRequest['content']))
      .toPromise();
  }

  getUser(username: string): Promise<User> {
    return this.http
      .get<User>(`${Config.apiURL}/api/login/user/${username}`)
      .pipe(map((user) => user['data']))
      .toPromise();
  }

  getCurrentUser(): Promise<User> {
    if (!this._currentUser) {
      this._currentUser = this.http
        .get<User>(`${Config.apiURL}/api/manager/user`)
        .pipe(map((user) => user['data']))
        .toPromise();
    }
    return this._currentUser;
  }

  resetUserPassword(emailAddress: string): Promise<any> {
    console.log(emailAddress);
    return this.http.post('url', emailAddress).toPromise();
  }
}
