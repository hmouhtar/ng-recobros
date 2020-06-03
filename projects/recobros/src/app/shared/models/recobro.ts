import { Field } from './field';
import { Company } from './company';
import { RolesService } from '../../core/services/roles.service';
import { RecobrosService } from '../../core/services/recobros.service';
import { groupBy } from 'lodash';

export class Recobro {
  amountCondemned: number;
  attorneyFee: number;
  codSinister: string;
  costRecovery: boolean;
  company: number;
  deferredAmount: boolean;
  inNameOf: number;
  initDate: Date;
  interestRefund: boolean;
  judicialSituation: number;
  lawyerFee: number;
  recoveryFee: number;
  partialType: number;
  recoveryRoute: number;
  sinisterNumber: string;
  situationDate: Date;
  userAssignment: number;
  recoverySituation: 'PENDING' | 'FINISHED';
  incidentTypology: number;
  assuredCashFlow?: number;
  allowEmptyValue?: false;
  causative?: string;
  companyCashReceipt?: number;
  costAmount?: number;
  example?: boolean;
  costsIncurred: boolean;
  courtDate?: Date;
  initialPersonalPotential?: number;
  interestAmount?: number;
  interveningName?: string;
  interveningType?: number;
  judicialApproval?: 'AUTHORIZED' | 'UNAUTHORIZED';
  judicialDate?: Date;
  jurisdiction?: number;
  lawyer?: number;
  newPrescriptionDate?: Date;
  observations?: string;
  opposingCompany?: string;
  potentialInitialCompany?: number;
  prescriptionDiscontinued?: boolean;
  resolution?: number;
  resolutionDate?: Date;
  situationManagement: number;
  suppliesFee?: number;

  static getRecobroFields(): Field[] {
    return [
      {
        type: 'number',
        label: 'N. Siniestro',
        name: 'sinisterNumber',
        required: true,
        displayOnTable: true,
        order: 1,
      },
      {
        type: 'text',
        label: 'N. Encargo',
        name: 'codSinister',
        required: true,
        displayOnTable: true,
        context: 'edit',
      },
      {
        type: 'date',
        label: 'Inicio Recobro',
        name: 'initDate',
        required: true,
        displayOnTable: true,
        context: 'edit',
      },
      {
        type: 'select',
        label: 'Situación de recobro',
        name: 'recoverySituation',
        options: [
          {
            label: 'Pendiente',
            value: 'PENDING',
          },
          {
            label: 'Terminado',
            value: 'FINISHED',
          },
        ],
        required: true,
        order: 4,
        displayOnTable: true,
      },
      {
        type: 'select',
        label: 'Vía Recobro',
        name: 'recoveryRoute',
        options: [
          {
            label: 'Amistoso',
            value: 'amistoso',
          },
          {
            label: 'Judicial',
            value: 'judicial',
          },
          {
            label: 'SGR',
            value: 'sgr',
          },
          {
            label: 'TCA (Consorcio)',
            value: 'tca',
          },
        ],
        required: true,
        displayOnTable: true,
        order: 2,
      },
      {
        type: 'select',
        label: 'Compañía',
        name: 'company',
        // required: true,
        options: function () {
          return (this['recobrosService'] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete['companySelect'].map((company: Company) => {
                return { label: company.companyName, value: company.id };
              });
            });
        },
        required: true,
        order: 7,
      },
      {
        type: 'select',
        label: 'Ramo',
        name: 'branch',
        options: function () {
          return (this['recobrosService'] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return Object.keys(
                groupBy(autoComplete['incidentTypologySelect'], 'branch')
              ).map((branchName) => {
                return { label: branchName, value: branchName };
              });
            });
        },
        required: true,
        order: 5,
      },
      {
        type: 'select',
        label: 'Naturaleza',
        name: 'incidentTypology',
        options: [],
        required: true,
        order: 6,
      },
      {
        type: 'select',
        label: 'En Nombre De',
        name: 'inNameOf',
        required: true,
        order: 3,
        options: [
          {
            label: 'Compañía',
            value: 'compañia',
          },
          {
            label: 'Asegurado',
            value: 'asegurado',
          },
          {
            label: 'Ambos',
            value: 'ambos',
          },
        ],
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Administrador Recobrador',
        name: 'employer',
        required: true,
        displayOnTable: true,
        context: 'edit',
      },
      {
        type: 'number',
        label: 'Potencial Compañía',
        name: 'potentialInitialCompany',
      },
      {
        type: 'number',
        label: 'Potencial Asegurado',
        name: 'initialPersonalPotential',
      },

      {
        type: 'checkbox',
        label: 'Interrumpida Prescripción',
        name: 'prescriptionDiscontinued',
      },
      {
        type: 'date',
        label: 'Fecha Nueva Prescripción',
        name: 'newPrescriptionDate',
      },
      {
        type: 'text',
        label: 'Compañía Contraria',
        name: 'opposingCompany',
      },
      {
        type: 'text',
        label: 'Causante',
        name: 'causative',
      },
      {
        type: 'select',
        label: 'Interviniente',
        name: 'interveningType',
        options: [
          { label: 'Gestor', value: '0' },
          { label: 'Périto', value: '1' },
          { label: 'Reparador', value: '2' },
        ],
      },
      {
        type: 'text',
        label: 'Nombre del Interviniente',
        name: 'interveningName',
      },
      {
        type: 'textarea',
        label: 'Observaciones',
        name: 'observations',
      },
      {
        type: 'text',
        label: 'Motivo Cierre',
        name: 'motive',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Fecha Situación',
        name: 'situationDate',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Tipo Parcial',
        name: 'partialType',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Abogado',
        name: 'lawyerName',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Resolución Recobro',
        name: 'resolution',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Situación Judicial',
        name: 'judicialSituation',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Fecha Fase Judicial',
        name: 'judicialDate',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },

      {
        type: 'text',
        label: 'Jurisdicción',
        name: 'jurisdiction',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'select',
        label: 'Estado Gestión',
        name: 'situationManagement',
        options: [],
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
      {
        type: 'text',
        label: 'Aprobación Judicial',
        name: 'judicialApproval',
        required: true,
        context: 'edit',
        displayOnTable: true,
      },
    ];
  }
}
