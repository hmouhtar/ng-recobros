import { Component, OnInit, HostListener } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { groupBy } from 'lodash';
@Component({
  selector: 'alvea-new-recobro',
  templateUrl: './new-recobro.component.html',
  styleUrls: ['./new-recobro.component.scss'],
})
export class NewRecobroComponent implements OnInit {
  _newRecobroFields: Field[];
  recobroFields$: Subject<Field[]>;
  recobroFieldsO: Observable<Field[]>;
  roles: Promise<string[]>;
  form: FormGroup;
  loadingAction: boolean = false;
  incidentTypologies: any[];

  @HostListener('change', ['$event']) async loadRoleFields(event) {
    if ('branch' === event.target.name) {
      this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
        this.form.addControl(
          'incidentTypology',
          new FormControl('', Validators.required)
        );

        let fields = this._newRecobroFields.slice();
        let incidentTypologyField = fields.find(
          (field) => field.name === 'incidentTypology'
        );
        if (incidentTypologyField)
          incidentTypologyField.options = groupBy(
            autoComplete['incidentTypologySelect'],
            'branch'
          )[event.target.value].map((element) => {
            return { label: element.nature, value: element.id };
          });

        this.recobroFields$.next(fields);
      });
    }
  }

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {
    this.form = new FormGroup({});
    this.recobroFields$ = new Subject();
    this.recobroFieldsO = this.recobroFields$.asObservable();
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.recobrosService.getRecobroAutoComplete().then(console.log);
    this.recobrosService.getRecobrosFields.call(this, 'new').then((fields) => {
      this._newRecobroFields = fields;
      fields.forEach((field) => {
        this.form.addControl(
          field.name,
          field.required
            ? new FormControl(field.value || '', Validators.required)
            : new FormControl(field.value || '')
        );
      });
      this.recobroFields$.next(this._newRecobroFields);
    });
  }

  createNewRecobro(form) {
    let formData = new FormData(form);
    let formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    this.loadingAction = true;
    this.recobrosService
      .createRecobro(formDataObj)
      .then((res) => {
        this.alertService.success('Yay!');
        //this.router.navigate(['/users'], {});
      })
      .catch((err) => {
        console.log(err);
        this.alertService.error(`Oops. ${err.message}`);
      })
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
