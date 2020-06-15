import { Component, OnInit, HostListener } from "@angular/core";
import { UserService } from "projects/recobros/src/app/core/services/user.service";
import { RolesService } from "projects/recobros/src/app/core/services/roles.service";
import { Field } from "projects/recobros/src/app/shared/models/field";
import { Observable, Subject } from "rxjs";
import { NgForm } from "@angular/forms";
import { AlertService } from "projects/recobros/src/app/core/services/alert.service";
import { Router } from "@angular/router";

@Component({
  selector: "alvea-new-user",
  templateUrl: "./new-user.component.html",
  styleUrls: ["./new-user.component.scss"],
})
export class NewUserComponent implements OnInit {
  roles: Promise<string[]>;
  _userFields: Field[];
  userFields$: Subject<Field[]>;
  userFieldsO: Observable<Field[]>;
  loadingAction = false;

  @HostListener("change", ["$event"]) async loadRoleFields(event) {
    if ("rol" === event.target.getAttribute("ng-reflect-name")) {
      let role = event.target.value;
      let roleFields = await this.userService.getRoleFields(role, "new");
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
  }

  ngOnInit(): void {
    this.userService.getUserFields.call(this, "new").then((fields) => {
      this._userFields = fields;
      this.userFields$.next(this._userFields);
    });
  }

  createNewUser(form: NgForm): void {
    this.loadingAction = true;
    this.userService
      .register(form.value)
      .then(() => {
        this.alertService.success("Yay!");
        this.router.navigate(["/users"], {});
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
