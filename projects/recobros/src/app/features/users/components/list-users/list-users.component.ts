import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { User } from 'projects/recobros/src/app/shared/models/user';
import { MatSort } from '@angular/material/sort';
import {
  Sort,
  PaginatedDataSource
} from 'projects/recobros/src/app/core/services/paginated.datasource';

@Component({
  selector: 'alvea-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  users: Promise<User[]>;
  loadingAction = false;
  dataSource: PaginatedDataSource<User>;
  initialSort: Sort<User> = { property: 'name', order: 'asc' };

  displayedColumns: string[] = [
    //'username',
    'role',
    'fullName',
    'emailAddress',
    'phone',
    'companyScope',
    'companyName',
    'edit',
    'delete'
  ];

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.dataSource = new PaginatedDataSource<User>(
      (request) => this.userService.getUsersPage(request),
      this.initialSort
    );
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    Promise.all([
      this.userService.getCurrentUser(),
      this.userService.getUsers()
    ]).then((res) => {
      const [currentUser] = res;
      if (
        ['RECOVERY_ADMINISTRATOR', 'COMPANY_RECOVERY_MANAGER '].includes(
          currentUser.rol
        )
      ) {
        this.displayedColumns = this.displayedColumns.filter((column) => {
          return !['companyScope', 'companyName'].includes(column);
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() =>
      this.dataSource.sortBy({
        property: this.sort.active as keyof User,
        order: this.sort.direction
      })
    );
  }

  deleteUser(username: string): void {
    if (
      confirm(
        'Procederás a eliminar al usuario. Esta acción no es reversible. ¿Estás seguro?'
      )
    ) {
      this.loadingAction = true;
      this.userService
        .deleteUser(username)
        .then(() => {
          this.dataSource.sortBy({
            property: this.sort.active as keyof User,
            order: this.sort.direction
          });
          this.alertService.success('Se ha eliminado el usuario exitosamente.');
        })
        .catch(() => {
          this.alertService.error('Oops.');
        })
        .finally(() => {
          this.loadingAction = false;
        });
    }
  }
}
