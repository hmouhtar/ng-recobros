import { Component, OnInit, ViewChild } from "@angular/core";
import { RecobrosService } from "projects/recobros/src/app/core/services/recobros.service";
import { Field } from "projects/recobros/src/app/shared/models/field";
import { NgForm } from "@angular/forms";
import { AlertService } from "projects/recobros/src/app/core/services/alert.service";
@Component({
  selector: "alvea-new-recobro",
  templateUrl: "./new-recobro.component.html",
  styleUrls: ["./new-recobro.component.scss"],
})
export class NewRecobroComponent implements OnInit {
  newRecobroFields: Field[] = [];
  roles: Promise<string[]>;
  loadingAction = false;
  incidentTypologies: any[];
  @ViewChild("newRecobroForm") newRecobroForm: NgForm;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.recobrosService.getRecobrosFields.call(this, "new").then((fields) => {
      this.newRecobroFields = fields;
    });
  }

  createNewRecobro(form: NgForm): void {
    this.loadingAction = true;
    this.recobrosService
      .createRecobro(form.value)
      .then(() => {
        this.alertService.success("Yay!");
        //this.router.navigate(['/users'], {});
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
