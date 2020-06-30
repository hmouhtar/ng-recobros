import { Field } from './field';
import { Company } from './company';
import { RolesService } from '../../core/services/roles.service';

export class User {
  activate: boolean;
  company: Company;
  emailAddress: string;
  id: number;
  loginAttempt: number;
  name: string;
  owner: string;
  phoneNumber: string;
  rol: string;
  surname1: string;
  surname2: string;
  username: string;
  password: string;
  scope: string;

  static getUserFields(): Field[] {
    return [
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

        options: function () {
          return (this['rolesService'] as RolesService)
            .getEditableRoles()
            .then((editableRoles) =>
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
  }

  static getRoleFields(role: string): Field[] {
    switch (role) {
      case 'RECOVERY_EMPLOYEE':
        return [];
        break;
      case 'RECOVERY_ADMINISTRATOR':
        return [
          {
            type: 'text',
            label: 'Empresa / Departamento Recobrador',
            name: 'companyName',
            required: true,
            valuePath: 'company'
          },

          {
            type: 'select',
            label: 'Tipo Empresa / Departamento',
            name: 'companyScope',
            valuePath: 'company',
            required: true,
            options: [
              {
                label: 'INTERNO',
                value: 'INTERNAL'
              },
              {
                label: 'EXTERNO',
                value: 'EXTERNAL'
              }
            ]
          },

          {
            type: 'text',
            label: 'NIF Empresa Recobradora',
            name: 'nif',
            valuePath: 'company'
          }
        ];
        break;
      case 'COMPANY_MANAGER':
        return [];
      default:
        return [];
    }
  }
}
