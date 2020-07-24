import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Config } from 'projects/recobros/src/constants';
import { map } from 'rxjs/operators';
import { PageRequest } from '../services/paginated.datasource';
import { Observable } from 'rxjs';
import { HttpResponse } from '../../shared/models/http-response';
import { PaginatedResponse } from '../../shared/models/paginated-response';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _currentUser: Promise<User>;
  constructor(private http: HttpClient) {}

  register(data: User): Promise<boolean> {
    return this.http
      .post<HttpResponse<[]>>(`${Config.apiURL}/api/login/user`, data)
      .toPromise()
      .then(() => true);
  }

  editUser(userID: number, data: User): Promise<boolean> {
    return this.http
      .put<HttpResponse<[]>>(
        `${Config.apiURL}/api/manager/user/${userID}`,
        data
      )
      .toPromise()
      .then(() => true);
  }

  deleteUser(username: string): Promise<boolean> {
    return this.http
      .delete<HttpResponse<[]>>(
        `${Config.apiURL}/api/login/user?username=${username}`
      )
      .toPromise()
      .then(() => true);
  }

  getUsersPage(
    request: PageRequest<User>
  ): Observable<PaginatedResponse<User>> {
    return this.http
      .get<HttpResponse<PaginatedResponse<User>>>(
        `${Config.apiURL}/api/manager/ownerUsers`,
        {
          params: {
            size: String(request.size),
            page: String(request.page),
            sort: `${request.sort?.property},${request.sort?.order}`
          }
        }
      )
      .pipe(map((res) => res['data']));
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
      .pipe(map((getUsersRequest) => getUsersRequest['data']['content']))
      .toPromise();
  }

  getUser(username: string): Promise<User> {
    return this.http
      .get<HttpResponse<User>>(`${Config.apiURL}/api/login/user/${username}`)
      .pipe(map((user) => user['data']))
      .toPromise();
  }

  getCurrentUser(): Promise<User> {
    if (!this._currentUser) {
      this._currentUser = this.http
        .get<HttpResponse<User>>(`${Config.apiURL}/api/manager/user`)
        .pipe(map((user) => user['data']))
        .toPromise();
    }
    return this._currentUser;
  }

  resetUserPassword(emailAddress: string): Promise<boolean> {
    return this.http
      .post<HttpResponse<[]>>('url', emailAddress)
      .toPromise()
      .then(() => true);
  }
}
