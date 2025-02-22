import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal, OnInit } from "@angular/core";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { BadRequest } from 'src/app/_models/forms/badRequest';
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
import {
  ClinicalHistoryNavMenuComponent
} from "src/app/account/components/account-clinical-history/clinical-history-form/clinical-history-nav-menu.component";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: 'div[clinicalHistoryForm]',
  templateUrl: './clinical-history-form.component.html',
  imports: [
    CommonModule,
    Forms2Module,
    ClinicalHistoryNavMenuComponent
  ],
})
export class ClinicalHistoryFormComponent implements OnInit {
  snackbarService: SnackbarService = inject(SnackbarService);
  accountService: AccountService = inject(AccountService);

  diseases: DiseasesService = inject(DiseasesService);
  substances: SubstancesService = inject(SubstancesService);
  occupations: OccupationsService = inject(OccupationsService);
  relativeTypes: RelativeTypesService = inject(RelativeTypesService);
  maritalStatuses: MaritalStatusesService = inject(MaritalStatusesService);
  educationLevels: EducationLevelsService = inject(EducationLevelsService);
  colorBlindnesses: ColorBlindnessesService = inject(ColorBlindnessesService);
  consumptionLevels: ConsumptionLevelsService = inject(ConsumptionLevelsService);

  currentSection: string = 'patientIdentification';

  medicalRecord: ModelSignal<MedicalRecord> = model.required();
  use: ModelSignal<FormUse> = model(FormUse.EDIT as FormUse);
  showNav: ModelSignal<boolean> = model(true);
  form: MedicalRecordForm = new MedicalRecordForm();

  constructor() {
    effect(() => {
      this.form.diseaseOptions = this.diseases.options();
      this.form.substanceOptions = this.substances.options();
      this.form.occupationOptions = this.occupations.options();
      this.form.relativeTypeOptions = this.relativeTypes.options();
      this.form.maritalStatusOptions = this.maritalStatuses.options();
      this.form.educationLevelOptions = this.educationLevels.options();
      this.form.colorBlindnessOptions = this.colorBlindnesses.options();
      this.form.consumptionLevelOptions = this.consumptionLevels.options();

      this.form.controls.occupation.selectOptions = this.form.occupationOptions;
      this.form.controls.maritalStatus.selectOptions = this.form.maritalStatusOptions;
      this.form.controls.colorBlindness.selectOptions = this.form.colorBlindnessOptions;
      this.form.controls.educationLevel.selectOptions = this.form.educationLevelOptions;
      this.form.controls.companion.controls.occupation.selectOptions = this.form.occupationOptions;
      this.form.controls.companion.controls.relativeType.selectOptions = this.form.relativeTypeOptions;

      this.form.controls.familyMembers.controls.forEach((group) => {
        group.controls.relativeType.selectOptions = this.form.relativeTypeOptions;
      });

      this.form.controls.familyMedicalHistory.controls.forEach((group) => {
        group.controls.relativeType.selectOptions = this.form.relativeTypeOptions;
        group.controls.disease.selectOptions = this.form.diseaseOptions;
      });

      this.form.controls.personalMedicalHistory.controls.forEach((group) => {
        group.controls.disease.selectOptions = this.form.diseaseOptions;
      });

      this.form.controls.personalDrugHistory.controls.forEach((group) => {
        group.controls.substance.selectOptions = this.form.substanceOptions;
        group.controls.consumptionLevel.selectOptions = this.form.consumptionLevelOptions;
      });

      this.form.patch(this.medicalRecord());

      if (this.use() === FormUse.DETAIL) {
        this.form.disable();
      }
    });
  }

  ngOnInit(): void {
    this.loadOptions();
    this.setAssistedAttendance();
  }

  private loadOptions(): void {
    this.diseases.getOptions().subscribe();
    this.substances.getOptions().subscribe();
    this.occupations.getOptions().subscribe();
    this.relativeTypes.getOptions().subscribe();
    this.maritalStatuses.getOptions().subscribe();
    this.educationLevels.getOptions().subscribe();
    this.colorBlindnesses.getOptions().subscribe();
    this.consumptionLevels.getOptions().subscribe();
  }

  private setAssistedAttendance(): void {
    this.form.controls.hasCompanion.valueChanges.subscribe({
      next: (value: boolean | null) => {
        if (value === null) return;
        if (value) {
          this.form.controls.companion.enable();
        } else {
          this.form.controls.companion.disable();
          this.form.controls.companion.clearValidators();
          this.form.controls.companion.updateValueAndValidity();
        }
      }
    })
  }

  selectSection(section: string) {
    this.currentSection = section;
  }

  onSubmit() {
    this.form.setSubmitted();

    this.accountService.updateMedicalRecord({ ...this.form.value }).subscribe({
      next: (response: MedicalRecord) => {
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

  protected readonly FormUse = FormUse;
}
