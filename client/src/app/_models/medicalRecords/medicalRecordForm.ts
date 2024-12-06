import { Validators } from "@angular/forms";
import { SelectOption } from "src/app/_models/base/selectOption";
import { sexOptions, handDominanceOptions, companionFormInfo } from "src/app/_models/companions/companionConstants";
import { FamilyMedicalHistory } from "src/app/_models/familyMedicalHistories/familyMedicalHistory";
import { familyMedicalHistoryFormInfo } from "src/app/_models/familyMedicalHistories/familyMedicalHistoryConstants";
import { FamilyMember } from "src/app/_models/familyMembers/familyMember";
import { familyMemberFormInfo } from "src/app/_models/familyMembers/familyMemberConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { MedicalRecord } from "src/app/_models/medicalRecords/medicalRecord";
import { medicalRecordFormInfo } from "src/app/_models/medicalRecords/medicalRecordConstants";
import { PersonalDrugHistory } from "src/app/_models/personalDrugHistories/personalDrugHistory";
import { personalDrugHistoryFormInfo } from "src/app/_models/personalDrugHistories/personalDrugHistoryConstants";
import { PersonalMedicalHistory } from "src/app/_models/personalMedicalHistories/personalMedicalHistory";
import { personalMedicalHistoryFormInfo } from "src/app/_models/personalMedicalHistories/personalMedicalHistoryConstants";


export class MedicalRecordForm extends FormGroup2<MedicalRecord> {
  occupationOptions: SelectOption[] = [];
  relativeTypeOptions: SelectOption[] = [];
  colorBlindnessOptions: SelectOption[] = [];
  maritalStatusOptions: SelectOption[] = [];
  educationLevelOptions: SelectOption[] = [];
  substanceOptions: SelectOption[] = [];
  consumptionLevelOptions: SelectOption[] = [];
  diseaseOptions: SelectOption[] = [];

  constructor() {
    super(MedicalRecord, new MedicalRecord(), medicalRecordFormInfo, { orientation: 'inline', });

    this.controls.familyMedicalHistory.controls.forEach((group, index) => {

      group.controls.relativeType.showLabel = false;
      group.controls.description.showLabel = false;
      group.controls.disease.showLabel = false;

      group.controls.relativeType.selectOptions = this.relativeTypeOptions;
      group.controls.disease.selectOptions = this.diseaseOptions;
    });

    this.controls.personalMedicalHistory.controls.forEach((group, index) => {

      group.controls.description.showLabel = false;
      group.controls.disease.showLabel = false;

      group.controls.disease.selectOptions = this.diseaseOptions;
    });

    this.controls.personalDrugHistory.controls.forEach((group, index) => {

      group.controls.consumptionLevel.showLabel = false;
      group.controls.endAge.showLabel = false;
      group.controls.substance.showLabel = false;
      group.controls.startAge.showLabel = false;
      group.controls.isCurrent.showLabel = false;

      group.controls.substance.selectOptions = this.substanceOptions;
      group.controls.consumptionLevel.selectOptions = this.consumptionLevelOptions;
    });

    this.controls.familyMembers.controls.forEach((group, index) => {

      group.controls.relativeType.showLabel = false;
      group.controls.age.showLabel = false;
      group.controls.name.showLabel = false;

      group.controls.relativeType.selectOptions = this.relativeTypeOptions;
    });
  }

