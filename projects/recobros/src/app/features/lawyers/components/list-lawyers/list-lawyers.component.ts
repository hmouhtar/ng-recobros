import { Component, OnInit, ViewChild } from '@angular/core';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'alvea-list-lawyers',
  templateUrl: './list-lawyers.component.html',
  styleUrls: ['./list-lawyers.component.scss'],
})
export class ListLawyersComponent implements OnInit {
  users: Promise<any[]>;
  loadingAction: boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['fullName', 'edit', 'delete'];

  constructor(
    private lawyersService: LawyersService,
    private alertService: AlertService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    // this.userService.getUsers().then((users) => {
    //   this.dataSource.data = users;
    //   this.dataSource.sort = this.sort;
    // });
  }

  deleteUser(username) {
    if (
      confirm(
        'Procederás a eliminar al abogado. Esta acción no es reversible. ¿Estás seguro?'
      )
    ) {
      this.loadingAction = true;
      // this.userService
      //   .deleteUser(username)
      //   .then((res) => {
      //     this.dataSource.data = this.dataSource.data.filter(
      //       (user) => user.username !== username
      //     );
      //     // this.users = this.users.then((users) =>
      //     //   users.filter((user) => user.username !== username)
      //     // );
      //     this.alertService.success('Se ha eliminado el usuario exitosamente.');
      //   })
      //   .catch((err) => {
      //     this.alertService.error('Oops.');
      //   })
      //   .finally(() => {
      //     this.loadingAction = false;
      //   });
    }
  }
}
