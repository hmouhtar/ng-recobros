import { Component, Input, Injector } from '@angular/core';
import { Field } from '../../models/field';
import { FormGroup, ControlContainer, NgForm } from '@angular/forms';
import { pairwise } from 'rxjs/operators';

@Component({
  selector: 'alvea-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DynamicFieldComponent {
  @Input() field: Field<unknown>;
  @Input() subject: unknown;
  @Input() parentForm: NgForm;

  constructor(private injector: Injector) {}
  ngOnInit(): void {
    if (this.field.onParentFormValueChanges) {
      this.parentForm.valueChanges
        ?.pipe(pairwise())
        .subscribe(([prevFormValues, newFormValues]) => {
          if (this.field.onParentFormValueChanges)
            this.field.onParentFormValueChanges(
              prevFormValues,
              newFormValues,
              this.injector,
              this.subject
            );
        });
    }
  }
}
