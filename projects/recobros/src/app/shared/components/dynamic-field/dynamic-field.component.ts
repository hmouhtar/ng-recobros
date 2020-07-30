import { Component, Input, Injector } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup, ControlContainer, NgForm } from '@angular/forms';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'alvea-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DynamicFieldComponent {
  display = true;
  @Input() field: Field<unknown>;
  @Input() subject: unknown;
  @Input('form') parentForm: NgForm;

  constructor(private injector: Injector) {}
  ngOnInit(): void {
    console.log('Dynamic.');
    if (this.field.onParentFormValueChanges) {
      console.log('Yup.');
      this.parentForm.form.valueChanges
        .pipe(startWith(this.parentForm.form.value))
        .pipe(pairwise())
        .subscribe(([prevFormValues, newFormValues]) => {
          if (this.field.onParentFormValueChanges)
            this.field.onParentFormValueChanges(
              prevFormValues,
              newFormValues,
              this.injector,
              this,
              this.subject
            );
        });
    }
  }
}
