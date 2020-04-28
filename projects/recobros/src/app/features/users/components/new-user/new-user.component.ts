import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { RolesService } from 'projects/recobros/src/app/core/services/roles.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'alvea-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  roles: Promise<string[]>;
  selectedRoleFields$: Subject<Field[]>;
  selectedRoleFields: Observable<Field[]>;
  constructor(
    private userService: UserService,
    private rolesService: RolesService
  ) {
    this.selectedRoleFields$ = new Subject();
    this.selectedRoleFields = this.selectedRoleFields$.asObservable();
  }

  async loadRoleFields(role: string) {
    this.selectedRoleFields$.next(
      await this.rolesService.getRoleFields(role, 'new')
    );
  }
  ngOnInit(): void {
    this.roles = new Promise(async (resolve, reject) => {
      let rolesKeys = Object.keys(await this.rolesService.getAllRoles());
      let asyncFiltered = await Promise.all(
        rolesKeys.map(
          async (role) =>
            await this.rolesService.currentUserCan(`CREATE_${role}`)
        )
      );

      resolve(rolesKeys.filter((role, index) => asyncFiltered[index]));
    });
  }
}
