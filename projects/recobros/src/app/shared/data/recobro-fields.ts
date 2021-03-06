import { Recobro } from '../models/recobro';
import { Field } from '../models/field';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../../core/services/roles.service';
import { NgForm } from '@angular/forms';
import { RecobrosService } from '../../core/services/recobros.service';
import { Company } from '../models/company';
import { groupBy, Dictionary } from 'lodash';
import { UserService } from '../../core/services/user.service';
import { LawyersService } from '../../core/services/lawyers.service';
import { SelectOption } from '../models/selectOption';
import { DynamicFieldComponent } from '../components/dynamic-field/dynamic-field.component';
// import { TaxonomyService } from '../../core/services/taxonomy.service';

function generateOptionsFromAutoComplete(
  recobrosService: RecobrosService,
  propertyName: string,
  propertyLabel: string
): Promise<SelectOption[]> {
  return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
    return autoComplete[propertyName].map((element) => {
      return { label: element[propertyLabel], value: element.id };
    });
  });
}

export const RECOBRO_FIELDS: Field<Recobro>[] = [
  {
    type: 'text',
    label: 'N. Siniestro',
    name: 'sinisterNumber',
    required: true,
    useAsSearchFilter: true,
    order: 1,
    disabled: function (injector: Injector): Promise<boolean> {
      const router = injector.get<Router>(Router);
      const rolesService = injector.get<RolesService>(RolesService);
      if ('/recobros/edit' === router.url) {
        return rolesService
          .currentUserCan('CREATE_RECOVERY')
          .then((res) => !res);
      }

      return Promise.resolve(false);
    }
  },
  {
    type: 'text',
    label: 'N. Encargo',
    name: 'codSinister',
    disabled: true,
    required: true,
    value: function (
      injector: Injector,
      form: NgForm,
      recobro: Recobro
    ): string {
      const zeroPad = (num, places) => String(num).padStart(places, '0');
      return `${recobro.sinisterNumber}_${zeroPad(recobro.codSinister, 3)}`;
    },
    order: 2,
    context: 'edit'
  },
  {
    type: 'date',
    label: 'Fecha de Resolución',
    name: 'resolutionDate',
    section: 'recoveryClose',
    context: 'edit',
    order: 4
  },
  {
    type: 'number',
    label: 'Minutas - Suplidos',
    name: 'suppliesFee',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€'
  },
  {
    type: 'number',
    label: 'Minutas - Procurador',
    name: 'attorneyFee',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€'
  },
  {
    type: 'number',
    label: 'Minutas - Abogado Judicial',
    name: 'lawyerFee',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€'
  },
  {
    type: 'number',
    label: 'Minutas - Recobrador Amistoso',
    name: 'recoveryFee',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€'
  },
  {
    type: 'number',
    label: 'Cobro Compañía',
    name: 'companyCashReceipt',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€',
    required: true,
    dynamicDisplayCondition: (form: NgForm): boolean => {
      const inNameOfControl = form.controls['inNameOf'];
      if (inNameOfControl) {
        return inNameOfControl.value == '1' || inNameOfControl.value == '3';
      } else {
        return false;
      }
    },
    order: 5
  },
  {
    type: 'number',
    label: 'Cobro Asegurado',
    name: 'assuredCashFlow',
    section: 'recoveryClose',
    context: 'edit',
    required: true,
    prefix: '€',
    dynamicDisplayCondition: (form: NgForm): boolean => {
      const inNameOfControl = form.controls['inNameOf'];
      if (inNameOfControl) {
        return inNameOfControl.value == '2' || inNameOfControl.value == '3';
      } else {
        return false;
      }
    },
    order: 5
  },
  {
    type: 'number',
    label: 'Recuperación de Costas',
    name: 'costAmount',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€',
    order: 7
  },
  {
    type: 'number',
    label: 'Reintegro de Intereses',
    name: 'interestAmount',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€',
    order: 8
  },
  {
    type: 'number',
    label: 'Condena Costas',
    name: 'amountCondemned',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€',
    order: 9
  },
  {
    type: 'checkbox',
    label: 'Importe Aplazado',
    name: 'deferredAmount',
    section: 'recoveryClose',
    context: 'edit',
    prefix: '€',
    order: 10
  },

  {
    type: 'date',
    label: 'Inicio Recobro',
    name: 'initDate',
    required: true,
    disabled: true,
    context: 'edit',
    order: 7
  },
  {
    type: 'select',
    label: 'Situación de recobro',
    useAsSearchFilter: true,
    name: 'recoverySituation',
    options: [
      {
        label: 'Pendiente',
        value: 'PENDING'
      },
      {
        label: 'Terminado',
        value: 'FINISHED'
      }
    ],
    required: true,
    order: 6
  },
  {
    type: 'select',
    label: 'Vía Recobro',
    name: 'recoveryRoute',
    useAsSearchFilter: true,
    options: (injector: Injector): Promise<SelectOption[]> =>
      generateOptionsFromAutoComplete(
        injector.get<RecobrosService>(RecobrosService),
        'recoveryRouteSelect',
        'route'
      ),

    disabled: (injector: Injector): Promise<boolean> => {
      const rolesService = injector.get<RolesService>(RolesService);
      return rolesService
        .currentUserCan('SELECT_RECOVERY_ROUTE')
        .then((userCan) => !userCan);
    },

    required: true,
    order: 8
  },
  {
    type: 'select',
    label: 'Compañía',
    name: 'company',
    options: (injector: Injector): SelectOption[] => {
      const recobrosService = injector.get<RecobrosService>(RecobrosService);
      return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
        return autoComplete['companySelect']['values'].map(
          (company: Company) => {
            return { label: company.companyName, value: company.id };
          }
        );
      });
    },

    fixedDisplayCondition: (injector: Injector): Promise<boolean> => {
      const recobrosService = injector.get<RecobrosService>(RecobrosService);
      return recobrosService
        .getRecobroAutoComplete()
        .then((autoComplete): boolean => {
          return Boolean(autoComplete['companySelect']['belongCompanyGroup']);
        });
    },
    required: true,
    order: 3
  },
  {
    type: 'select',
    label: 'Ramo',
    useAsSearchFilter: true,
    name: 'branch',
    value: (
      injector: Injector,
      form: NgForm,
      recobro?: Recobro
    ): Promise<string> => {
      if (recobro) {
        const recobrosService = injector.get<RecobrosService>(RecobrosService);
        return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
          const branchField = autoComplete['incidentTypologySelect'].find(
            (incidentTypology) =>
              incidentTypology.id == recobro.incidentTypology
          );
          return branchField ? branchField.branch : '';
        });
      }
      return Promise.resolve('');
    },
    options: (injector: Injector): SelectOption[] => {
      const recobrosService = injector.get<RecobrosService>(RecobrosService);
      return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
        return Object.keys(
          groupBy(autoComplete['incidentTypologySelect'], 'branch')
        ).map((branchName) => {
          return { label: branchName, value: branchName };
        });
      });
    },
    required: true,
    order: 4
  },
  {
    type: 'select',
    label: 'Naturaleza',
    useAsSearchFilter: true,
    name: 'incidentTypology',
    options: [],
    onParentFormValueChanges: (
      prevFormValues: Dictionary<any>,
      nextFormValues: Dictionary<any>,
      injector: Injector,
      componentInstance: DynamicFieldComponent,
      subject: Recobro
    ): void => {
      if (
        nextFormValues.branch &&
        prevFormValues.branch !== nextFormValues.branch
      ) {
        const recobrosService = injector.get<RecobrosService>(RecobrosService);
        recobrosService.getRecobroAutoComplete().then((autoComplete) => {
          componentInstance.field.options = groupBy(
            autoComplete['incidentTypologySelect'],
            'branch'
          )[nextFormValues.branch].map((element) => {
            return { label: element.nature, value: element.id };
          });
          if (subject) {
            if (
              !componentInstance.field.options.find(
                (option) => option.value == String(subject.incidentTypology)
              )
            ) {
              componentInstance.parentForm.controls[
                'incidentTypology'
              ].setValue('');
            }
          } else {
            componentInstance.parentForm.controls['incidentTypology'].setValue(
              ''
            );
          }
        });
      }
    },
    required: true,
    order: 5
  },
  {
    type: 'select',
    label: 'En Nombre De',
    name: 'inNameOf',
    required: true,
    order: 9,
    options: (injector: Injector): Promise<SelectOption[]> =>
      generateOptionsFromAutoComplete(
        injector.get<RecobrosService>(RecobrosService),
        'inNameOfSelect',
        'inNameOf'
      )
  },
  {
    type: 'number',
    label: 'Potencial Compañía',
    name: 'potentialInitialCompany',
    order: 10,
    required: true,
    prefix: '€',
    onParentFormValueChanges: (
      prevFormValues,
      nextFormValues,
      injector: Injector,
      componentInstance: DynamicFieldComponent
    ): void => {
      componentInstance.display =
        nextFormValues.inNameOf == '1' || nextFormValues.inNameOf == '3';
    }
  },
  {
    type: 'number',
    label: 'Potencial Asegurado',
    name: 'initialPersonalPotential',
    order: 11,
    required: true,
    dynamicDisplayCondition: (form: NgForm): boolean => {
      const inNameOfControl = form.controls['inNameOf'];
      if (inNameOfControl) {
        return inNameOfControl.value == '2' || inNameOfControl.value == '3';
      } else {
        return false;
      }
    }
  },
  {
    type: 'select',
    label: 'Empleado Recobrador',
    useAsSearchFilter: true,
    name: 'userAssignment',
    required: true,
    fixedDisplayCondition: (injector: Injector): Promise<boolean> => {
      const rolesService = injector.get<RolesService>(RolesService);
      return rolesService.currentUserCan(
        'ASSIGNMENT_RECOVERY_EMPLOYEE_RECOVERY'
      );
    },
    options: (injector: Injector): Promise<SelectOption[]> => {
      const userService = injector.get<UserService>(UserService);
      return userService.getUsers().then((users) =>
        users
          .filter((user) => user.rol === 'RECOVERY_EMPLOYEE')
          .map((user) => {
            return {
              label: `${user.name} ${user.surname1}`,
              value: (user.id as unknown) as string
            };
          })
      );
    },

    order: 18
  },
  {
    type: 'select',
    label: 'Administrador Recobrador',
    name: 'userAssignment',
    useAsSearchFilter: true,
    required: true,
    fixedDisplayCondition: (injector: Injector): Promise<boolean> => {
      const rolesService = injector.get<RolesService>(RolesService);
      return rolesService.currentUserCan(
        'ASSIGNMENT_RECOVERY_ADMINISTRATOR_RECOVERY'
      );
    },
    options: (injector: Injector): Promise<SelectOption[]> => {
      const userService = injector.get<UserService>(UserService);
      return userService.getUsers().then((users) => {
        console.log('users', users);
        return users
          .filter((user) => user.rol === 'RECOVERY_ADMINISTRATOR')
          .map((user) => {
            return {
              label: user['companyName'],
              value: (user.id as unknown) as string
            };
          });
      });
    },
    onParentFormValueChanges: (
      prevFormValues: Dictionary<any>,
      nextFormValues: Dictionary<any>,
      injector: Injector,
      componentInstance: DynamicFieldComponent
    ): void => {
      if (
        nextFormValues.recoveryRoute &&
        nextFormValues.recoveryRoute !== prevFormValues.recoveryRoute
      ) {
        componentInstance.field.required = nextFormValues.recoveryRoute !== 2;
      }
    },
    order: 18
  },
  {
    type: 'checkbox',
    label: 'Interrumpida Prescripción',
    name: 'prescriptionDiscontinued',
    order: 12
  },
  {
    type: 'date',
    label: 'Fecha Nueva Prescripción',
    name: 'newPrescriptionDate',
    required: true,
    order: 13,
    dynamicDisplayCondition: (form: NgForm): boolean => {
      const prescriptionDiscontinued =
        form.controls['prescriptionDiscontinued'];
      return prescriptionDiscontinued && prescriptionDiscontinued.value == true;
    }
  },
  {
    type: 'text',
    label: 'Compañía Contraria',
    name: 'opposingCompany',
    order: 15
  },
  {
    type: 'text',
    label: 'Causante',
    name: 'causative',
    order: 14
  },
  {
    type: 'select',
    label: 'Interviniente',
    name: 'interveningType',
    order: 16,
    options: (injector: Injector): Promise<SelectOption[]> =>
      generateOptionsFromAutoComplete(
        injector.get<RecobrosService>(RecobrosService),
        'interveningSelect',
        'interveningType'
      )
  },
  {
    type: 'text',
    label: 'Nombre del Interviniente',
    name: 'interveningName',
    order: 17
  },
  {
    type: 'textarea',
    label: 'Observaciones',
    name: 'observations',
    disabled: (injector: Injector): Promise<boolean> => {
      const userService = injector.get<UserService>(UserService);
      return userService
        .getCurrentUser()
        .then((user) =>
          ['RECOVERY_EMPLOYEE', 'RECOVERY_ADMINISTRATOR'].includes(user.rol)
        );
    },
    order: 19
  },
  {
    type: 'select',
    label: 'Motivo Cierre',
    useAsSearchFilter: true,
    name: 'motive',
    context: 'edit',
    options: [],
    onParentFormValueChanges: (
      prevFormValues: Dictionary<any>,
      nextFormValues: Dictionary<any>,
      injector: Injector,
      componentInstance: DynamicFieldComponent,
      subject: Recobro
    ): void => {
      if (
        nextFormValues.resolution &&
        prevFormValues.resolution !== nextFormValues.resolution
      ) {
        const recobrosService = injector.get<RecobrosService>(RecobrosService);
        recobrosService.getRecobroAutoComplete().then((autoComplete) => {
          componentInstance.field.options = groupBy(
            autoComplete['resolutionSelect'],
            'resolution'
          )[nextFormValues.resolution].map((element) => {
            return { label: element.motive, value: element.id };
          });

          if (subject) {
            if (
              !componentInstance.field.options.find(
                (option) => option.value == subject.motive
              )
            ) {
              componentInstance.parentForm.controls['motive'].setValue('');
            }
          }
        });
      }
    },
    section: 'recoveryClose',
    order: 2
  },
  {
    type: 'datetime-local',
    label: 'Fecha Situación',
    name: 'situationDate',
    disabled: true,
    context: 'edit',
    section: 'recoveryStatus',
    order: 2,
    hint: 'Hora representada en zona horaria GMT+2'
  },
  {
    type: 'select',
    label: 'Tipo Parcial',
    options: (injector: Injector): Promise<SelectOption[]> =>
      generateOptionsFromAutoComplete(
        injector.get<RecobrosService>(RecobrosService),
        'partialTypeSelect',
        'partialNameType'
      ),
    dynamicDisplayCondition: (form: NgForm): boolean => {
      const motiveControl = form.controls['motive'];
      if (motiveControl) {
        return motiveControl.value == '2' || motiveControl.value == '4';
      } else {
        return false;
      }
    },
    name: 'partialType',
    context: 'edit',
    section: 'recoveryClose',
    order: 3
  },
  {
    type: 'select',
    label: 'Abogado',
    useAsSearchFilter: true,
    name: 'lawyerName',
    context: 'edit',
    value: (
      injector: Injector,
      form: NgForm,
      recobro: Recobro
    ): Promise<string> => {
      return Promise.resolve(String(recobro.lawyerName || ''));
    },
    options: (injector: Injector): Promise<SelectOption[]> => {
      const lawyersService = injector.get<LawyersService>(LawyersService);
      return lawyersService.getLawyers().then((lawyers) =>
        lawyers
          .filter((lawyer) => lawyer.active)
          .map((lawyer) => {
            return {
              label: [lawyer.name, lawyer.surname1, lawyer.surname2].join(' '),
              value: String(lawyer.id)
            };
          })
      );
    },
    order: 4,
    section: 'recoverySituation'
  },
  {
    type: 'select',
    label: 'Resolución Recobro',
    useAsSearchFilter: true,
    name: 'resolution',
    value: (
      injector: Injector,
      form: NgForm,
      recobro?: Recobro
    ): Promise<string> => {
      if (recobro) {
        const recobrosService = injector.get<RecobrosService>(RecobrosService);
        return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
          const resolutionField = autoComplete['resolutionSelect'].find(
            (resolution) => resolution.id == recobro.motive
          );
          return resolutionField ? resolutionField.resolution : '';
        });
      }
      return Promise.resolve('');
    },
    options: (injector: Injector): SelectOption[] => {
      const recobrosService = injector.get<RecobrosService>(RecobrosService);
      const rolesService = injector.get<RolesService>(RolesService);

      return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
        const options: SelectOption[] = Object.keys(
          groupBy(autoComplete['resolutionSelect'], 'resolution')
        ).map((resolutionTypeName) => {
          return { label: resolutionTypeName, value: resolutionTypeName };
        });

        return Promise.all(
          options.map((option) => {
            if (option.value === 'Cierre por error') {
              return rolesService
                .currentUserCan('SELECT_FAILED_CLOSURE_RECOVERY')
                .then((currentUserCan) => {
                  if (!currentUserCan) {
                    option.disabled = true;
                  }
                  return option;
                });
            }
            return option;
          })
        );
      });
    },
    context: 'edit',
    section: 'recoveryClose',
    order: 1
  },
  {
    type: 'select',
    label: 'Situación Judicial',
    useAsSearchFilter: true,
    name: 'judicialSituation',
    context: 'edit',
    options: (injector: Injector): Promise<SelectOption[]> =>
      generateOptionsFromAutoComplete(
        injector.get<RecobrosService>(RecobrosService),
        'judicialSituationSelect',
        'judicialSituation'
      ),
    section: 'recoverySituation',
    order: 2
  },
  {
    type: 'datetime-local',
    label: 'Fecha Fase Judicial',
    name: 'courtDate',
    context: 'edit',
    section: 'recoverySituation',
    disabled: true,
    order: 3
  },
  {
    type: 'date',
    label: 'Fecha Encargo',
    section: 'recoverySituation',
    disabled: true,
    name: 'judicialDate',
    context: 'edit',
    order: 1
  },
  {
    type: 'select',
    label: 'Jurisdicción',
    name: 'jurisdiction',
    options: (injector: Injector): Promise<SelectOption[]> =>
      generateOptionsFromAutoComplete(
        injector.get<RecobrosService>(RecobrosService),
        'jurisdictionSelect',
        'type'
      ),
    context: 'edit',
    section: 'recoverySituation',
    order: 5
  },
  {
    type: 'select',
    label: 'Estado Gestión',
    useAsSearchFilter: true,
    order: 1,
    name: 'situationManagement',
    options: (injector: Injector): Promise<SelectOption[]> => {
      const recobrosService = injector.get<RecobrosService>(RecobrosService);
      const rolesService = injector.get<RolesService>(RolesService);
      // const taxonomyService = injector.get<TaxonomyService>(TaxonomyService);

      // taxonomyService.getTermsFromTaxonomy('estado-gestion').then((terms) => {
      //   return Promise.all([
      //     terms.map((term) => {
      //       const option: SelectOption = {
      //         label: term.name,
      //         value: String(term.id)
      //       };
      //       // read-only option
      //       if (term.slug === 'en-fase-judicial') {
      //         option.disabled = true;
      //       } else if (term.slug === 'pendiente-aprobacion-pase-judicial') {
      //         return rolesService
      //           .currentUserCan('SELECT_PENDING_AUTHORIZATION_COMPANY')
      //           .then((currentUserCan) => {
      //             option.disabled = !currentUserCan;
      //             return option;
      //           });
      //       }
      //       return option;
      //     })
      //   ]);
      // }).catch(console.error);

      return recobrosService.getRecobroAutoComplete().then((autoComplete) => {
        const JUDICIAL_STATE_ID = 7;
        const PENDING_AUTHORIZATION_JUDICIAL_STATE_ID = 6;
        return Promise.all(
          autoComplete['situationManagementSelect'].map((element) => {
            const option: SelectOption = {
              label: element['resolution'],
              value: element['id']
            };
            if (Number(option.value) === JUDICIAL_STATE_ID) {
              option.disabled = true;
              return option;
            } else if (
              Number(option.value) === PENDING_AUTHORIZATION_JUDICIAL_STATE_ID
            ) {
              return rolesService
                .currentUserCan('SELECT_PENDING_AUTHORIZATION_COMPANY')
                .then((currentUserCan) => {
                  if (!currentUserCan) {
                    option.disabled = true;
                  }
                  return option;
                });
            }
            return option;
          })
        );
      });
    },
    context: 'edit',
    section: 'recoveryStatus'
  },
  {
    type: 'select',
    label: 'Aprobación Judicial',
    name: 'judicialApproval',
    context: 'edit',
    section: 'recoveryStatus',
    order: 3,
    options: [
      {
        label: 'Autorizado',
        value: 'AUTHORIZED'
      },
      {
        label: 'Pendiente',
        value: 'PENDING'
      },
      {
        label: 'Rechazado',
        value: 'UNAUTHORIZED'
      }
    ],
    disabled: (
      injector: Injector,
      form: NgForm,
      recobro: Recobro
    ): Promise<boolean> => {
      const rolesService = injector.get<RolesService>(RolesService);
      // const taxonomyService = injector.get<TaxonomyService>(TaxonomyService);
      // return Promise.all([
      //   taxonomyService.getTermBySlug('pendiente-aprobacion-pase-judicial', 'estado-gestion'),
      //   rolesService.currentUserCan('JUDICIAL_APPROVAL')
      // ]).then((res) => {
      //   const [term, currentUserCan] = res;
      //   return currentUserCan && term.id == recobro.situationManagement;
      // });
      const PENDING_APPROVAL_STATE_ID = 6;
      return rolesService
        .currentUserCan('JUDICIAL_APPROVAL')
        .then(
          (res) =>
            !(res && recobro.situationManagement == PENDING_APPROVAL_STATE_ID)
        );
    }
  }
];
