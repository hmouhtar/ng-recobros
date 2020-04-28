export class Field {
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'date';
  label: string;
  required: boolean;
  name: string;
  attr?: { attr: string; value: string } | { attr: string; value: string }[];
}
