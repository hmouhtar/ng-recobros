export class User {
  companyCode: string;
  emailAddress: string;
  name: string;
  nif: string;
  password: string;
  phoneNumber: string;
  recoveryDepartment: string;
  recoveryDepartmentType: 'INTERNAL' | 'EXTERNAL';
  recoveryManager: string;
  rol: 'COMPANY_MANAGER' | 'EMPLOYEE_MANAGER' | 'EMPLOYEE';
  surname1: string;
  surname2: string;
  username: string;
}
