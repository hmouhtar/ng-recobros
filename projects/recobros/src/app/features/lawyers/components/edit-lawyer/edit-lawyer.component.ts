import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Lawyer } from 'projects/recobros/src/app/shared/models/lawyer';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';

@Component({
  selector: 'alvea-edit-lawyer',
  templateUrl: './edit-lawyer.component.html',
  styleUrls: ['./edit-lawyer.component.scss']
})
export class EditLawyerComponent implements OnInit {
  lawyer: Lawyer;
  lawyerID: string;
  editLawyerFields: Field<Lawyer>[] = [];
  loadingAction = false;
  @ViewChild('editLawyerForm') editLawyerForm: NgForm;

  constructor(
    private lawyersService: LawyersService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private fieldService: FieldService
  ) {}

  ngOnInit(): void {
    this.lawyerID = this.route.snapshot.paramMap.get('id') as string;
  }
  ngAfterViewInit(): void {
    this.lawyersService.getLawyers().then((lawyers) => {
      console.log(lawyers);
      this.lawyer = lawyers.find(
        (lawyer) => String(lawyer.id) === this.lawyerID
      ) as Lawyer;
      if (!this.lawyer) {
        this.alertService.emitErrorAlert('ID no válido.');
        this.router.navigate(['/lawyers'], {});
        return;
      }
      this.fieldService
        .getLawyerFields('edit', this.editLawyerForm, this.lawyer)
        .then((fields) => (this.editLawyerFields = fields));
    });
  }
  editUser(form: NgForm): void {
    this.loadingAction = true;
    this.lawyersService
      .editLawyer(this.lawyer.id, form.value)
      .then(() => {
        this.alertService.emitSuccessAlert('Yay!');
      })
      .catch((err) => this.alertService.emitErrorAlert(err.message))
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
