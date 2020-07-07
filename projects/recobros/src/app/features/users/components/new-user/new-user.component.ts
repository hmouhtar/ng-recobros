import { Component, ViewChild } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Observable, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { User } from 'projects/recobros/src/app/shared/models/user';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';

@Component({
  selector: 'alvea-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  roles: Promise<string[]>;
  _userFields: Field<User>[];
  userFields$: Subject<Field<User>[]>;
  userFieldsO: Observable<Field<User>[]>;
  formChangesSubscription;
  lastFormValues = {};
  loadingAction = false;
  @ViewChild('newUserForm') newUserForm: NgForm;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private fieldService: FieldService
  ) {
    this.userFields$ = new Subject();
    this.userFieldsO = this.userFields$.asObservable();
  }

  ngAfterViewInit(): void {
    this.fieldService.getUserFields('new', this.newUserForm).then((fields) => {
      this._userFields = fields;
      this.userFields$.next(this._userFields);
    });

    this.formChangesSubscription = this.newUserForm.form.valueChanges.subscribe(
      (formValues) => {
        if (formValues.rol !== this.lastFormValues['rol']) {
          this.fieldService
            .getUserRoleFields(formValues.rol, 'new', this.newUserForm)
            .then((fields) => {
              this.userFields$.next(
                this._userFields.concat(fields).sort((a, b) => {
                  return (a.order || 999) - (b.order || 999);
                })
              );
            });
        }
        this.lastFormValues = formValues;
      }
    );
  }
  createNewUser(form: NgForm): void {
    this.loadingAction = true;
    this.userService
      .register(form.value)
      .then(() => {
        this.alertService.success('Yay!');
        this.router.navigate(['/users'], {});
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
