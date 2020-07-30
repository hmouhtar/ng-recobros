import { Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectOption } from './selectOption';
import { DynamicFieldComponent } from '../components/dynamic-field/dynamic-field.component';

export type PropertyFunction<S, T> = (
  serviceInjector: Injector,
  form: NgForm,
  subject: S
) => T;

export interface Field<T> {
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'date'
    | 'datetime-local'
    | 'textarea'
    | 'hidden';
  label: string;
  name: keyof T;
  required?: boolean | PropertyFunction<T, boolean | Promise<boolean>>;
  hidden?: boolean | PropertyFunction<T, boolean | Promise<boolean>>;
  disabled?: boolean | PropertyFunction<T, boolean | Promise<boolean>>;
  options?:
    | SelectOption[]
    | PropertyFunction<T, SelectOption[] | Promise<SelectOption[]>>;
  capability?: string | string[];
  onParentFormValueChanges?: (
    prevFormValues,
    nextFormValues,
    injector: Injector,
    componentInstance: DynamicFieldComponent,
    subject: T
  ) => void;
  filterCondition?: PropertyFunction<T, boolean | Promise<boolean>>;
  dynamicDisplayCondition?: (form: NgForm) => boolean;
  fixedDisplayCondition?: PropertyFunction<T, boolean | Promise<boolean>>;
  value?: string | PropertyFunction<T, string | Promise<string>>;
  valuePath?: string;
  context?: 'new' | 'edit';
  order?: number;
  section?: string;
  prefix?: string;
  hint?: string;
}
