import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { NgForm } from '@angular/forms';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { groupBy } from 'lodash';
@Component({
  selector: 'alvea-new-recobro',
  templateUrl: './new-recobro.component.html',
  styleUrls: ['./new-recobro.component.scss'],
})
export class NewRecobroComponent implements OnInit {
  newRecobroFields: Field[] = [];
  roles: Promise<string[]>;
  loadingAction: boolean = false;
  incidentTypologies: any[];
  @ViewChild('newRecobroForm') newRecobroForm: NgForm;
  @HostListener('change', ['$event']) async loadRoleFields(event) {
    switch (event.target.getAttribute('ng-reflect-name')) {
      case 'branch':
        this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
          let incidentTypologyField = this.newRecobroFields.find(
            (field) => field.name === 'incidentTypology'
          );
          if (incidentTypologyField) {
            incidentTypologyField.options = groupBy(
              autoComplete['incidentTypologySelect'],
              'branch'
            )[event.target.value].map((element) => {
              return { label: element.nature, value: element.id };
            });
          }
        });
        break;
      default:
        break;
    }
  }

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.recobrosService.getRecobrosFields.call(this, 'new').then((fields) => {
      this.newRecobroFields = fields;
    });
  }

  createNewRecobro(form: NgForm) {
    this.loadingAction = true;
    this.recobrosService
      .createRecobro(form.value)
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
