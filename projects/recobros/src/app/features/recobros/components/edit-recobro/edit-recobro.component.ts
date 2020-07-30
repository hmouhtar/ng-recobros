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
import { pairwise, startWith } from 'rxjs/operators';

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
  recobro: Recobro;
  recobroID: string;
  allFields: { [key: string]: Field<Recobro>[] };
  formChangesSubscription: Subscription;
  @ViewChild('editRecobroForm') editRecobroForm: NgForm;

  constructor(
    private recobrosService: RecobrosService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private fieldService: FieldService
  ) {}

  ngOnInit(): void {
    this.recobroID = this.getRecobroID();
  }

  ngAfterViewInit(): void {
    this.recobrosService
      .getRecobro(Number(this.recobroID))
      .then((recobro) => {
        this.recobro = recobro;
      })
      .then(() => {
        return this.fieldService.getRecobroFields(
          'edit',
          this.editRecobroForm,
          this.recobro
        );
      })
      .then((fields) => {
        this.allFields = this.fieldService.groupFieldsBySection(
          fields,
          'recoveryInfo'
        );
      });

    this.formChangesSubscription = this.subscribeToFormValueChanges();
  }

  getRecobroID(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  subscribeToFormValueChanges(): Subscription {
    return this.editRecobroForm.form.valueChanges
      .pipe(startWith({}), pairwise())
      .subscribe(([prevFormValues, nextFormValues]) => {
        if (
          prevFormValues.recoverySituation !== nextFormValues.recoverySituation
        ) {
          this.isRecoverySituationFinished()
            ? this.setRecoveryCloseFieldsAsRequired()
            : this.setRecoveryCloseFieldsAsOptional();
        }
      });
  }

  isRecoverySituationFinished(): boolean {
    return (
      this.editRecobroForm.form.controls['recoverySituation'].value ===
      'FINISHED'
    );
  }

  setRecoveryCloseFieldsAsRequired(): void {
    this.allFields['recoveryClose'].map((field) => (field.required = true));
  }

  setRecoveryCloseFieldsAsOptional(): void {
    this.allFields['recoveryClose'].map((field) => (field.required = false));
  }

  editRecobro(): void {
    if (
      this.isRecoverySituationFinished() &&
      !confirm(
        'Procederás a cambiar la situación de recobro a "Terminado". Ten en cuenta que luego de aceptar no podrás modificar la información del expediente de recobro.'
      )
    ) {
      return;
    }
    this.loadingAction = true;
    this.recobrosService
      .editRecobro(this.editRecobroForm.value, this.recobroID)
      .then(() => {
        this.alertService.emitSuccessAlert('Yay!');
      })
      .catch(console.error)
      .finally(() => {
        this.reloadPage();
      });
  }

  reloadPage(): void {
    window.location.reload(false);
  }
}
