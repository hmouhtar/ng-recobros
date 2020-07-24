import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from 'projects/recobros/src/constants';
import { Recobro } from '../../shared/models/recobro';
import { map } from 'rxjs/operators';
import { PageRequest, Page } from './paginated.datasource';
import { Observable } from 'rxjs';
import { HttpResponse } from '../../shared/models/http-response';

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

  getRecobrosPage(request: PageRequest<Recobro>): Observable<Page<Recobro>> {
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
      .get<HttpResponse<Recobro>>(
        `${Config.apiURL}/api/manager/recovery/info/${id}`
      )
      .pipe(map((recobro) => recobro['data']))
      .toPromise();
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

  createRecobro(data: Recobro): Promise<boolean> {
    return this.http
      .post<HttpResponse<[]>>(`${Config.apiURL}/api/manager/recovery`, data)
      .toPromise()
      .then(() => true);
  }

  editRecobro(data: Recobro, id): Promise<boolean> {
    return this.http
      .put<HttpResponse<[]>>(
        `${Config.apiURL}/api/manager/recovery/edit/${id}`,
        data
      )
      .toPromise()
      .then(() => true);
  }

  importRecobros(file: File | Blob): Promise<boolean> {
    const formData = new FormData();
    formData.append('file', file, (file as File).name || 'unnamed_file.csv');
    return this.http
      .post<HttpResponse<[]>>(`${Config.apiURL}/api/csv/upload`, formData)
      .toPromise()
      .then(() => true);
  }
}
