import { Component, effect, inject, input, model } from '@angular/core';
import { Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { FormControl2, FormGroup2, FormInfo } from 'src/app/_forms/form2';
import { OccupationsService } from 'src/app/occupations/occupations.config';
import { RelativeTypesService } from 'src/app/relativeTypes/relativeTypes.config';
import { ColorBlindnessesService } from 'src/app/colorBlindnesses/colorBlindnesses.config';
import { MaritalStatusesService } from 'src/app/maritalStatuses/maritalStatuses.config';
import { EducationLevelsService } from 'src/app/educationLevels/educationLevels.config';
import { SubstancesService } from 'src/app/substances/substances.config';
import { ConsumptionLevelsService } from 'src/app/consumptionLevels/consumptionLevels.config';
import { DiseasesService } from 'src/app/diseases/diseases.config';
import { SelectOption } from 'src/app/_forms/form';
import { CommonModule } from '@angular/common';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { BadRequest } from 'src/app/_models/types';

const handDominanceOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'right', name: 'Diestro' }),
  new SelectOption({ id: 2, code: 'left', name: 'Zurdo' }),
  new SelectOption({ id: 3, code: 'ambidextrous', name: 'Ambidiestro' }),
];

const sexOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'Masculino', name: 'Masculino' }),
  new SelectOption({ id: 2, code: 'Femenino', name: 'Femenino' }),
];

export class Companion {
  id: number | null = null;
  name: string | null = null;
  sex: SelectOption | null = null;
  age: number | null = null;
  phoneNumber: string | null = null;
  homeNumber: string | null = null;
  email: string | null = null;
  address: string | null = null;
  relativeType: SelectOption | null = null;
  occupation: SelectOption | null = null;

  constructor(init?: Partial<Companion>) {
    Object.assign(this, init);
  }
}

