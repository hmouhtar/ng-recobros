export class Field {
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "checkbox"
    | "radio"
    | "select"
    | "date"
    | "datetime"
    | "textarea"
    | "hidden";
  label: string;
  required?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  name: string;
  options?:
    | {
        label: string;
        value: string;
      }[]
    | (() => Promise<
        {
          label: string;
          value: string;
        }[]
      >);
  displayOnTable?: boolean;
  capability?: string | string[];
  displayCondition?: any;
  displayConditionFixed?: boolean;
  value?: (() => string) | string;
  valuePath?: string;
  context?: string;
  order?: number;
  section?: string;
  prefix?: string;

  // If field value or options is a function, call it.
  static processField(fields: Field[], context: "new" | "edit", subject?): Promise<Field[]> {
    return Promise.all(
      fields.map((field) =>
        Promise.all(
          Object.keys(field)
            .filter((key) => key !== "displayCondition" || field["displayConditionFixed"])
            .map((key) => {
              if ("function" === typeof field[key]) {
                return Promise.resolve(field[key].call(this, subject)).then(
                  (res) => (field[key] = res)
                );
              } else {
                return field[key];
              }
            })
            .filter((key) => key !== "displayCondition")
        )
      )
    )
      .then(() => {
        return fields.map((field) => {
          if (subject !== undefined && field.value === undefined && "edit" === context) {
            field.value = field.valuePath
              ? subject[field.valuePath][field.name]
              : subject[field.name];
          }
          return field;
        });
      })
      .then((fields) =>
        fields.sort((a, b) => {
          return (a.order || 999) - (b.order || 999);
        })
      );
  }
}
