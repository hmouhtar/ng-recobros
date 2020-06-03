import { Component, OnInit, HostListener, Input } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { RolesService } from 'projects/recobros/src/app/core/services/roles.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'projects/recobros/src/app/shared/models/user';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
@Component({
  selector: 'alvea-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  roles: Promise<string[]>;
  form: FormGroup;
  user: User;
  _userFields: Field[];
  userFields$: Subject<Field[]>;
  userFieldsO: Observable<Field[]>;
  updatingUser: boolean = false;
  constructor(
    private userService: UserService,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.form = new FormGroup({});
    this.userFields$ = new Subject();
    this.userFieldsO = this.userFields$.asObservable();
  }

  async ngOnInit() {
    this.user = await this.userService.getUser(
      this.route.snapshot.paramMap.get('id') || ''
    );

    this._userFields = Array.prototype.concat.apply(
      [],
      await Promise.all([
        this.userService.getUserFields.call(this, 'edit', this.user),
        this.userService.getRoleFields.call(
          this,
          this.user.rol,
          'edit',
          this.user
        ),
      ])
    );

    this._userFields.forEach((field) => {
      this.form.addControl(
        field.name,
        field.required
          ? new FormControl(field.value || '', Validators.required)
          : new FormControl({
              value: field.value || '',
              disabled: field.disabled,
            })
      );
    });

    this.userFields$.next(this._userFields);
  }

  async editUser(form) {
    let formData = new FormData(form);

    let formDataObj = {};

    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    this.updatingUser = true;

    this.userService
      .editUser(this.user.id, formDataObj)
      .then((res) => {
        this.alertService.success('Yay!');
      })
      .catch((err) => this.alertService.error(err.message))
      .finally(() => {
        this.updatingUser = false;
      });
  }
}
