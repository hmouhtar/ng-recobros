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

  getLawyers() {}

  deleteLawyer(id) {
    return this.http
      .delete(`${Config.apiURL}/api/login/user?${id}`, {
        responseType: 'text',
      })
      .toPromise();
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
