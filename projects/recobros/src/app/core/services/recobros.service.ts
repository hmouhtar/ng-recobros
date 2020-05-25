import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from 'projects/recobros/src/constants';
import { Field } from '../../shared/models/field';
import { Recobro } from '../../shared/models/recobro';

@Injectable({
  providedIn: 'root',
})
export class RecobrosService {
  constructor(private http: HttpClient) {}

  public getAllRecobros(
    page: number = 0,
    size: number = 25,
    sort: string = 'name,asc'
  ) {
    return this.http
      .get(`${Config.apiURL}/api/manager/recoveries`, {
        params: {
          page: String(page),
          size: String(size),
          sort,
        },
      })
      .toPromise();
  }

  getRecobrosFields(
    context: 'new' | 'edit',
    recobro?: Recobro
  ): Promise<Field[]> {
    return Field.processField.call(
      this,
      Recobro.getRecobroFields().filter(
        (field) => field.context === undefined || field.context === context
      ),
      context,
      recobro
    );
  }
}
