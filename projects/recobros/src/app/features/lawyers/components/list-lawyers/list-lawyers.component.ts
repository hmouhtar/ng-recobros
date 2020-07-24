import { Component, ViewChild } from '@angular/core';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { MatSort } from '@angular/material/sort';
import { Lawyer } from 'projects/recobros/src/app/shared/models/lawyer';
import {
  PaginatedDataSource,
  Sort
} from 'projects/recobros/src/app/core/services/paginated.datasource';

@Component({
  selector: 'alvea-list-lawyers',
  templateUrl: './list-lawyers.component.html',
  styleUrls: ['./list-lawyers.component.scss']
})
export class ListLawyersComponent {
  users: Promise<any[]>;
  loadingAction = false;
  initialSort: Sort<Lawyer> = { property: 'name', order: 'asc' };

  dataSource: PaginatedDataSource<Lawyer>;
  displayedColumns: string[] = [
    'fullName',
    'location',
    'active',
    'edit',
    'delete'
  ];

  constructor(
    private lawyersService: LawyersService,
    private alertService: AlertService
  ) {
    this.dataSource = new PaginatedDataSource<Lawyer>(
      (request) => this.lawyersService.getLawyersPage(request),
      this.initialSort
    );
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() =>
      this.dataSource.sortBy({
        property: this.sort.active as keyof Lawyer,
        order: this.sort.direction
      })
    );
  }

  deleteUser(id): void {
    if (
      confirm(
        'Procederás a eliminar al abogado. Esta acción no es reversible. ¿Estás seguro?'
      )
    ) {
      this.loadingAction = true;
      this.lawyersService
        .deleteLawyer(id)
        .then(() => {
          this.dataSource.sortBy({
            property: this.sort.active as keyof Lawyer,
            order: this.sort.direction
          });
          this.alertService.emitSuccessAlert(
            'Se ha eliminado el usuario exitosamente.'
          );
        })
        .catch(console.error)
        .finally(() => {
          this.loadingAction = false;
        });
    }
  }
}
