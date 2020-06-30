import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from 'projects/recobros/src/constants';
import { Field } from '../../shared/models/field';
import { Recobro } from '../../shared/models/recobro';
import { map } from 'rxjs/operators';
import { PageRequest, Page } from './paginated.datasource';

@Injectable({
  providedIn: 'root'
})
export class RecobrosService {
  constructor(private http: HttpClient) {}
  private _autoComplete;

  getAllRecobros(page = 0, size = 25, sort = 'id,asc'): Promise<Recobro[]> {
    return this.http
      .get<Recobro[]>(`${Config.apiURL}/api/manager/recoveries`, {
        params: {
          page: String(page),
          size: String(size),
          sort
        }
      })
      .pipe(map((getUsersRequest) => getUsersRequest['data']['content']))
      .toPromise();
  }

  getRecobrosPage(request: PageRequest<Recobro>) {
    return this.http
      .get<Page<Recobro>>(`${Config.apiURL}/api/manager/recoveries`, {
        params: {
          size: String(request.size),
          page: String(request.page),
          sort: `${request.sort?.property},${request.sort?.order}`
        }
      })
      .pipe(map((res) => res['data']));
  }

  getRecobro(id): Promise<Recobro> {
    return this.http
      .get<Recobro>(`${Config.apiURL}/api/manager/recovery/info/${id}`)
      .pipe(map((recobro) => recobro['data']))
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

  getRecobroAutoComplete() {
    if (!this._autoComplete) {
      this._autoComplete = this.http
        .get(`${Config.apiURL}/api/manager/recovery/autocomplete`)
        .pipe(map((data) => data['data']))
        .toPromise();
    }

    return this._autoComplete;
  }

  createRecobro(data) {
    return this.http
      .post(`${Config.apiURL}/api/manager/recovery`, data)
      .toPromise();
  }

  editRecobro(data, id) {
    return this.http
      .put(`${Config.apiURL}/api/manager/recovery/edit/${id}`, data)
      .toPromise();
  }
}
