import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
@Component({
  selector: 'alvea-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  users: Promise<any>;
  loadingAction: boolean = false;
  displayedColumns: string[] = [
    //'username',
    'role',
    'name',
    'email',
    'phone',
    'edit',
    'delete',
  ];

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }

  deleteUser(userID) {
    if (
      confirm(
        'Procederás a eliminar al usuario. Esta acción no es reversible. ¿Estás seguro?'
      )
    ) {
      this.loadingAction = true;
      this.userService
        .deleteUser(userID)
        .then((res) => {})
        .catch((err) => {
          this.alertService.error(err.message);
        })
        .finally(() => {
          this.loadingAction = false;
        });
    }
  }
}
