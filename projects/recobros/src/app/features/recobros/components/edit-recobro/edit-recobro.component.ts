import { Component, OnInit, ViewChild } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { groupBy } from 'lodash';
import { Subscription } from 'rxjs';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';
import { SelectOption } from 'projects/recobros/src/app/shared/models/selectOption';

@Component({
  selector: 'alvea-edit-recobro',
  templateUrl: './edit-recobro.component.html',
  styleUrls: ['./edit-recobro.component.scss']
})
export class EditRecobroComponent implements OnInit {
  loadingAction: boolean;
  sortedFieldLabels = [
    'recoveryInfo',
    'recoveryStatus',
    'recoverySituation',
    'recoveryClose'
  ];
  dateNow: Date = new Date();
  allFields: { [key: string]: Field<Recobro>[] };
  formChangesSubscription: Subscription;
  lastFormValues = {};
  recobroPromise: Promise<Recobro>;
  recobro: Recobro;
  recobroID: string;
  constructor(
    private recobrosService: RecobrosService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private fieldService: FieldService
  ) {}

  @ViewChild('editRecobroForm') editRecobroForm: NgForm;

  ngOnInit(): void {
    this.recobroID = this.route.snapshot.paramMap.get('id') || '';
  }

  ngAfterViewInit(): void {
    (async () => {
      this.recobro = await this.recobrosService.getRecobro(this.recobroID);
      const fields = await this.fieldService.getRecobroFields(
        'edit',
        this.editRecobroForm,
        this.recobro
      );
      this.allFields = groupBy(
        fields.map(
          (field) => ((field.section = field.section || 'recoveryInfo'), field)
        ),
        'section'
      );
    })();

    this.formChangesSubscription = this.editRecobroForm.form.valueChanges.subscribe(
      (formValues) => {
        if (formValues.resolution !== this.lastFormValues['resolution']) {
          this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
            const motiveField = this.allFields['recoveryClose'].find(
              (field) => field.name === 'motive'
            ) as Field<Recobro>;
            if (motiveField) {
              motiveField.options = groupBy(
                autoComplete['resolutionSelect'],
                'resolution'
              )[formValues.resolution].map((element) => {
                return { label: element.motive, value: element.id };
              });

              if (
                !(motiveField.options as SelectOption[]).find(
                  (option) => option.value == String(this.recobro.motive)
                )
              ) {
                this.editRecobroForm.form.controls['motive'].setValue('');
              }
            }
          });
        }
        if (formValues.branch !== this.lastFormValues['branch']) {
          this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
            const incidentTypologyField = this.allFields['recoveryInfo'].find(
              (field) => field.name === 'incidentTypology'
            ) as Field<Recobro>;
            if (incidentTypologyField) {
              incidentTypologyField.options = groupBy(
                autoComplete['incidentTypologySelect'],
                'branch'
              )[formValues.branch].map((element) => {
                return { label: element.nature, value: element.id };
              });

              if (
                !(incidentTypologyField.options as SelectOption[]).find(
                  (option) =>
                    option.value == String(this.recobro.incidentTypology)
                )
              ) {
                this.editRecobroForm.form.controls['incidentTypology'].setValue(
                  ''
                );
              }
            }
          });
        }

        this.lastFormValues = formValues;
      }
    );
  }

  editRecobro(form: NgForm): void {
    this.loadingAction = true;
    this.recobrosService
      .editRecobro(form.value, this.recobroID)
      .then(() => {
        this.alertService.success('Yay!');
      })
      .catch(console.error)
      .finally(() => {
        window.location.reload(false);
      });
  }
}
