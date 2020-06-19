import { Component, OnInit, ViewChild } from "@angular/core";
import { RecobrosService } from "projects/recobros/src/app/core/services/recobros.service";
import { Recobro } from "projects/recobros/src/app/shared/models/recobro";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Field } from "projects/recobros/src/app/shared/models/field";
import { groupBy } from "lodash";
import { Subscription } from "rxjs";
import { LawyersService } from "projects/recobros/src/app/core/services/lawyers.service";
import { UserService } from "projects/recobros/src/app/core/services/user.service";
import { RolesService } from "projects/recobros/src/app/core/services/roles.service";
import { AlertService } from "projects/recobros/src/app/core/services/alert.service";

@Component({
  selector: "alvea-edit-recobro",
  templateUrl: "./edit-recobro.component.html",
  styleUrls: ["./edit-recobro.component.scss"],
})
export class EditRecobroComponent implements OnInit {
  loadingAction: boolean;
  allFields = {};
  sortedFieldLabels = ["recoveryInfo", "recoveryStatus"]; //];"recoverySituation", "recoveryClose"
  editRecobroFields: Field[] = [];
  editStatusFields: Field[] = [];
  editSituationFields: Field[] = [];
  formChangesSubscription: Subscription;
  lastFormValues = {};
  recobro: Recobro;
  id;
  promiseResolve = Promise.resolve;
  constructor(
    private recobrosService: RecobrosService,
    private route: ActivatedRoute,
    private lawyersService: LawyersService,
    private userService: UserService,
    private rolesService: RolesService,
    private alertService: AlertService,
    private router: Router
  ) {}

  @ViewChild("editRecobroForm") editRecobroForm: NgForm;
  ngOnInit(): void {
    (async () => {
      this.id = this.route.snapshot.paramMap.get("id") || "";
      this.recobro = await this.recobrosService.getRecobro(this.id);
      this.recobrosService.getRecobrosFields.call(this, "edit", this.recobro).then((fields) => {
        this.allFields = groupBy(
          fields.map((field) => ((field.section = field.section || "recoveryInfo"), field)),
          "section"
        );
      });
    })();
  }

  ngAfterViewInit(): void {
    this.formChangesSubscription = this.editRecobroForm.form.valueChanges.subscribe(
      (formValues) => {
        if (formValues.branch !== this.lastFormValues["branch"]) {
          this.recobrosService.getRecobroAutoComplete().then((autoComplete) => {
            const incidentTypologyField = this.allFields["recoveryInfo"].find(
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
                  (option) => option.value == String(this.recobro.incidentTypology)
                )
              ) {
                this.editRecobroForm.form.controls["incidentTypology"].setValue("");
              }
            }
          });
        }

        this.lastFormValues = formValues;
      }
    );
  }

  editRecobro(form: NgForm): void {
    this.loadingAction = true;
    this.recobrosService
      .editRecobro(form.value, this.id)
      .then((res) => {
        this.alertService.success("Yay!");
      })
      .catch(console.error)
      .finally(() => {
        this.loadingAction = false;
      });
  }
}
