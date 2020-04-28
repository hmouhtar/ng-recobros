import { Field } from './field';

export class User {
  email: string;
  name: string;
  surname1: string;
  surname2: string;
  phone: string;
  role: string | string[];

  static getRoleFields(role: string): { [key: string]: Field[] } {
    switch (role) {
      case 'EMPLOYEE':
        return {
          regular: [],
          new: [],
          edit: [],
        };
        break;
      case 'EMPLOYEE_MANAGER':
        return {
          regular: [
            {
              type: 'text',
              label: 'Empresa Recobradora',
              name: 'department',
              required: false,
            },
          ],
          new: [],
          edit: [],
        };
        break;
      case 'COMPANY_MANAGER':
        return {
          regular: [],
          new: [],
          edit: [],
        };
        break;
      default:
        return {
          regular: [],
          new: [],
          edit: [],
        };
    }
  }
}
