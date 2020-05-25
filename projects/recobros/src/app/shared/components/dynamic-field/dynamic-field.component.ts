import { Component, OnInit, Input } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'alvea-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
})
export class DynamicFieldComponent implements OnInit {
  @Input() field: Field;
  @Input() form: FormGroup;
  constructor() {}
  get isValid() {
    return this.form.controls[this.field.name].valid;
  }
  ngOnInit(): void {}
}
