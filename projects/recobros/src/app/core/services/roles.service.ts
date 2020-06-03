import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from 'projects/recobros/src/constants';
import { UserService } from './user.service';
import * as _ from 'lodash';
import { Role } from '../../shared/models/role';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private _roles: any;

  constructor(private http: HttpClient, private userService: UserService) {}

  // Get a list of all existing user roles.
  getAllRoles(): Promise<Role[]> {
    if (!this._roles) {
      this._roles = this.http
        .get(`${Config.apiURL}/api/capabilities/`)
        .pipe(
          map((roles: Array<any>) => {
            roles.map((role) => {
              role.capabilities = role.capabilities.reduce(
                (a, b) => a.concat([b.name]),
                []
              );
              return role;
            });
            return roles;
          })
        )
        .toPromise();
    }

    return this._roles;
  }

  // Get editable roles for current user.
  async getEditableRoles(): Promise<string[]> {
    let rolesKeys = (await this.getAllRoles()).map((role) => role.rolName);
    let asyncFiltered = await Promise.all(
      rolesKeys.map(async (role) => await this.currentUserCan(`CREATE_${role}`))
    );
    return rolesKeys.filter((role, index) => asyncFiltered[index]);
  }

  // Check if current user has a capability.
  async currentUserCan(capability: string) {
    // Empty capability means all users can do it.
    if (!capability.length) {
      return true;
    }

    // Get the current user and all the roles.
    return Promise.all([
      this.userService.getCurrentUser(),
      this.getAllRoles(),
    ]).then((res) => {
      let [currentUser, allRoles] = res;

      // Find current user's role object to get a list of all the capabilities belonging to that role.
      let currentUserRolObj = allRoles.find(
        (role) => role.rolName === currentUser.rol
      );

      // Check if the object exists and has the referenced capability.
      return (
        currentUserRolObj && currentUserRolObj.capabilities.includes(capability)
      );
    });
  }
}
