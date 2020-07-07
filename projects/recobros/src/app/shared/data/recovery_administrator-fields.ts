export const RECOVERY_ADMINISTRATOR_FIELDS = [
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
