import { Component, OnInit } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

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
  constructor(private recobrosService: RecobrosService) {
    this.form = new FormGroup({});
    this.recobroFields$ = new Subject();
    this.recobroFieldsO = this.recobroFields$.asObservable();
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.recobrosService.getRecobrosFields('new').then((fields) => {
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
  createNewRecobro(form) {}
}
