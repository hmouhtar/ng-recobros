import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AlertService } from "../../services/alert.service";
import { AuthenticationService } from "../../services/authentication.service";
import { SidenavService } from "../../services/sidenav.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "alvea-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent implements OnInit {
  public isUserLoggedIn: boolean;
  public sidenavLinks: any;
  public currentUser;
  public objectValues = Object.values;
  public objectKeys = Object.keys;
  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private sidenavService: SidenavService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.authenticationService.isUserLoggedInO.subscribe((res) => {
      this.isUserLoggedIn = res;
      if (this.isUserLoggedIn) {
        this.sidenavService.getAccesibleRoutes().then((routes) => {
          this.sidenavLinks = routes;
        });
        this.userService
          .getCurrentUser()
          .then((user) => (this.currentUser = user))
          .catch(console.warn);
      }
    });

    this.alertService.getAlert().subscribe((message) => {
      message &&
        this._snackBar.open(message.text, "close", {
          duration: 2500,
          panelClass: `snackbar-${message.type}`,
        });
    });
  }

  logout(): void {
    if (confirm("Deseas cerrar sesión?")) this.authenticationService.logout();
  }
}
