import { Component, Input } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup, ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'alvea-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DynamicFieldComponent {
  @Input() field: Field;
  @Input() form: FormGroup;
}
