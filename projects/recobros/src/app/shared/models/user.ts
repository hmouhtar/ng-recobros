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

  static getUserFields(): Field[] {
    return [
      {
        type: 'text',
        label: 'Nombre de Usuario',
        name: 'username',
        required: true,
        context: 'new',
      },

      {
        type: 'text',
        label: 'Nombres',
        name: 'name',
        required: true,
      },

      {
        type: 'text',
        label: 'Primer Apellido',
        name: 'surname1',
        required: true,
      },

      {
        type: 'text',
        label: 'Segundo Apellido',
        name: 'surname2',
        required: true,
      },

      {
        type: 'text',
        label: 'Teléfono',
        name: 'phoneNumber',
        required: true,
      },

      {
        type: 'email',
        label: 'E-mail',
        name: 'emailAddress',
        required: true,
      },

      {
        type: 'select',
        label: 'Perfil',
        name: 'rol',
        context: 'new',
        required: true,
        options: async function () {
          return (
            await (this['rolesService'] as RolesService).getEditableRoles()
          ).map((role) => {
            return { label: role, value: role };
          });
        },
      },

      {
        type: 'password',
        label: 'Contraseña',
        name: 'password',
        required: true,
        context: 'new',
      },
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
            label: 'Empresa Recobradora',
            name: 'companyName',
            required: true,
            valuePath: 'company',
          },

          {
            type: 'select',
            label: 'Departamento',
            name: 'companyScope',
            required: true,
            valuePath: 'company',

            options: [
              {
                label: 'INTERNO',
                value: 'INTERNAL',
              },
              {
                label: 'EXTERNO',
                value: 'EXTERNAL',
              },
            ],
          },

          {
            type: 'text',
            label: 'NIF Empresa Recobradora',
            name: 'nif',
            required: true,
            valuePath: 'company',
          },
        ];
        break;
      case 'COMPANY_MANAGER':
        return [];
      default:
        return [];
    }
  }
}
