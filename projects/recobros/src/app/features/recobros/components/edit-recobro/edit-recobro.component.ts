import { Component, OnInit, ViewChild } from "@angular/core";
import { RecobrosService } from "projects/recobros/src/app/core/services/recobros.service";
import { Recobro } from "projects/recobros/src/app/shared/models/recobro";
import { ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Field } from "projects/recobros/src/app/shared/models/field";
import { groupBy } from "lodash";
import { Subscription } from "rxjs";
import { fileURLToPath } from "url";

@Component({
  selector: "alvea-edit-recobro",
  templateUrl: "./edit-recobro.component.html",
  styleUrls: ["./edit-recobro.component.scss"],
})
export class EditRecobroComponent implements OnInit {
  loadingAction: boolean;
  editRecobroFields: Field[] = [];
  editStatusFields: Field[] = [];
  editSituationFields: Field[] = [];

  formChangesSubscription: Subscription;
  lastFormValues = {};
  recobro: Recobro;
  constructor(
    private recobrosService: RecobrosService,
    private route: ActivatedRoute
  ) {}

  @ViewChild("editRecobroForm") editRecobroForm: NgForm;
  ngOnInit(): void {
    (async () => {
      this.recobro = await this.recobrosService.getRecobro(
        this.route.snapshot.paramMap.get("sinisterNumber") || "",
        this.route.snapshot.paramMap.get("codSinister") || ""
      );
      this.recobrosService.getRecobrosFields
        .call(this, "edit", this.recobro)
        .then((fields) => {
          this.editRecobroFields = fields.filter((field) => !field.section);
          this.editStatusFields = fields.filter(
            (field) => field.section === "recoveryStatus"
          );
        });
    })();
  }

  ngAfterViewInit(): void {
    this.formChangesSubscription = this.editRecobroForm.form.valueChanges.subscribe(
      (formValues) => {
        if (formValues.branch !== this.lastFormValues["branch"]) {
          this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
            const incidentTypologyField = this.editRecobroFields.find(
              (field) => field.name === "incidentTypology"
            );
            if (incidentTypologyField) {
              incidentTypologyField.options = groupBy(
                autoComplete["incidentTypologySelect"],
                "branch"
              )[formValues.branch].map((element) => {
                return { label: element.nature, value: element.id };
              });

              if (
                !incidentTypologyField.options.find(
                  (option) =>
                    option.value == String(this.recobro.incidentTypology)
                )
              ) {
                incidentTypologyField.value = "";
              }
            }
          });
        }

        this.lastFormValues = formValues;
      }
    );
  }

  editRecobro(form: NgForm): void {
    // this.loadingAction = true;
    // this.userService
    //   .editUser(this.user.id, form.value)
    //   .then((res) => {
    //     this.alertService.success('Yay!');
    //   })
    //   .catch(console.error)
    //   .finally(() => {
    //     this.loadingAction = false;
    //   });
  }
}
