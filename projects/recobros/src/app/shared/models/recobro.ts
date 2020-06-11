import { Field } from './field';
import { Company } from './company';
import { RolesService } from '../../core/services/roles.service';
import { RecobrosService } from '../../core/services/recobros.service';
import { groupBy } from 'lodash';
import { FormControl, NgForm } from '@angular/forms';

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
  key: { sinisterNumber: string; codSinister: number };
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
        type: 'text',
        label: 'N. Siniestro',
        name: 'sinisterNumber',
        required: true,
        order: 1,
      },
      {
        type: 'text',
        label: 'N. Encargo',
        name: 'codSinister',
        required: true,
        order: 2,
        context: 'edit',
      },
      // {
      //   type: 'date',
      //   label: 'Inicio Recobro',
      //   name: 'initDate',
      //   required: true,

      //   context: 'edit',
      // },
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
      },
      {
        type: 'select',
        label: 'Vía Recobro',
        name: 'recoveryRoute',
        options: function () {
          return (this['recobrosService'] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete['recoveryRouteSelect'].map((element) => {
                return {
                  label: element['route'],
                  value: element['id'],
                };
              });
            });
        },
        required: true,

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
        context: 'new',
        order: 5,
      },
      {
        type: 'select',
        label: 'Ramo',
        name: 'branch',
        value: function () {
          if (arguments[0]) {
            return (this['recobrosService'] as RecobrosService)
              .getRecobroAutoComplete()
              .then((autoComplete) => {
                return autoComplete['incidentTypologySelect'].find(
                  (incidentTypology) =>
                    incidentTypology.id == arguments[0].incidentTypology
                ).branch;
              });
          }
          return '';
        },
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
        context: 'new',
        required: true,
        order: 6,
      },
      {
        type: 'select',
        label: 'Naturaleza',
        name: 'incidentTypology',
        options: [],
        context: 'edit',
        required: true,
        order: 6,
      },
      {
        type: 'select',
        label: 'En Nombre De',
        name: 'inNameOf',
        required: true,
        order: 3,
        options: function () {
          return (this['recobrosService'] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete['inNameOfSelect'].map((element) => {
                return {
                  label: element['inNameOf'],
                  value: element['id'],
                };
              });
            });
        },
      },
      {
        type: 'number',
        label: 'Potencial Compañía',
        name: 'potentialInitialCompany',
        order: 4,
        required: true,
        displayCondition: function () {
          let inNameOfControl = (arguments[0].form as NgForm).controls[
            'inNameOf'
          ];

          if (inNameOfControl) {
            console.log(inNameOfControl.value);

            return inNameOfControl.value == '1' || inNameOfControl.value == '3';
          } else {
            return false;
          }
        },
      },
      {
        type: 'number',
        label: 'Potencial Asegurado',
        name: 'initialPersonalPotential',
        order: 4,
        required: true,
        displayCondition: function () {
          let inNameOfControl = (arguments[0].form as NgForm).controls[
            'inNameOf'
          ];

          if (inNameOfControl) {
            return inNameOfControl.value == '2' || inNameOfControl.value == '3';
          } else {
            return false;
          }
        },
      },
      {
        type: 'text',
        label: 'Administrador Recobrador',
        name: 'employer',
        context: 'edit',
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
        options: function () {
          return (this['recobrosService'] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete['interveningSelect'].map((element) => {
                return {
                  label: element['interveningType'],
                  value: element['id'],
                };
              });
            });
        },
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
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Fecha Situación',
        name: 'situationDate',
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Tipo Parcial',
        name: 'partialType',
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Abogado',
        name: 'lawyerName',
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Resolución Recobro',
        name: 'resolution',
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Situación Judicial',
        name: 'judicialSituation',
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Fecha Fase Judicial',
        name: 'judicialDate',
        context: 'edit',
      },

      {
        type: 'text',
        label: 'Jurisdicción',
        name: 'jurisdiction',
        context: 'edit',
      },
      {
        type: 'select',
        label: 'Estado Gestión',
        name: 'situationManagement',
        options: [],
        context: 'edit',
      },
      {
        type: 'text',
        label: 'Aprobación Judicial',
        name: 'judicialApproval',
        context: 'edit',
      },
    ];
  }
}
