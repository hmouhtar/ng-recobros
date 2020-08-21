import { Field } from '../models/field';
import { Lawyer } from '../models/lawyer';

export const LAWYER_FIELDS: Field<Lawyer>[] = [
  {
    type: 'text',
    label: 'Nombres',
    name: 'name',
    required: true
  },
  {
    type: 'text',
    label: 'Primer Apellido',
    name: 'surname1',
    required: true
  },
  {
    type: 'text',
    label: 'Segundo Apellido',
    name: 'surname2'
  },
  {
    type: 'email',
    label: 'E-mail',
    name: 'email',
    required: true
  },
  {
    type: 'text',
    label: 'Teléfono',
    name: 'phone',
    required: true
  },
  {
    type: 'text',
    label: 'Población / Zona Geográfica',
    name: 'location',
    required: true
  },
  {
    type: 'checkbox',
    label: 'Asignable',
    name: 'active',
    context: 'edit'
  }
];
