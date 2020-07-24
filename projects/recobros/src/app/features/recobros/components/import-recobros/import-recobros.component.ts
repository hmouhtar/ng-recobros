import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'alvea-import-recobros',
  templateUrl: './import-recobros.component.html',
  styleUrls: ['./import-recobros.component.scss']
})
export class ImportRecobrosComponent {
  isPerformingRequest = false;
  @ViewChild('importRecobrosForm') importRecobrosForm: NgForm;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {}

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