  patch(value: MedicalRecord) {

    super.patchValue(value);

    value.familyMembers.forEach((item, index) => {
      const itemExists: boolean = this.controls.familyMembers.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.familyMembers.controls.length === 1 && this.controls.familyMembers.controls[0].controls.id.value === null) {
          this.controls.familyMembers.controls[0].patchValue(new FamilyMember({ ...item }));
        } else {
          this.addFamilyMember();
          this.controls.familyMembers.controls[this.controls.familyMembers.controls.length - 1].patchValue(new FamilyMember({ ...item }));
        }
      }
    });

    value.personalMedicalHistory.forEach((item, index) => {
      const itemExists: boolean = this.controls.personalMedicalHistory.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.personalMedicalHistory.controls.length === 1 && this.controls.personalMedicalHistory.controls[0].controls.id.value === null) {
          this.controls.personalMedicalHistory.controls[0].patchValue(new PersonalMedicalHistory({ ...item }));
        } else {
          this.addPersonalMedicalHistory();
          this.controls.personalMedicalHistory.controls[this.controls.personalMedicalHistory.controls.length - 1].patchValue(new PersonalMedicalHistory({ ...item }));
        }
      }
    });

    value.personalDrugHistory.forEach((item, index) => {
      const itemExists: boolean = this.controls.personalDrugHistory.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.personalDrugHistory.controls.length === 1 && this.controls.personalDrugHistory.controls[0].controls.id.value === null) {
          this.controls.personalDrugHistory.controls[0].patchValue(new PersonalDrugHistory({ ...item }));
        } else {
          this.addPersonalDrugHistory();
          this.controls.personalDrugHistory.controls[this.controls.personalDrugHistory.controls.length - 1].patchValue(new PersonalDrugHistory({ ...item }));
        }
      }
    });

    value.familyMedicalHistory.forEach((item, index) => {
      const itemExists: boolean = this.controls.familyMedicalHistory.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.familyMedicalHistory.controls.length === 1 && this.controls.familyMedicalHistory.controls[0].controls.id.value === null) {
          this.controls.familyMedicalHistory.controls[0].patchValue(new FamilyMedicalHistory({ ...item }));
        } else {
          this.addFamilyMedicalHistory();
          this.controls.familyMedicalHistory.controls[this.controls.familyMedicalHistory.controls.length - 1].patchValue(new FamilyMedicalHistory({ ...item }));
        }
      }
    });
  }

  addFamilyMember() {
    const group = new FormGroup2<FamilyMember>(FamilyMember, new FamilyMember(), familyMemberFormInfo, { orientation: 'inline', });

    group.controls.relativeType.showLabel = false;
    group.controls.age.showLabel = false;
    group.controls.name.showLabel = false;

    group.controls.relativeType.selectOptions = this.relativeTypeOptions;

    this.controls.familyMembers.push(group);
  }

  addPersonalMedicalHistory() {
    const group = new FormGroup2<PersonalMedicalHistory>(PersonalMedicalHistory, new PersonalMedicalHistory(), personalMedicalHistoryFormInfo, { orientation: 'inline', });

    group.controls.description.showLabel = false;
    group.controls.disease.showLabel = false;

    group.controls.disease.selectOptions = this.diseaseOptions;

    this.controls.personalMedicalHistory.push(group);
  }

  addPersonalDrugHistory() {
    const group = new FormGroup2<PersonalDrugHistory>(PersonalDrugHistory, new PersonalDrugHistory(), personalDrugHistoryFormInfo, { orientation: 'inline', });

    group.controls.consumptionLevel.showLabel = false;
    group.controls.endAge.showLabel = false;
    group.controls.substance.showLabel = false;
    group.controls.startAge.showLabel = false;
    group.controls.isCurrent.showLabel = false;

    group.controls.substance.selectOptions = this.substanceOptions;
    group.controls.consumptionLevel.selectOptions = this.consumptionLevelOptions;

    this.controls.personalDrugHistory.push(group);
  }

  addFamilyMedicalHistory() {
    const group = new FormGroup2<FamilyMedicalHistory>(FamilyMedicalHistory, new FamilyMedicalHistory(), familyMedicalHistoryFormInfo, { orientation: 'inline', });

    group.controls.description.showLabel = false;
    group.controls.disease.showLabel = false;
    group.controls.relativeType.showLabel = false;

    group.controls.disease.selectOptions = this.diseaseOptions;
    group.controls.relativeType.selectOptions = this.relativeTypeOptions;

    this.controls.familyMedicalHistory.push(group);
  }

  removeFamilyMember(index: number) {
    this.controls.familyMembers.removeAt(index);
  }

  removePersonalMedicalHistory(index: number) {
    this.controls.personalMedicalHistory.removeAt(index);
  }

  removePersonalDrugHistory(index: number) {
    this.controls.personalDrugHistory.removeAt(index);
  }

  removeFamilyMedicalHistory(index: number) {
    this.controls.familyMedicalHistory.removeAt(index);
  }
}
