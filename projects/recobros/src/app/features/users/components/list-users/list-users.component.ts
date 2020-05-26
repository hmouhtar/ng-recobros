import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { User } from 'projects/recobros/src/app/shared/models/user';
@Component({
  selector: 'alvea-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  users: Promise<User[]>;
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

  deleteUser(username) {
    if (
      confirm(
        'Procederás a eliminar al usuario. Esta acción no es reversible. ¿Estás seguro?'
      )
    ) {
      this.loadingAction = true;
      this.userService
        .deleteUser(username)
        .then((res) => {
          this.users = this.users.then((users) =>
            users.filter((user) => user.username !== username)
          );
          this.alertService.success('Se ha eliminado el usuario exitosamente.');
        })
        .catch((err) => {
          this.alertService.error('Oops.');
        })
        .finally(() => {
          this.loadingAction = false;
        });
    }
  }
}
