import { Component, ViewChild } from '@angular/core';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { Router } from '@angular/router';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { NgForm } from '@angular/forms';
import { Lawyer } from 'projects/recobros/src/app/shared/models/lawyer';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';

@Component({
  selector: 'alvea-new-lawyer',
  templateUrl: './new-lawyer.component.html',
  styleUrls: ['./new-lawyer.component.scss']
})
export class NewLawyerComponent {
  newLawyerFields: Field<Lawyer>[] = [];
  loadingAction = false;
  @ViewChild('newLawyerForm') newLawyerForm: NgForm;

  constructor(
    private lawyersService: LawyersService,
    private alertService: AlertService,
    private router: Router,
    private fieldService: FieldService
  ) {}

  ngAfterViewInit(): void {
    this.fieldService
      .getLawyerFields('new', this.newLawyerForm)
      .then((fields) => (this.newLawyerFields = fields));
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
