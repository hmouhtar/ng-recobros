import { Injectable } from '@angular/core';
import { Config } from 'projects/recobros/src/constants';
import { HttpClient } from '@angular/common/http';
import { Lawyer } from '../../shared/models/lawyer';
import { map } from 'rxjs/operators';
import { PageRequest, Page } from './paginated.datasource';

@Injectable({
  providedIn: 'root'
})
export class LawyersService {
  constructor(private http: HttpClient) {}

  createLawyer(data): Promise<any> {
    return this.http.post(`${Config.apiURL}/api/lawyer`, data).toPromise();
  }

  getLawyersPage(request: PageRequest<Lawyer>) {
    return this.http
      .get<Page<Lawyer>>(`${Config.apiURL}/api/lawyer`, {
        params: {
          size: String(request.size),
          page: String(request.page),
          sort: `${request.sort?.property},${request.sort?.order}`
        }
      })
      .pipe(map((res) => res['data']));
  }
  getLawyers(): Promise<Lawyer[]> {
    return this.http
      .get<Lawyer[]>(`${Config.apiURL}/api/lawyer`)
      .pipe(map((lawyer) => lawyer['data']['content']))
      .toPromise();
  }

  deleteLawyer(id): Promise<any> {
    return this.http.delete(`${Config.apiURL}/api/lawyer/${id}`).toPromise();
  }

  editLawyer(id: number, data): Promise<any> {
    return this.http.put(`${Config.apiURL}/api/lawyer/${id}`, data).toPromise();
  }
}
