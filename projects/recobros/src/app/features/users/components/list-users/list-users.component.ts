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
  displayedColumns: string[] = [
    //'username',
    'role',
    'fullName',
    'emailAddress',
    'phone',
    'companyScope',
    'companyName',
    'edit',
    'delete',
  ];

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    Promise.all([
      this.userService.getCurrentUser(),
      this.userService.getUsers(),
    ]).then((res) => {
      let [currentUser, allUsers] = res;
      if (
        ['RECOVERY_ADMINISTRATOR', 'COMPANY_RECOVERY_MANAGER '].includes(
          currentUser.rol
        )
      ) {
        this.displayedColumns = this.displayedColumns.filter((column) => {
          return !['companyScope', 'companyName'].includes(column);
        });
      }
      this.dataSource.data = allUsers;
      this.dataSource.sort = this.sort;
    });
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
}