export const companionInfo: FormInfo<Companion> = {
  id: { label: 'ID', type: 'number' },
  address: { label: 'Domicilio', type: 'text', validators: [Validators.required] },
  age: { label: 'Edad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  sex: { label: 'Sexo', type: 'radio', showCodeSpan: false, selectOptions: sexOptions, validators: [Validators.required, ] },
  email: { label: 'Correo electrónico', type: 'text', validators: [Validators.required, Validators.email] },
  homeNumber: { label: 'Teléfono de casa', type: 'text' },
  name: { label: 'Nombre', type: 'text', validators: [Validators.required] },
  occupation: { label: 'Ocupación', type: 'select', showCodeSpan: false, validators: [Validators.required] },
  phoneNumber: { label: 'Teléfono móvil', type: 'text', validators: [Validators.required] },
  relativeType: { label: 'Parentesco', type: 'select', showCodeSpan: false, validators: [Validators.required] },
} as FormInfo<Companion>;

export class FamilyMember {
  id: number | null = null;
  relativeType: SelectOption | null = null;
  name: string | null = null;
  age: number | null = null;

  constructor(init?: Partial<FamilyMember>) {
    Object.assign(this, init);
  }
}

export const familyMemberInfo: FormInfo<FamilyMember> = {
  id: { label: 'ID', type: 'number' },
  age: { label: 'Edad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  name: { label: 'Nombre', type: 'text', validators: [Validators.required] },
  relativeType: { label: 'Parentesco', type: 'select', showCodeSpan: false },
} as FormInfo<FamilyMember>;

export class PersonalMedicalHistory {
  id: number | null = null;
  disease: SelectOption | null = null;
  description: string | null = null;

  constructor(init?: Partial<PersonalMedicalHistory>) {
    Object.assign(this, init);
  }
}

export const personalMedicalHistoryInfo: FormInfo<PersonalMedicalHistory> = {
  id: { label: 'ID', type: 'number' },
  description: { label: 'Descripción', type: 'text', validators: [Validators.required] },
  disease: { label: 'Enfermedad', type: 'select', showCodeSpan: false },
} as FormInfo<PersonalMedicalHistory>;

export class PersonalDrugHistory {
  id: number | null = null;
  substance: SelectOption | null = null;
  consumptionLevel: SelectOption | null = null;
  startAge: number | null = null;
  endAge: number | null = null;
  isCurrent: boolean | null = false;

  constructor(init?: Partial<PersonalDrugHistory>) {
    Object.assign(this, init);
  }
}

export const personalDrugHistoryInfo: FormInfo<PersonalDrugHistory> = {
  id: { label: 'ID', type: 'number' },
  consumptionLevel: { label: 'Nivel de consumo', type: 'select', showCodeSpan: false },
  endAge: { label: 'Edad de cese', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  isCurrent: { label: 'Consumo actual', type: 'checkbox' },
  startAge: { label: 'Edad de inicio', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  substance: { label: 'Sustancia', type: 'select', showCodeSpan: false },
} as FormInfo<PersonalDrugHistory>;

export class FamilyMedicalHistory {
  id: number | null = null;
  disease: SelectOption | null = null;
  relativeType: SelectOption | null = null;
  description: string | null = null;

  constructor(init?: Partial<FamilyMedicalHistory>) {
    Object.assign(this, init);
  }
}

export const familyMedicalHistoryInfo: FormInfo<FamilyMedicalHistory> = {
  id: { label: 'ID', type: 'number' },
  description: { label: 'Descripción', type: 'text' },
  disease: { label: 'Enfermedad', type: 'select', showCodeSpan: false },
  relativeType: { label: 'Parentesco', type: 'select', showCodeSpan: false },
} as FormInfo<FamilyMedicalHistory>;

export class MedicalRecord {
  patientName: string | null = null;
  age: number | null = null;
  sex: SelectOption | null = null;
  birthPlace: string | null = null;
  birthDate: Date | null = null;
  educationLevel: SelectOption | null = null;
  yearsOfSchooling: number | null = null;
  occupation: SelectOption | null = null;
  handDominance: SelectOption | null = null;
  maritalStatus: SelectOption | null = null;
  currentLivingSituation: string | null = null;
  currentAddress: string | null = null;
  homePhone: string | null = null;
  mobilePhone: string | null = null;
  email: string | null = null;
  hasCompanion: boolean | null = false;
  economicDependence: string | null = null;
  usesGlassesOrHearingAid: boolean | null = false;
  colorBlindness: SelectOption | null = null;

  companion: Companion = new Companion();

  familyMembers: FamilyMember[] = [ new FamilyMember(), ];
  personalMedicalHistory: PersonalMedicalHistory[] = [ new PersonalMedicalHistory(), ];
  personalDrugHistory: PersonalDrugHistory[] = [ new PersonalDrugHistory(), ];
  familyMedicalHistory: FamilyMedicalHistory[] = [ new FamilyMedicalHistory(), ];

  comments: string | null = null;

  constructor(init?: Partial<MedicalRecord>) {
    Object.assign(this, init);
  }
}

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
    super(MedicalRecord, new MedicalRecord(), {
      patientName: { label: 'Nombre completo', type: 'text', validators: [Validators.required, Validators.minLength(3)] },
      age: { label: 'Edad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
      sex: { label: 'Sexo', type: 'radio', showCodeSpan: false, selectOptions: sexOptions, validators: [Validators.required, ] },
      birthPlace: { label: 'Lugar de nacimiento', type: 'text', validators: [Validators.required] },
      birthDate: { label: 'Fecha de nacimiento', type: 'date', validators: [Validators.required] },
      educationLevel: { label: 'Nivel de estudios', type: 'select', showCodeSpan: false, validators: [Validators.required, ] },
      yearsOfSchooling: { label: 'Años de escolaridad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(100)] },
      occupation: { label: 'Ocupación', type: 'select', showCodeSpan: false, validators: [Validators.required, ] },
      handDominance: { label: 'Dominancia manual', type: 'select', showCodeSpan: false, selectOptions: handDominanceOptions, validators: [Validators.required, ] },
      maritalStatus: { label: 'Estado civil', type: 'select', showCodeSpan: false, validators: [Validators.required, ] },
      currentLivingSituation: { label: 'Con quien vive actualmente', type: 'text', validators: [Validators.required] },
      currentAddress: { label: 'Domicilio actual', type: 'text', validators: [Validators.required] },
      homePhone: { label: 'Teléfono de casa', type: 'text' },
      mobilePhone: { label: 'Teléfono móvil', type: 'text', validators: [Validators.required] },
      email: { label: 'Correo electrónico', type: 'text', validators: [Validators.required, Validators.email] },
      hasCompanion: { label: 'Asiste acompañado', type: 'checkbox' },
      economicDependence: { label: 'Dependencia económica', type: 'text' },
      usesGlassesOrHearingAid: { label: 'Usa lentes o ayuda auditiva', type: 'checkbox' },
      colorBlindness: { label: 'Daltonismo', type: 'select', showCodeSpan: false },

      companion: companionInfo,

      familyMedicalHistory: familyMedicalHistoryInfo,
      familyMembers: familyMemberInfo,
      personalDrugHistory: personalDrugHistoryInfo,
      personalMedicalHistory: personalMedicalHistoryInfo,

      comments: { label: 'Comentarios', type: 'textarea' },
    } as FormInfo<MedicalRecord>, { orientation: 'inline', });

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
          this.controls.familyMembers.controls[0].patchValue(new FamilyMember({...item}));
        } else {
          this.addFamilyMember();
          this.controls.familyMembers.controls[this.controls.familyMembers.controls.length - 1].patchValue(new FamilyMember({...item}));
        }
      }
    });

    value.personalMedicalHistory.forEach((item, index) => {
      const itemExists: boolean = this.controls.personalMedicalHistory.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.personalMedicalHistory.controls.length === 1 && this.controls.personalMedicalHistory.controls[0].controls.id.value === null) {
          this.controls.personalMedicalHistory.controls[0].patchValue(new PersonalMedicalHistory({...item}));
        } else {
          this.addPersonalMedicalHistory();
          this.controls.personalMedicalHistory.controls[this.controls.personalMedicalHistory.controls.length - 1].patchValue(new PersonalMedicalHistory({...item}));
        }
      }
    });

    value.personalDrugHistory.forEach((item, index) => {
      const itemExists: boolean = this.controls.personalDrugHistory.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.personalDrugHistory.controls.length === 1 && this.controls.personalDrugHistory.controls[0].controls.id.value === null) {
          this.controls.personalDrugHistory.controls[0].patchValue(new PersonalDrugHistory({...item}));
        } else {
          this.addPersonalDrugHistory();
          this.controls.personalDrugHistory.controls[this.controls.personalDrugHistory.controls.length - 1].patchValue(new PersonalDrugHistory({...item}));
        }
      }
    });

    value.familyMedicalHistory.forEach((item, index) => {
      const itemExists: boolean = this.controls.familyMedicalHistory.controls.some((group) => group.controls.id.value === item.id);
      if (!itemExists) {
        if (this.controls.familyMedicalHistory.controls.length === 1 && this.controls.familyMedicalHistory.controls[0].controls.id.value === null) {
          this.controls.familyMedicalHistory.controls[0].patchValue(new FamilyMedicalHistory({...item}));
        } else {
          this.addFamilyMedicalHistory();
          this.controls.familyMedicalHistory.controls[this.controls.familyMedicalHistory.controls.length - 1].patchValue(new FamilyMedicalHistory({...item}));
        }
      }
    });
  }

  addFamilyMember() {
    const group = new FormGroup2<FamilyMember>(FamilyMember, new FamilyMember(), familyMemberInfo, { orientation: 'inline', });

    group.controls.relativeType.showLabel = false;
    group.controls.age.showLabel = false;
    group.controls.name.showLabel = false;

    group.controls.relativeType.selectOptions = this.relativeTypeOptions;

    this.controls.familyMembers.push(group);
  }

  addPersonalMedicalHistory() {
    const group = new FormGroup2<PersonalMedicalHistory>(PersonalMedicalHistory, new PersonalMedicalHistory(), personalMedicalHistoryInfo, { orientation: 'inline', });

    group.controls.description.showLabel = false;
    group.controls.disease.showLabel = false;

    group.controls.disease.selectOptions = this.diseaseOptions;

    this.controls.personalMedicalHistory.push(group);
  }

  addPersonalDrugHistory() {
    const group = new FormGroup2<PersonalDrugHistory>(PersonalDrugHistory, new PersonalDrugHistory(), personalDrugHistoryInfo, { orientation: 'inline', });

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
    const group = new FormGroup2<FamilyMedicalHistory>(FamilyMedicalHistory, new FamilyMedicalHistory(), familyMedicalHistoryInfo, { orientation: 'inline', });

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

@Component({
  selector: 'div[clinicalHistoryForm]',
  standalone: true,
  imports: [ CommonModule, FormNewModule, ],
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
