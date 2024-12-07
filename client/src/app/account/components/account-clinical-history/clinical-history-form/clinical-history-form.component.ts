import { CommonModule } from "@angular/common";
import { Component, inject, model, effect } from "@angular/core";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { BadRequest } from "src/app/_models/forms/error";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { MedicalRecord } from "src/app/_models/medicalRecords/medicalRecord";
import { MedicalRecordForm } from "src/app/_models/medicalRecords/medicalRecordForm";
import { AccountService } from "src/app/_services/account.service";
import { SnackbarService } from "src/app/_services/snackbar.service";
import { ColorBlindnessesService } from "src/app/colorBlindnesses/colorBlindnesses.config";
import { ConsumptionLevelsService } from "src/app/consumptionLevels/consumptionLevels.config";
import { DiseasesService } from "src/app/diseases/diseases.config";
import { EducationLevelsService } from "src/app/educationLevels/educationLevels.config";
import { MaritalStatusesService } from "src/app/maritalStatuses/maritalStatuses.config";
import { OccupationsService } from "src/app/occupations/occupations.config";
import { RelativeTypesService } from "src/app/relativeTypes/relativeTypes.config";
import { SubstancesService } from "src/app/substances/substances.config";

@Component({
  selector: 'div[clinicalHistoryForm]',
  standalone: true,
  imports: [ CommonModule, Forms2Module, ],
  templateUrl: './clinical-history-form.component.html'
})
export class ClinicalHistoryFormComponent {
  snackbarService = inject(SnackbarService);
  accountService = inject(AccountService);

  occupations = inject(OccupationsService);
  relativeTypes = inject(RelativeTypesService);
  colorBlindnesses = inject(ColorBlindnessesService);
  maritalStatuses = inject(MaritalStatusesService);
  educationLevels = inject(EducationLevelsService);
  substances = inject(SubstancesService);
  consumptionLevels = inject(ConsumptionLevelsService);
  diseases = inject(DiseasesService);

  medicalRecord = model.required<MedicalRecord>();

  form = new MedicalRecordForm();

  constructor() {
    this.occupations.getOptions().subscribe();
    this.relativeTypes.getOptions().subscribe();
    this.colorBlindnesses.getOptions().subscribe();
    this.maritalStatuses.getOptions().subscribe();
    this.educationLevels.getOptions().subscribe();
    this.substances.getOptions().subscribe();
    this.consumptionLevels.getOptions().subscribe();
    this.diseases.getOptions().subscribe();

    effect(() => {
      console.log('effect');

      this.form.occupationOptions = this.occupations.options();
      this.form.relativeTypeOptions = this.relativeTypes.options();
      this.form.colorBlindnessOptions = this.colorBlindnesses.options();
      this.form.maritalStatusOptions = this.maritalStatuses.options();
      this.form.educationLevelOptions = this.educationLevels.options();
      this.form.substanceOptions = this.substances.options();
      this.form.consumptionLevelOptions = this.consumptionLevels.options();
      this.form.diseaseOptions = this.diseases.options();

      this.form.controls.occupation.selectOptions = this.form.occupationOptions;
      this.form.controls.companion.controls.occupation.selectOptions = this.form.occupationOptions;
      this.form.controls.companion.controls.relativeType.selectOptions = this.form.relativeTypeOptions;
      this.form.controls.colorBlindness.selectOptions = this.form.colorBlindnessOptions;
      this.form.controls.maritalStatus.selectOptions = this.form.maritalStatusOptions;
      this.form.controls.educationLevel.selectOptions = this.form.educationLevelOptions;

      this.form.controls.familyMembers.controls.forEach((group, index) => {
        group.controls.relativeType.selectOptions = this.form.relativeTypeOptions;
      });

      this.form.controls.familyMedicalHistory.controls.forEach((group, index) => {
        group.controls.relativeType.selectOptions = this.form.relativeTypeOptions;
        group.controls.disease.selectOptions = this.form.diseaseOptions;
      });

      this.form.controls.personalMedicalHistory.controls.forEach((group, index) => {
        group.controls.disease.selectOptions = this.form.diseaseOptions;
      });

      this.form.controls.personalDrugHistory.controls.forEach((group, index) => {
        group.controls.substance.selectOptions = this.form.substanceOptions;
        group.controls.consumptionLevel.selectOptions = this.form.consumptionLevelOptions;
      });

      this.form.patch(this.medicalRecord());
    });

    const attendedAloneControl = this.form.controls.hasCompanion as FormControl2<boolean | null>;

    attendedAloneControl.valueChanges.subscribe({
      next: value => {
        if (value !== null) {
          if (value === true) {
            this.form.controls.companion.enable();
          } else {
            this.form.controls.companion.disable();
            this.form.controls.companion.clearValidators();
            this.form.controls.companion.updateValueAndValidity();
          }
        }
      }
    })
  }

  ngOnInit(): void {

  }

  onSubmit() {
    // if (this.form.invalid) {
    //   this.snackbarService.error('Por favor, complete todos los campos requeridos.');
    //   return;
    // }
    this.form.setSubmitted();

    this.accountService.updateMedicalRecord({
      ...this.form.value,
    }).subscribe({
      next: response => {
        this.form.patch(response);
        this.snackbarService.success('Historia clínica actualizada correctamente.');
        this.form.markAsPristine();
        this.form.error = null;
        this.form.updateValueAndValidity();
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      }
    });
  }
}
