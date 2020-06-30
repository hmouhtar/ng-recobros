import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Lawyer } from 'projects/recobros/src/app/shared/models/lawyer';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { Subject, Observable } from 'rxjs';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';

@Component({
  selector: 'alvea-edit-lawyer',
  templateUrl: './edit-lawyer.component.html',
  styleUrls: ['./edit-lawyer.component.scss']
})
export class EditLawyerComponent implements OnInit {
  lawyer: Lawyer;
  _lawyerFields: Field[];
  lawyerFields$: Subject<Field[]>;
  lawyerFieldsO: Observable<Field[]>;
  loadingAction = false;
  constructor(
    private lawyersService: LawyersService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    this.lawyerFields$ = new Subject();
    this.lawyerFieldsO = this.lawyerFields$.asObservable();
  }

  ngOnInit(): void {
    (async () => {
      const lawyer = (await this.lawyersService.getLawyers()).find(
        (lawyer) => String(lawyer.id) == this.route.snapshot.paramMap.get('id')
      );

      if (!lawyer) {
        this.alertService.error('ID no válido.');
        this.router.navigate(['/lawyers'], {});
      }

      this.lawyer = lawyer as Lawyer;

      this.lawyersService.getLawyerFields
        .call(this, 'edit', lawyer)
        .then((fields) => {
          console.log(fields);
          this._lawyerFields = fields;
          this.lawyerFields$.next(this._lawyerFields);
        });
    })();
  }

  editUser(form: NgForm): void {
    this.loadingAction = true;
    this.lawyersService
      .editLawyer(this.lawyer.id, form.value)
      .then(() => {
        this.alertService.success('Yay!');
      })
      .catch((err) => this.alertService.error(err.message))
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
