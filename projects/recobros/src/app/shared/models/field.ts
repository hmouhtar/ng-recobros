export class Field {
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'date'
    | 'textarea'
    | 'hidden';
  label: string;
  required?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  name: string;
  options?:
    | { label: string; value: string }[]
    | (() => Promise<{ label: string; value: string }[]>);
  displayOnTable?: boolean;
  capability?: string | string[];
  displayCondition?: any;
  value?: (() => string) | string;
  valuePath?: string;
  context?: string;
  order?: number;

  // If field value or options is a function, call it.
  static processField(fields: Field[], context, subject?: any) {
    return Promise.all(
      fields.map((field) => {
        return Promise.all(
          // If any of the field properties is a function, call it with the current scope.
          Object.keys(field)
            .filter((key) => key !== 'displayCondition')
            .map((key) => {
              if ('function' === typeof field[key]) {
                return field[key].call(this).then((res) => (field[key] = res));
              }
            })
        );
      })
    )
      .then((res) =>
        fields.map((field) => {
          if (
            subject !== undefined &&
            field.value === undefined &&
            'edit' === context
          ) {
            field.value = field.valuePath
              ? subject[field.valuePath][field.name]
              : subject[field.name];
          }
          return field;
        })
      )
      .then((fields) =>
        fields.sort((a, b) => {
          return (a.order || 999) - (b.order || 999);
        })
      );
  }
}
