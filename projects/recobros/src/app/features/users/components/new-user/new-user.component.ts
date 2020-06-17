import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
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
  formChangesSubscription;
  lastFormValues = {};
  loadingAction = false;
  @ViewChild("newUserForm") newUserForm: NgForm;

  // @HostListener("change", ["$event"]) async loadRoleFields(event) {
  //   if ("rol" === event.target.getAttribute("ng-reflect-name")) {
  //     console.log("Changed");
  //     let role = event.target.value;
  //     let roleFields = await this.userService.getRoleFields(role, "new");
  //     console.log(role);
  //     let fields = this._userFields.slice();
  //     fields.splice(-1, 0, ...roleFields);
  //     this.userFields$.next(fields);
  //   }
  // }

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
      console.log(this._userFields);
      this.userFields$.next(this._userFields);
    });
  }

  ngAfterViewInit(): void {
    this.formChangesSubscription = this.newUserForm.form.valueChanges.subscribe((formValues) => {
      if (formValues.rol !== this.lastFormValues["rol"]) {
        console.log("Value is:", formValues.rol);
        this.userService.getRoleFields(formValues.rol, "new").then((fields) => {
          console.log("Fields are:", fields);
          this.userFields$.next(
            this._userFields.concat(fields).sort((a, b) => {
              return (a.order || 999) - (b.order || 999);
            })
          );
        });
      }

      this.lastFormValues = formValues;
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
