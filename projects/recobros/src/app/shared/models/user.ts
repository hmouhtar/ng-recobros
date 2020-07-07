import { Company } from './company';

export interface User {
  id: number;
  surname1: string;
  surname2: string;
  username: string;
  activate: boolean;
  emailAddress: string;
  loginAttempt: number;
  name: string;
  owner: string;
  phoneNumber: string;
  rol: string;
  password: string;
  scope: string;
  company: Company;
}
