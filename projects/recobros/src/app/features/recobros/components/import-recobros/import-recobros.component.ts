import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImportRecobroLog } from 'projects/recobros/src/app/shared/models/importRecobroLog';

@Component({
  selector: 'alvea-import-recobros',
  templateUrl: './import-recobros.component.html',
  styleUrls: ['./import-recobros.component.scss']
})
export class ImportRecobrosComponent {
  isPerformingRequest = false;
  importRecobroLogs: ImportRecobroLog[] = [];
  importRecobroLogsTableColumns: Array<keyof ImportRecobroLog> = [
    'date',
    'username',
    'payMethod',
    'records',
    'loadStatus',
    'observations'
  ];
  @ViewChild('importRecobrosForm') importRecobrosForm: NgForm;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.importRecobroLogs = [
      {
        date: '12/12/12 5',
        username: 'something',
        loadStatus: 'SUCCESFUL',
        observations: 'AAA',
        records: 12,
        payMethod: 'MANUAL'
      }
    ];
    // this.recobrosService
    //   .getImportRecobroLogs()
    //   .then(
    //     (importRecobroLogs) => (this.importRecobroLogs = importRecobroLogs)
    //   );

    console.log(this.importRecobroLogs);
  }

  importRecobros(file: Blob): void {
    this.isPerformingRequest = true;
    this.recobrosService
      .importRecobros(file)
      .then(() => this.alertService.emitSuccessAlert('Yay!'))
      .catch((err: HttpErrorResponse) =>
        this.alertService.emitErrorAlert(err.error)
      )
      .finally(() => (this.isPerformingRequest = false));
  }
}
