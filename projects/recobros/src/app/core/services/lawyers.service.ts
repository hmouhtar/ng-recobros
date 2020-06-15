import { Injectable } from '@angular/core';
import { Config } from 'projects/recobros/src/constants';
import { HttpClient } from '@angular/common/http';
import { Lawyer } from '../../shared/models/lawyer';
import { Field } from '../../shared/models/field';

@Injectable({
  providedIn: 'root',
})
export class LawyersService {
  constructor(private http: HttpClient) {}

  createLawyer(data) {
    return this.http.post(`${Config.apiURL}/api/lawyer`, data).toPromise();
  }

  getLawyers(): Promise<Lawyer[]> {
    return this.http.get<Lawyer[]>(`${Config.apiURL}/api/lawyer`).toPromise();
  }

  deleteLawyer(id) {
    return this.http.delete(`${Config.apiURL}/api/lawyer/${id}`).toPromise();
  }

  editLawyer(id: number, data) {
    return this.http.put(`${Config.apiURL}/api/lawyer/${id}`, data).toPromise();
  }

  getLawyerFields(context: 'new' | 'edit', lawyer?: Lawyer): Promise<Field[]> {
    return Field.processField.call(
      this,
      Lawyer.getLawyerFields().filter(
        (field) => field.context === undefined || field.context === context
      ),
      context,
      lawyer
    );
  }
}
