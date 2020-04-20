import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'alvea-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  public isUserLoggedIn: boolean;
  public objectValues = Object.values;
  public sidenavLinks: object;
  public objectKeys = Object.keys;
  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    this.sidenavLinks = this.sidenavService.getAvailableRoutes();
    console.log(this.sidenavLinks);
    this.authenticationService.currentUser.subscribe(
      (res) => (this.isUserLoggedIn = res !== null)
    );

    this.alertService.getAlert().subscribe((message) => {
      message &&
        this._snackBar.open(message.text, '', {
          duration: 1000,
        });

      // switch (message && message.type) {
      //   case 'success':
      //     message.cssClass = 'alert alert-success';
      //     break;
      //   case 'error':
      //     message.cssClass = 'alert alert-danger';
      //     break;
      // }
    });
  }

  logout() {
    if (confirm('Deseas cerrar sesión?')) this.authenticationService.logout();
  }
}
