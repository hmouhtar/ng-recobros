import { Component, ViewChild } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Observable, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'projects/recobros/src/app/shared/models/user';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';
@Component({
  selector: 'alvea-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  roles: Promise<string[]>;
  userID: string;
  user: User;
  _userFields: Field<User>[];
  userFields$: Subject<Field<User>[]>;
  userFieldsO: Observable<Field<User>[]>;
  loadingAction = false;
  @ViewChild('editUserForm') editUserForm: NgForm;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private fieldService: FieldService
  ) {
    this.userFields$ = new Subject();
    this.userFieldsO = this.userFields$.asObservable();
  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get('id') || '';
  }
  ngAfterViewInit(): void {
    (async () => {
      this.user = await this.userService.getUser(this.userID);
      this._userFields = Array.prototype.concat.apply(
        [],
        await Promise.all([
          this.fieldService.getUserFields('edit', this.editUserForm, this.user),
          this.fieldService.getUserRoleFields(
            this.user.rol,
            'edit',
            this.editUserForm,
            this.user
          )
        ])
      );

      this.userFields$.next(this._userFields);
    })();
  }
  editUser(form: NgForm): void {
    this.loadingAction = true;
    this.userService
      .editUser(this.user.id, form.value)
      .then(() => {
        this.alertService.success('Yay!');
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
