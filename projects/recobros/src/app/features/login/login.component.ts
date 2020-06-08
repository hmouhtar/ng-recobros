import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../../core/services/alert.service';
import { AuthenticationService } from '../../core/services/authentication.service';

import { UserService } from '../../core/services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../shared/models/user';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide = true;

  @ViewChild('dialogRef') dialogRef: TemplateRef<any>;
  currentDialog: MatDialogRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private userService: UserService // private currentDialog: MatDialogRef
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserToken) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          console.log(JSON.parse(error.error).message);
          this.alertService.error(
            'ERROR: El nombre de usuario o contraseña ingresado es incorrecto'
          );
          this.loading = false;
        }
      );
  }

  openDialog(): void {
    this.currentDialog = this.dialog.open(this.dialogRef, {
      width: '250px',
      data: { info: '' },
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
