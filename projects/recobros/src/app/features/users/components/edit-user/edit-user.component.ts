import { Component, OnInit } from "@angular/core";
import { UserService } from "projects/recobros/src/app/core/services/user.service";
import { Field } from "projects/recobros/src/app/shared/models/field";
import { Observable, Subject } from "rxjs";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { User } from "projects/recobros/src/app/shared/models/user";
import { AlertService } from "projects/recobros/src/app/core/services/alert.service";
@Component({
  selector: "alvea-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent implements OnInit {
  roles: Promise<string[]>;
  user: User;
  _userFields: Field[];
  userFields$: Subject<Field[]>;
  userFieldsO: Observable<Field[]>;
  loadingAction = false;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.userFields$ = new Subject();
    this.userFieldsO = this.userFields$.asObservable();
  }

  ngOnInit(): void {
    (async () => {
      this.user = await this.userService.getUser(
        this.route.snapshot.paramMap.get("id") || ""
      );

      this._userFields = Array.prototype.concat.apply(
        [],
        await Promise.all([
          this.userService.getUserFields.call(this, "edit", this.user),
          this.userService.getRoleFields.call(
            this,
            this.user.rol,
            "edit",
            this.user
          ),
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
        this.alertService.success("Yay!");
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
