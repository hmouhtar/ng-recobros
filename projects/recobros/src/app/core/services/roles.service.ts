import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import { Config } from 'projects/recobros/src/constants';
import { UserService } from './user.service';
import { Role } from '../../shared/models/role';
import * as _ from 'lodash';
import { User } from '../../shared/models/user';
import { Field } from '../../shared/models/field';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private _roles: Promise<_.Dictionary<Role>>;

  constructor(private http: HttpClient, private userService: UserService) {}

  getAllRoles(): Promise<_.Dictionary<Role>> {
    if (!this._roles) {
      this._roles = this.http
        .get<Role[]>(`${Config.apiURL}/api/manager/roles`)
        .pipe(map((roles) => _.keyBy(roles, 'role')))
        .toPromise();
    }

    return this._roles;
  }

  async getRoleFields(role: string, context: 'new' | 'edit'): Promise<Field[]> {
    let allFields = User.getRoleFields(role);
    return [...allFields['regular'], ...allFields[context]];
  }

  async currentUserCan(capability: string) {
    let currentUserRoles = (await this.userService.getCurrentUser())['rol'];
    currentUserRoles = Array.isArray(currentUserRoles)
      ? currentUserRoles
      : [currentUserRoles];
    let allRoles = await this.getAllRoles();
    for (let role of currentUserRoles) {
      if (allRoles[role] && allRoles[role].capabilities.includes(capability)) {
        return true;
      }
    }
    return false;
  }
}
