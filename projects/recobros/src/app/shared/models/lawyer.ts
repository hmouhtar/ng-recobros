import { Field } from './field';

export class Lawyer {
  name: string;
  surname1: string;
  surname2: string;
  active: boolean;
  location: string;
  id: number;

  static getLawyerFields(): Field[] {
    return [
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
        label: 'Población / Zona Geográfica',
        name: 'location',
        required: true,
      },
      // {
      //   type: 'hidden',
      //   label: '',
      //   name: 'active',
      //   value: 'false',
      //   context: 'edit',
      // },
      {
        type: 'checkbox',
        label: 'Asignable',
        name: 'active',
        context: 'edit',
      },
    ];
  }
}
