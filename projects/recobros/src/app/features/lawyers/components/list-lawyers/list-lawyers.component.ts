import { Component, OnInit, ViewChild } from '@angular/core';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Lawyer } from 'projects/recobros/src/app/shared/models/lawyer';

@Component({
  selector: 'alvea-list-lawyers',
  templateUrl: './list-lawyers.component.html',
  styleUrls: ['./list-lawyers.component.scss'],
})
export class ListLawyersComponent implements OnInit {
  users: Promise<any[]>;
  loadingAction: boolean = false;
  dataSource: MatTableDataSource<Lawyer>;
  displayedColumns: string[] = [
    // 'id',
    'fullName',
    'location',
    'active',
    'edit',
    'delete',
  ];

  constructor(
    private lawyersService: LawyersService,
    private alertService: AlertService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.lawyersService.getLawyers().then((lawyers) => {
      this.dataSource.data = lawyers;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'fullName': {
            return item.name;
          }
          default:
            return item[property];
        }
      };
      this.dataSource.sort = this.sort;
    });
  }

  deleteUser(id) {
    if (
      confirm(
        'Procederás a eliminar al abogado. Esta acción no es reversible. ¿Estás seguro?'
      )
    ) {
      this.loadingAction = true;
      this.lawyersService
        .deleteLawyer(id)
        .then((res) => {
          this.dataSource.data = this.dataSource.data.filter(
            (lawyer) => lawyer.id !== id
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
