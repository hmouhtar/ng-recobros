import { DatePipe } from "@angular/common";

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
    | "datetime-local"
    | "textarea"
    | "hidden";
  label: string;
  required?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  disabled?;
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
  hint?: string;

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
          console.log(field.name, field.value);

          if (field.type === "date" && field.value) {
            field.value = new Date(`${field.value}+02:00`).toISOString().split("T")[0];
          } else if (field.type === "datetime-local" && field.value) {
            //console.log("Date", new Date(`${field.value}+02:00`).toISOString());
            let date = new Date(`${field.value}+02:00`);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

            field.value = date.toISOString().substring(0, 16);
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
