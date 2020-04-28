import { User } from './user';

export class EmployeeManager extends User {
  company: number;
  type: 'INTERNAL' | 'EXTERNAL';
}
