import { Injectable } from "@angular/core";
import { Config } from "projects/recobros/src/constants";
import { HttpClient } from "@angular/common/http";
import { Lawyer } from "../../shared/models/lawyer";
import { Field } from "../../shared/models/field";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LawyersService {
  constructor(private http: HttpClient) {}

  createLawyer(data): Promise<any> {
    return this.http.post(`${Config.apiURL}/api/lawyer`, data).toPromise();
  }

  getLawyers(): Promise<Lawyer[]> {
    return this.http
      .get<Lawyer[]>(`${Config.apiURL}/api/lawyer`)
      .pipe(map((lawyer) => lawyer["data"]))
      .toPromise();
  }

  deleteLawyer(id): Promise<any> {
    return this.http.delete(`${Config.apiURL}/api/lawyer/${id}`).toPromise();
  }

  editLawyer(id: number, data): Promise<any> {
    return this.http.put(`${Config.apiURL}/api/lawyer/${id}`, data).toPromise();
  }

  getLawyerFields(context: "new" | "edit", lawyer?: Lawyer): Promise<Field[]> {
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
