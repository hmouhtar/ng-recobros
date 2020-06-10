import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { User } from 'projects/recobros/src/app/shared/models/user';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'alvea-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  users: Promise<User[]>;
  loadingAction: boolean = false;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[];

  currentUser: User;

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    Promise.all([
      this.userService.getUsers().then((users) => {
        this.dataSource.data = users;
        this.dataSource.sort = this.sort;
        console.log(users);
      }),
      this.userService.getCurrentUser().then((user) => {
        this.displayedColumns = this.generateDisplayedColumns(user.rol);
      }),
    ]);
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
          this.dataSource.data = this.dataSource.data.filter(
            (user) => user.username !== username
          );
          // this.users = this.users.then((users) =>
          //   users.filter((user) => user.username !== username)
          // );
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

  generateDisplayedColumns(rol: string): string[] {
    if (rol == 'COMPANY_MANAGER') {
      return [
        'role',
        'companyName',
        'scope',
        'fullName',
        'emailAddress',
        'phone',
        'edit',
        'delete',
      ];
    }
    return ['role', 'fullName', 'emailAddress', 'phone', 'edit', 'delete'];
  }
}
