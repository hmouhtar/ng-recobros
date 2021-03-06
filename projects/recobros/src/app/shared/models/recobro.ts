export interface Recobro {
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
  lawyerName?: string;
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
  motive;
  branch;
}
