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
    | 'textarea';
  label: string;
  required?: boolean;
  name: string;
  attr?: { attr: string; value: string } | { attr: string; value: string }[];
  options?:
    | { label: string; value: string }[]
    | (() => Promise<{ label: string; value: string }[]>);
  displayOnTable?: boolean;
  capability?: string | string[];
  displayCondition?: () => boolean;
  value?: () => string | string;
  valuePath?: string;
  context?: string;

  // If field value or options is a function, call it.
  static async processField(fields: Field[], context, subject?: any) {
    console.log(fields);

    return await Promise.all(
      fields.map(async (field) => {
        if (typeof field.options === 'function') {
          field.options = await field.options.call(this);
        }

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
    );
  }
}
