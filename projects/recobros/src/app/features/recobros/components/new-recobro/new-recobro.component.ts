import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { RecobrosService } from "projects/recobros/src/app/core/services/recobros.service";
import { Field } from "projects/recobros/src/app/shared/models/field";
import { NgForm } from "@angular/forms";
import { AlertService } from "projects/recobros/src/app/core/services/alert.service";
import { groupBy } from "lodash";
import { Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { Router } from "@angular/router";
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
  formChangesSubscription: Subscription;
  lastFormValues = {};
  @ViewChild("newRecobroForm") newRecobroForm: NgForm;

  constructor(
    private recobrosService: RecobrosService,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recobrosService.getRecobrosFields.call(this, "new").then((fields) => {
      this.newRecobroFields = fields;
    });
  }

  ngAfterViewInit(): void {
    this.formChangesSubscription = this.newRecobroForm.form.valueChanges.subscribe(
      (formValues) => {
        if (
          formValues.branch &&
          formValues.branch !== this.lastFormValues["branch"]
        ) {
          this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
            const incidentTypologyField = this.newRecobroFields.find(
              (field) => field.name === "incidentTypology"
            );

            if (incidentTypologyField) {
              incidentTypologyField.options = groupBy(
                autoComplete["incidentTypologySelect"],
                "branch"
              )[formValues.branch].map((element) => {
                return { label: element.nature, value: element.id };
              });

              this.newRecobroForm.form.controls["incidentTypology"].setValue(
                ""
              );
            }
          });
        }

        this.lastFormValues = formValues;
      }
    );
  }

  createNewRecobro(form: NgForm): void {
    this.loadingAction = true;
    this.recobrosService
      .createRecobro(form.value)
      .then(() => {
        this.alertService.success("Yay!");
        this.router.navigate(["/recobros"], {});
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
