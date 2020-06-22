import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService } from "../../core/services/alert.service";
import { AuthenticationService } from "../../core/services/authentication.service";

import { UserService } from "../../core/services/user.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide = true;

  @ViewChild("dialogRef") dialogRef: TemplateRef<any>;
  currentDialog: MatDialogRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private userService: UserService // private currentDialog: MatDialogRef
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserToken) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "recobros";
  }

  onSubmit(form: NgForm) {
    // this.alertService.clear();

    // this.loading = true;
    this.authenticationService
      .login(form.controls.username.value, form.controls.password.value)
      .then((res) => this.router.navigate([this.returnUrl]))
      .catch(console.warn);
  }

  openDialog(): void {
    this.currentDialog = this.dialog.open(this.dialogRef, {
      width: "250px",
      data: { info: "" },
    });

    this.currentDialog.afterClosed().subscribe((txt) => {
      console.log(`The dialog was closed ${txt}`);
    });
  }

  onResetUserPassword(emailAddress): void {
    this.currentDialog.close();
    this.userService
      .resetUserPassword(emailAddress)
      .then((sucess) => this.alertService.success(sucess))
      .catch((error) => this.alertService.error(error));
  }
}
