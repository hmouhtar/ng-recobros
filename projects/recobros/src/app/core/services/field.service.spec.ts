import { TestBed } from '@angular/core/testing';
import { FieldService } from './field.service';
import { Field } from '../../shared/models/field';
import { Recobro } from '../../shared/models/recobro';
import { User } from '../../shared/models/user';

fdescribe('FieldService', () => {
  let masterService: FieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    masterService = TestBed.inject(FieldService);
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  it('filterFieldsByContext should filter fields by context', () => {
    const fields: Field<any>[] = [
      {
        type: 'text',
        label: 'randomField1',
        name: 'randomField1'
      },
      {
        type: 'number',
        label: 'randomField2',
        name: 'randomField2'
      },
      {
        type: 'text',
        label: 'randomFieldWContext1',
        name: 'randomFieldWContext1',
        context: 'edit'
      },
      {
        type: 'number',
        label: 'randomFieldWContext2',
        name: 'randomFieldWContext2',
        context: 'new'
      }
    ];

    expect(masterService.filterFieldsByContext(fields, 'new')).toEqual([
      {
        type: 'text',
        label: 'randomField1',
        name: 'randomField1'
      },
      {
        type: 'number',
        label: 'randomField2',
        name: 'randomField2'
      },
      {
        type: 'number',
        label: 'randomFieldWContext2',
        name: 'randomFieldWContext2',
        context: 'new'
      }
    ]);

    expect(masterService.filterFieldsByContext(fields, 'edit')).toEqual([
      {
        type: 'text',
        label: 'randomField1',
        name: 'randomField1'
      },
      {
        type: 'number',
        label: 'randomField2',
        name: 'randomField2'
      },
      {
        type: 'text',
        label: 'randomFieldWContext1',
        name: 'randomFieldWContext1',
        context: 'edit'
      }
    ]);
  });

  it('setFieldsValueFromSubject should set the fields value based on a given subject', () => {
    const fields: Field<User>[] = [
      {
        type: 'text',
        label: 'Usuario',
        name: 'username'
      },
      {
        type: 'text',
        label: 'Usuario',
        name: 'username',
        value: 'predefinedUsername'
      }
    ];

    const subject: User = {
      username: 'randomUsername'
    } as User;

    expect(masterService.setFieldsValueFromSubject(fields, subject)).toEqual([
      {
        type: 'text',
        label: 'Usuario',
        name: 'username',
        value: 'randomUsername'
      },
      {
        type: 'text',
        label: 'Usuario',
        name: 'username',
        value: 'predefinedUsername'
      }
    ]);
  });

  it('parseFieldsDate display the correct date based on the field value if its type is date or datetime-local', () => {
    const fields: Field<any>[] = [
      {
        type: 'date',
        label: 'Fecha',
        name: 'date',
        value: '2020-07-17T07:12:41.93'
      },
      {
        type: 'datetime-local',
        label: 'Fecha con hora',
        name: 'dateAndTime',
        value: '2020-07-17T07:12:41.93'
      }
    ];
    Date.prototype.getTimezoneOffset = () => -60;
    expect(masterService.parseFieldsDate(fields)).toEqual([
      {
        type: 'date',
        label: 'Fecha',
        name: 'date',
        value: '2020-07-17'
      },
      {
        type: 'datetime-local',
        label: 'Fecha con hora',
        name: 'dateAndTime',
        value: '2020-07-17T08:12'
      }
    ]);
  });
});
