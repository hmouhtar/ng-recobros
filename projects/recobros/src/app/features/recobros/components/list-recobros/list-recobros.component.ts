import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/recobros/src/app/core/services/user.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';

@Component({
  selector: 'alvea-list-recobros',
  templateUrl: './list-recobros.component.html',
  styleUrls: ['./list-recobros.component.scss'],
})
export class ListRecobrosComponent implements OnInit {
  recobros: Promise<any>;
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

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.recobros = this.recobrosService.getAllRecobros();
    this.recobros.then(console.log);
  }
}
