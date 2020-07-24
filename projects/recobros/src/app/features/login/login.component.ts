import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { UserService } from '../../core/services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide = true;

  @ViewChild('dialogRef') dialogRef: TemplateRef<any>;
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
      this.router.navigate(['/']);
    }
  }

  onSubmit(form: NgForm): void {
    // this.alertService.clear();

    // this.loading = true;
    this.authenticationService
      .login(form.controls.username.value, form.controls.password.value)
      .then(() => this.router.navigate(['recobros']))
      .catch(console.warn);
  }

  openDialog(): void {
    this.currentDialog = this.dialog.open(this.dialogRef, {
      width: '250px',
      data: { info: '' }
    });

    this.currentDialog.afterClosed().subscribe((txt) => {
      console.log(`The dialog was closed ${txt}`);
    });
  }

  onResetUserPassword(emailAddress: string): void {
    this.currentDialog.close();
    this.userService
      .resetUserPassword(emailAddress)
      .then(() =>
        this.alertService.emitSuccessAlert(
          'Se ha procesado tu solicitud correctamente.'
        )
      )
      .catch(() =>
        this.alertService.emitErrorAlert(
          'Ha habido un error. Por favor, inténtalo de nuevo.'
        )
      );
  }
}
