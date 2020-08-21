export const LAWYER_FIELDS = [
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
    type: 'string',
    label: 'Teléfono',
    name: 'email',
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
