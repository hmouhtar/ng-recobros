import { Component, ViewChild } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { NgForm } from '@angular/forms';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
@Component({
  selector: 'alvea-new-recobro',
  templateUrl: './new-recobro.component.html',
  styleUrls: ['./new-recobro.component.scss']
})
export class NewRecobroComponent {
  newRecobroFields: Field<Recobro>[] = [];
  roles: Promise<string[]>;
  loadingAction = false;
  formChangesSubscription: Subscription;
  lastFormValues = {};
  @ViewChild('newRecobroForm') newRecobroForm: NgForm;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService,
    private router: Router,
    private fieldService: FieldService
  ) {}

  ngAfterViewInit(): void {
    this.fieldService
      .getRecobroFields('new', this.newRecobroForm)
      .then((fields) => {
        this.newRecobroFields = fields;
      });
  }

  createNewRecobro(form: NgForm): void {
    this.loadingAction = true;
    this.recobrosService
      .createRecobro(form.value)
      .then(() => {
        this.alertService.emitSuccessAlert('Yay!');
        this.router.navigate(['/recobros'], {});
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
