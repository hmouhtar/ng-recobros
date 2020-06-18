import { Field } from "./field";
import { Company } from "./company";
import { RecobrosService } from "../../core/services/recobros.service";
import { groupBy } from "lodash";
import { NgForm } from "@angular/forms";
import { LawyersService } from "../../core/services/lawyers.service";
import { UserService } from "../../core/services/user.service";
import { RolesService } from "../../core/services/roles.service";

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
  recoverySituation: "PENDING" | "FINISHED";
  incidentTypology: number;
  key: { sinisterNumber: string; codSinister: number };
  assuredCashFlow?: number;
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
  judicialApproval?: "AUTHORIZED" | "UNAUTHORIZED";
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
  recoveryCode?: number;

  static getRecobroFields(): Field[] {
    return [
      {
        type: "text",
        label: "N. Siniestro",
        name: "sinisterNumber",
        required: true,
        disabled: true,
        order: 1,
      },
      {
        type: "text",
        label: "N. Encargo",
        name: "codSinister",
        disabled: true,
        required: true,
        value: function () {
          return `${arguments[0]["sinisterNumber"]}_${arguments[0]["codSinister"]}`;
        },
        order: 2,
        context: "edit",
      },
      {
        type: "datetime",
        label: "Fecha de Resolución",
        name: "resolutionDate",
        section: "recoveryClose",
        context: "edit",
      },
      {
        type: "number",
        label: "Minutas - Suplidos",
        name: "suppliesFee",
        section: "recoveryClose",
        context: "edit",
        prefix: "€",
      },
      {
        type: "number",
        label: "Minutas - Procurador",
        name: "attorneyFee",
        section: "recoveryClose",
        context: "edit",
        prefix: "€",
      },
      {
        type: "number",
        label: "Minutas - Abogado Judicial",
        name: "lawyerFee",
        section: "recoveryClose",
        context: "edit",
        prefix: "€",
      },
      {
        type: "number",
        label: "Minutas - Recobrador Amistoso",
        name: "recoveryFee",
        section: "recoveryClose",
        context: "edit",
        prefix: "€",
      },
      {
        type: "number",
        label: "Cobro asegurado",
        name: "assuredCashFlow",
        section: "recoveryClose",
        context: "edit",
        prefix: "€",
      },
      {
        type: "checkbox",
        label: "Importe aplazado",
        name: "deferredAmount",
        section: "recoveryClose",
        context: "edit",
      },
      {
        type: "datetime",
        label: "Inicio Recobro",
        name: "initDate",
        required: true,
        disabled: true,
        context: "edit",
        order: 7,
      },
      {
        type: "select",
        label: "Situación de recobro",
        name: "recoverySituation",
        options: [
          {
            label: "Pendiente",
            value: "PENDING",
          },
          {
            label: "Terminado",
            value: "FINISHED",
          },
        ],
        required: true,
        order: 6,
      },
      {
        type: "select",
        label: "Vía Recobro",
        name: "recoveryRoute",
        options: function () {
          return (this["recobrosService"] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete["recoveryRouteSelect"].map((element) => {
                return {
                  label: element["route"],
                  value: element["id"],
                };
              });
            });
        },
        required: true,

        order: 8,
      },
      {
        type: "select",
        label: "Compañía",
        name: "company",
        // required: true,
        options: function () {
          return (this["recobrosService"] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete["companySelect"].map((company: Company) => {
                return { label: company.companyName, value: company.id };
              });
            });
        },
        required: true,
        order: 3,
      },
      {
        type: "select",
        label: "Ramo",
        name: "branch",
        value: function () {
          if (arguments[0]) {
            return (this["recobrosService"] as RecobrosService)
              .getRecobroAutoComplete()
              .then((autoComplete) => {
                const branchField = autoComplete["incidentTypologySelect"].find(
                  (incidentTypology) => incidentTypology.id == arguments[0].incidentTypology
                );
                return branchField ? branchField.branch : "";
              });
          }
        },
        options: function () {
          return (this["recobrosService"] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return Object.keys(groupBy(autoComplete["incidentTypologySelect"], "branch")).map(
                (branchName) => {
                  return { label: branchName, value: branchName };
                }
              );
            });
        },
        required: true,
        order: 4,
      },
      {
        type: "select",
        label: "Naturaleza",
        name: "incidentTypology",
        options: [],
        required: true,
        order: 5,
      },

      {
        type: "select",
        label: "En Nombre De",
        name: "inNameOf",
        required: true,
        order: 9,
        options: function () {
          return (this["recobrosService"] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete["inNameOfSelect"].map((element) => {
                return {
                  label: element["inNameOf"],
                  value: element["id"],
                };
              });
            });
        },
      },
      {
        type: "number",
        label: "Potencial Compañía",
        name: "potentialInitialCompany",
        order: 10,
        required: true,
        prefix: "€",
        displayCondition: function () {
          let inNameOfControl = (arguments[0].form as NgForm).controls["inNameOf"];
          if (inNameOfControl) {
            return inNameOfControl.value == "1" || inNameOfControl.value == "3";
          } else {
            return false;
          }
        },
      },
      {
        type: "number",
        label: "Potencial Asegurado",
        name: "initialPersonalPotential",
        order: 11,
        required: true,
        prefix: "€",
        displayCondition: function () {
          let inNameOfControl = (arguments[0].form as NgForm).controls["inNameOf"];

          if (inNameOfControl) {
            return inNameOfControl.value == "2" || inNameOfControl.value == "3";
          } else {
            return false;
          }
        },
      },
      {
        type: "select",
        label: "Empleado Recobrador",
        name: "userAssignment",
        displayCondition: function () {
          return (this["rolesService"] as RolesService)
            .currentUserCan("ASSIGNMENT_RECOVERY_EMPLOYEE_RECOVERY")
            .then((res) => () => res);
        },
        displayConditionFixed: true,
        options: function () {
          return (this["userService"] as UserService).getUsers().then((users) =>
            users
              .filter((user) => user.rol === "RECOVERY_EMPLOYEE")
              .map((user) => {
                return {
                  label: user["fullName"],
                  value: String(user.id),
                };
              })
          );
        },
        context: "edit",
        order: 18,
      },
      {
        type: "select",
        label: "Administrador Recobrador",
        name: "userAssignment",
        displayCondition: function () {
          return (this["rolesService"] as RolesService)
            .currentUserCan("ASSIGNMENT_RECOVERY_ADMINISTRATOR_RECOVERY")
            .then((res) => () => res);
        },
        displayConditionFixed: true,
        options: function () {
          return (this["userService"] as UserService).getUsers().then((users) =>
            users
              .filter((user) => user.rol === "RECOVERY_ADMINISTRATOR")
              .map((user) => {
                return {
                  label: user["companyName"],
                  value: String(user.id),
                };
              })
          );
        },
        context: "edit",
        order: 18,
      },

      {
        type: "checkbox",
        label: "Interrumpida Prescripción",
        name: "prescriptionDiscontinued",
        order: 12,
      },
      {
        type: "datetime",
        label: "Fecha Nueva Prescripción",
        name: "newPrescriptionDate",
        required: true,
        order: 13,
        displayCondition: function () {
          const prescriptionDiscontinued = (arguments[0].form as NgForm).controls[
            "prescriptionDiscontinued"
          ];
          return prescriptionDiscontinued && prescriptionDiscontinued.value == true;
        },
      },
      {
        type: "text",
        label: "Compañía Contraria",
        name: "opposingCompany",
        order: 15,
      },
      {
        type: "text",
        label: "Causante",
        name: "causative",
        order: 14,
      },
      {
        type: "select",
        label: "Interviniente",
        name: "interveningType",
        order: 16,
        options: function () {
          return (this["recobrosService"] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete["interveningSelect"].map((element) => {
                return {
                  label: element["interveningType"],
                  value: element["id"],
                };
              });
            });
        },
      },
      {
        type: "text",
        label: "Nombre del Interviniente",
        name: "interveningName",
        order: 17,
      },
      {
        type: "textarea",
        label: "Observaciones",
        name: "observations",
        order: 19,
      },
      {
        type: "select",
        label: "Motivo Cierre",
        name: "motive",
        context: "edit",
        options: [],
        section: "recoveryClose",
      },
      {
        type: "datetime",
        label: "Fecha Situación",
        name: "situationDate",
        context: "edit",
        section: "recoveryStatus",
      },
      {
        type: "select",
        label: "Tipo Parcial",
        options: [],
        displayCondition: function () {
          return true;
        },
        name: "partialType",
        context: "edit",
        section: "recoveryClose",
      },
      {
        type: "select",
        label: "Abogado",
        name: "lawyerName",
        context: "edit",
        options: function () {
          return (this["lawyersService"] as LawyersService).getLawyers().then((lawyers) =>
            lawyers
              .filter((lawyer) => lawyer.active)
              .map((lawyer) => {
                return {
                  label: [lawyer.name, lawyer.surname1, lawyer.surname2].join(" "),
                  value: String(lawyer.id),
                };
              })
          );
        },
        section: "recoverySituation",
      },
      {
        type: "select",
        label: "Resolución Recobro",
        name: "resolution",
        options: [],
        context: "edit",
        section: "recoveryClose",
      },
      {
        type: "select",
        label: "Situación Judicial",
        name: "judicialSituation",
        context: "edit",
        options: [],
        section: "recoverySituation",
      },
      {
        type: "datetime",
        label: "Fecha Fase Judicial",
        name: "judicialDate",
        context: "edit",
        section: "recoverySituation",
      },

      {
        type: "select",
        label: "Jurisdicción",
        name: "jurisdiction",
        options: [],
        context: "edit",
        section: "recoverySituation",
      },
      {
        type: "select",
        label: "Estado Gestión",
        name: "situationManagement",
        options: function () {
          return (this["recobrosService"] as RecobrosService)
            .getRecobroAutoComplete()
            .then((autoComplete) => {
              return autoComplete["situationManagementSelect"].map((element) => {
                return {
                  label: element["resolution"],
                  value: element["id"],
                };
              });
            });
        },
        context: "edit",
        section: "recoveryStatus",
      },
      {
        type: "checkbox",
        label: "Aprobación Judicial",
        name: "judicialApproval",
        context: "edit",
        section: "recoveryStatus",
      },
    ];
  }
}
