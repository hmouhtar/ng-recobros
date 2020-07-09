import { Component, ViewChild } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { NgForm } from '@angular/forms';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { groupBy } from 'lodash';
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
    this.formChangesSubscription = this.newRecobroForm.form.valueChanges.subscribe(
      (formValues) => {
        if (
          formValues.recoveryRoute &&
          formValues.recoveryRoute !== this.lastFormValues['recoveryRoute']
        ) {
          this.newRecobroFields
            .filter((field) => field.name === 'userAssignment')
            .map((field) => (field.required = formValues.recoveryRoute !== 2));
        }
        if (
          formValues.branch &&
          formValues.branch !== this.lastFormValues['branch']
        ) {
          this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
            const incidentTypologyField = this.newRecobroFields.find(
              (field) => field.name === 'incidentTypology'
            );

            if (incidentTypologyField) {
              incidentTypologyField.options = groupBy(
                autoComplete['incidentTypologySelect'],
                'branch'
              )[formValues.branch].map((element) => {
                return { label: element.nature, value: element.id };
              });

              this.newRecobroForm.form.controls['incidentTypology'].setValue(
                ''
              );
            }
          });
        }

        this.lastFormValues = formValues;
      }
    );
  }

  createNewRecobro(form: NgForm): void {
    this.loadingAction = true;
    this.recobrosService
      .createRecobro(form.value)
      .then(() => {
        this.alertService.success('Yay!');
        this.router.navigate(['/recobros'], {});
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
