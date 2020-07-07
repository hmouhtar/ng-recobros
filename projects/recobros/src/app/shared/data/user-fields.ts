import { User } from '../models/user';
import { Field } from '../models/field';
import { Injector } from '@angular/core';
import { SelectOption } from '../models/selectOption';
import { RolesService } from '../../core/services/roles.service';

export const USER_FIELDS: Field<User>[] = [
  {
    type: 'text',
    label: 'Nombre de Usuario',
    name: 'username',
    required: true,
    context: 'new',
    order: 1
  },

  {
    type: 'text',
    label: 'Nombre de Usuario',
    name: 'username',
    disabled: true,
    context: 'edit',
    order: 1
  },

  {
    type: 'text',
    label: 'Nombres',
    name: 'name',
    required: true,
    order: 3
  },

  {
    type: 'text',
    label: 'Primer Apellido',
    name: 'surname1',
    required: true,
    order: 4
  },

  {
    type: 'text',
    label: 'Segundo Apellido',
    name: 'surname2',
    order: 5
  },

  {
    type: 'text',
    label: 'Teléfono',
    name: 'phoneNumber'
  },

  {
    type: 'email',
    label: 'E-mail',
    name: 'emailAddress',
    required: true,
    order: 2
  },

  {
    type: 'select',
    label: 'Perfil',
    name: 'rol',
    context: 'new',
    required: true,
    options: (injector: Injector): Promise<SelectOption[]> => {
      const rolesService = injector.get<RolesService>(RolesService);
      return rolesService.getEditableRoles().then((editableRoles) =>
        editableRoles.map((role) => {
          let label = '';
          switch (role) {
            case 'COMPANY_MANAGER':
              label = 'Administrador de Compañía';
              break;
            case 'RECOVERY_ADMINISTRATOR':
              label = 'Administrador Recobrador';
              break;
            case 'RECOVERY_EMPLOYEE':
              label = 'Empleado Recobrador';
              break;
          }
          return { label: label, value: role };
        })
      );
    }
  },
  {
    type: 'password',
    label: 'Contraseña',
    name: 'password',
    required: true,
    context: 'new',
    order: 1000
  }
];
