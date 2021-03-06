import { Injectable, Injector } from '@angular/core';
import { User } from '../../shared/models/user';
import { RECOBRO_FIELDS } from '../../shared/data/recobro-fields';
import { Field } from '../../shared/models/field';
import { Recobro } from '../../shared/models/recobro';
import { NgForm } from '@angular/forms';
import { clone, cloneDeep, Dictionary, groupBy } from 'lodash';
import { RECOVERY_ADMINISTRATOR_FIELDS } from '../../shared/data/recovery_administrator-fields';
import { USER_FIELDS } from '../../shared/data/user-fields';
import { Lawyer } from '../../shared/models/lawyer';
import { LAWYER_FIELDS } from '../../shared/data/lawyer-fields';
import { RECOVERY_EMPLOYEE_FIELDS } from '../../shared/data/recovery_employee-fields';
import { COMPANY_MANAGER_FIELDS } from '../../shared/data/company_manager-fields';

@Injectable({ providedIn: 'root' })
export class FieldService {
  constructor(private injector: Injector) {}

  getLawyerFields(
    context: 'new' | 'edit',
    form: NgForm,
    subject?: Lawyer
  ): Promise<Field<Lawyer>[]> {
    return this.getFields<Lawyer>(LAWYER_FIELDS, context, form, subject);
  }

  getUserRoleFields(
    role: string,
    context: 'new' | 'edit',
    form: NgForm,
    subject?: User
  ): Promise<Field<User>[]> {
    let fields;
    switch (role) {
      case 'RECOVERY_ADMINISTRATOR': {
        fields = RECOVERY_ADMINISTRATOR_FIELDS;
        break;
      }
      case 'RECOVERY_EMPLOYEE': {
        fields = RECOVERY_EMPLOYEE_FIELDS;
        break;
      }
      case 'COMPANY_MANAGER': {
        fields = COMPANY_MANAGER_FIELDS;
        break;
      }
    }
    return this.getFields<User>(fields, context, form, subject);
  }

  getUserFields(
    context: 'new' | 'edit',
    form: NgForm,
    subject?: User
  ): Promise<Field<User>[]> {
    return this.getFields<User>(USER_FIELDS, context, form, subject);
  }

  getRecobroFields(
    context: 'new' | 'edit',
    form: NgForm,
    subject?: Recobro
  ): Promise<Field<Recobro>[]> {
    return this.getFields<Recobro>(RECOBRO_FIELDS, context, form, subject);
  }

  getRecobroSearchFilterFields(): Promise<Field<Recobro>[]> {
    return this.getSearchFilterFields<Recobro>(RECOBRO_FIELDS);
  }

  groupFieldsBySection(
    fields: Field<any>[],
    defaultSection: string
  ): Dictionary<Field<any>[]> {
    return groupBy(
      fields.map(
        (field) => ((field.section = field.section || defaultSection), field)
      ),
      'section'
    );
  }

  async getSearchFilterFields<T>(fields: Field<T>[]): Promise<Field<T>[]> {
    fields = fields.filter((field) => field.useAsSearchFilter);
    fields = fields
      .map(({ required, disabled, ...propertiesToKeep }) => propertiesToKeep)
      .map((field) => {
        field.value = '';
        return field;
      });
    fields = await this.setPropertiesFromFunctions(fields);
    //fields = this.orderFields(fields);

    return fields;
  }
  async getFields<T>(
    fields: Field<T>[],
    context: 'new' | 'edit',
    form: NgForm,
    subject?: T
  ): Promise<Field<T>[]> {
    fields = this.filterFieldsByContext<T>(fields, context);
    fields = this.orderFields(fields);
    if ('edit' === context && subject) {
      fields = this.setFieldsValueFromSubject(fields, subject);
      fields = this.parseFieldsDate<T>(fields);
    }
    fields = await this.setPropertiesFromFunctions(fields, form, subject);
    return fields;
  }

  filterFieldsByContext<T>(
    fields: Field<T>[],
    context: 'new' | 'edit'
  ): Field<T>[] {
    return fields.filter(
      (field) => field.context === undefined || field.context === context
    );
  }

  setFieldsValueFromSubject<T>(fields: Field<T>[], subject: T): Field<T>[] {
    fields = cloneDeep(fields);
    return fields.map((field) => {
      if (field.value === undefined) {
        field.value = field.valuePath
          ? subject[field.valuePath][field.name]
          : subject[field.name];
      }
      return field;
    });
  }

  orderFields<T>(fields: Field<T>[]): Field<T>[] {
    return fields.sort((a, b) => {
      return (a.order || 999) - (b.order || 999);
    });
  }

  orderFieldsBy<T>(fields: Field<T>[], predefinedOrder: string[]): Field<T>[] {
    return fields.sort((a, b) => {
      return (
        predefinedOrder.indexOf(a.name as string) -
        predefinedOrder.indexOf(b.name as string)
      );
    });
  }

  // YYYY-MM-DDTHH:mm:ss.sssZ
  parseFieldsDate<T>(fields: Field<T>[]): Field<T>[] {
    return fields.map((field) => {
      if (
        ['date', 'datetime-local'].includes(field.type) &&
        field.value !== undefined
      ) {
        const date = new Date(`${field.value}Z`);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        if ('date' === field.type) {
          field.value = date.toISOString().split('T')[0];
        } else if ('datetime-local' === field.type) {
          field.value = date.toISOString().substring(0, 16);
        }
      }

      return field;
    });
  }

  setPropertiesFromFunctions<T>(
    fields: Field<T>[],
    form?: NgForm,
    subject?: T
  ): Promise<Field<T>[]> {
    fields = cloneDeep(fields);
    return Promise.all(
      fields.map((field) => {
        return Promise.all(
          Object.keys(field)
            .filter(
              (key) =>
                key !== 'dynamicDisplayCondition' &&
                key !== 'onParentFormValueChanges'
            )
            .map((key) => {
              if ('function' === typeof field[key]) {
                return Promise.resolve(
                  field[key](this.injector, form, subject)
                ).then((functionResult) => (field[key] = functionResult));
              }
              return;
            })
        ).then(() => field);
      })
    );
  }
}
