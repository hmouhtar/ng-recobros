import { Component, OnInit } from '@angular/core';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Subject, Observable } from 'rxjs';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { Router } from '@angular/router';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'alvea-new-lawyer',
  templateUrl: './new-lawyer.component.html',
  styleUrls: ['./new-lawyer.component.scss']
})
export class NewLawyerComponent implements OnInit {
  _lawyerFields: Field[];
  lawyerFields$: Subject<Field[]>;
  lawyerFieldsO: Observable<Field[]>;
  loadingAction = false;
  constructor(
    private lawyersService: LawyersService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.lawyerFields$ = new Subject();
    this.lawyerFieldsO = this.lawyerFields$.asObservable();
  }

  ngOnInit(): void {
    this.lawyersService.getLawyerFields.call(this, 'new').then((fields) => {
      this._lawyerFields = fields;
      this.lawyerFields$.next(this._lawyerFields);
    });
  }

  createLawyer(form: NgForm): void {
    this.loadingAction = true;
    this.lawyersService
      .createLawyer(form.value)
      .then(() => {
        this.alertService.success('Yay!');
        this.router.navigate(['/lawyers'], {});
      })
      .catch((err) => this.alertService.error(err.message))
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
