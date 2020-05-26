import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { RolesService } from 'projects/recobros/src/app/core/services/roles.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'alvea-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  roles: Promise<string[]>;
  form: FormGroup;
  _userFields: Field[];
  userFields$: Subject<Field[]>;
  userFieldsO: Observable<Field[]>;
  loadingAction: boolean = false;

  @HostListener('change', ['$event']) async loadRoleFields(event) {
    if ('rol' === event.target.name) {
      let role = event.target.value;
      let roleFields = await this.userService.getRoleFields(role, 'new');
      roleFields.forEach((field) => {
        this.form.addControl(
          field.name,
          field.required
            ? new FormControl(field.value || '', Validators.required)
            : new FormControl(field.value || '')
        );
      });
      let fields = this._userFields.slice();
      fields.splice(-1, 0, ...roleFields);

      this.userFields$.next(fields);
    }
  }

  constructor(
    private userService: UserService,
    private rolesService: RolesService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.userFields$ = new Subject();
    this.userFieldsO = this.userFields$.asObservable();
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.userService.getUserFields.call(this, 'new').then((fields) => {
      this._userFields = fields;
      this._userFields.forEach((field) => {
        this.form.addControl(
          field.name,
          field.required
            ? new FormControl(field.value || '', Validators.required)
            : new FormControl(field.value || '')
        );
      });
      this.userFields$.next(this._userFields);
    });
  }
  createNewUser(form) {
    let formData = new FormData(form);
    let formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    this.loadingAction = true;
    this.userService
      .register(formDataObj)
      .then((res) => {
        this.alertService.success('Yay!');
        this.router.navigate(['/users'], {});
      })
      .catch((err) => this.alertService.error(err.message))
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
