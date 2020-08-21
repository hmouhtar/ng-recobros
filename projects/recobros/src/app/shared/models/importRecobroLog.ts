export interface ImportRecobroLog {
  date: string;
  loadStatus: 'SUCCESFUL' | 'FAILED';
  observations: string;
  payMethod: 'MANUAL' | 'AUTOMATIC';
  records: number;
  username: string;
}
