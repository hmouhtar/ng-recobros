import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { MatSort } from '@angular/material/sort';
import { RolesService } from 'projects/recobros/src/app/core/services/roles.service';
import {
  PaginatedDataSource,
  Sort
} from 'projects/recobros/src/app/core/services/paginated.datasource';

@Component({
  selector: 'alvea-list-recobros',
  templateUrl: './list-recobros.component.html',
  styleUrls: ['./list-recobros.component.scss']
})
export class ListRecobrosComponent implements OnInit {
  dataSource: PaginatedDataSource<Recobro>;
  initialSort: Sort<Recobro> = { property: 'sinisterNumber', order: 'asc' };

  loadingAction = false;
  canCreateRecobro: boolean;
  displayedColumns: string[] = [
    //'username',
    'sinisterNumber',
    'codSinister',
    'initDate',
    'recoverySituation',
    'recoveryRoute',
    'situationManagement',
    'situationDate',
    'company',
    'edit'
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService,
    private rolesService: RolesService
  ) {
    this.dataSource = new PaginatedDataSource<Recobro>(
      (request) => this.recobrosService.getRecobrosPage(request),
      this.initialSort
    );
  }

  ngOnInit(): void {
    this.rolesService
      .currentUserCan('CREATE_RECOVERY')
      .then((res) => (this.canCreateRecobro = res));
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() =>
      this.dataSource.sortBy({
        property: this.sort.active as keyof Recobro,
        order: this.sort.direction
      })
    );
  }
}
