import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Subject, Observable } from 'rxjs';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { Router } from '@angular/router';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';

@Component({
  selector: 'alvea-new-lawyer',
  templateUrl: './new-lawyer.component.html',
  styleUrls: ['./new-lawyer.component.scss'],
})
export class NewLawyerComponent implements OnInit {
  form: FormGroup;
  _lawyerFields: Field[];
  lawyerFields$: Subject<Field[]>;
  lawyerFieldsO: Observable<Field[]>;
  loadingAction: boolean = false;

  constructor(
    private lawyersService: LawyersService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.lawyerFields$ = new Subject();
    this.lawyerFieldsO = this.lawyerFields$.asObservable();
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.lawyersService.getLawyerFields.call(this, 'new').then((fields) => {
      this._lawyerFields = fields;
      this._lawyerFields.forEach((field) => {
        this.form.addControl(
          field.name,
          field.required
            ? new FormControl(field.value || '', Validators.required)
            : new FormControl(field.value || '')
        );
      });
      this.lawyerFields$.next(this._lawyerFields);
    });
  }

  createLawyer(form) {
    let formData = new FormData(form);
    let formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    this.loadingAction = true;
    this.lawyersService
      .createLawyer(formDataObj)
      .then((res) => {
        this.alertService.success('Yay!');
        //this.router.navigate(['/users'], {});
      })
      .catch((err) => this.alertService.error(err.message))
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
