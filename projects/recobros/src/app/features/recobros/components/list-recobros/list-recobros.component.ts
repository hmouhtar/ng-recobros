import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'alvea-list-recobros',
  templateUrl: './list-recobros.component.html',
  styleUrls: ['./list-recobros.component.scss'],
})
export class ListRecobrosComponent implements OnInit {
  dataSource: MatTableDataSource<Recobro>;
  loadingAction: boolean = false;
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
    'edit',
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.recobrosService.getAllRecobros().then((recobros) => {
      this.dataSource.data = recobros;
      this.dataSource.sort = this.sort;
    });
  }
}
