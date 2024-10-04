import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { AccountService } from 'src/app/_services/account.service';
import { SelectOption } from 'src/app/_forms/form';
import { FormGroup2, FormInfo } from 'src/app/_forms/form2';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { OccupationsService } from 'src/app/occupations/occupations.config';
import { RelativeTypesService } from 'src/app/relativeTypes/relativeTypes.config';
import { ColorBlindnessesService } from 'src/app/colorBlindnesses/colorBlindnesses.config';
import { MaritalStatusesService } from 'src/app/maritalStatuses/maritalStatuses.config';
import { EducationLevelsService } from 'src/app/educationLevels/educationLevels.config';
import { SubstancesService } from 'src/app/substances/substances.config';
import { DiseasesService } from 'src/app/diseases/diseases.config';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ConsumptionLevelsService } from 'src/app/consumptionLevels/consumptionLevels.config';
import { SnackbarService } from 'src/app/_services/snackbar.service';

export class MedicalRecord {
  name = '';
  age = 0;
  sex = new SelectOption();
  birthPlace = '';
  birthDate: Date = new Date();
  educationLevel = new SelectOption();
  yearsOfSchooling = 0;
  occupation = new SelectOption();
  handDominance = new SelectOption();
  maritalStatus = new SelectOption();
  currentLivingSituation = '';
  currentAddress = '';
  homePhone = '';
  mobilePhone = '';
  email = '';
  attendedAlone = 0;
  economicDependence = '';
  usesGlassesOrHearingAid = 0;
  colorBlindness = new SelectOption();
  familyStructure = [];

  companionName = '';
  companionRelationship = new SelectOption();
  companionAge = 0;
  companionSex = new SelectOption();
  companionOccupation = new SelectOption();
  companionCurrentAddress = '';
  companionHomePhone = '';
  companionMobilePhone = '';
  companionEmail = '';

  personalMedicalHistory = [];
  personalDrugHistory = [];
  familyMedicalHistory = [];

  comments = '';

  constructor(init?: Partial<MedicalRecord>) {
    Object.assign(this, init);
  }
}

const handDominanceOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'right', name: 'Diestro' }),
  new SelectOption({ id: 2, code: 'left', name: 'Zurdo' }),
  new SelectOption({ id: 3, code: 'ambidextrous', name: 'Ambidiestro' }),
];

const sexOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'male', name: 'Masculino' }),
  new SelectOption({ id: 2, code: 'female', name: 'Femenino' }),
];

export const medicalRecord = new MedicalRecord({
  // name: 'Ramiro Castellanos Barrón',
  // age: 24,
  // birthDate: new Date(2000, 4, 2),
  // birthPlace: 'Mexico',
  // sex: new SelectOption({ id: 1, code: 'male', name: 'Masculino' }),

});

function validateSelectOptionId(control: AbstractControl): ValidationErrors | null {
  const selectOption = control.value as SelectOption;
  if (!selectOption || !selectOption.id || selectOption.id <= 0) {
    return { invalidSelectOption: true };
  }
  return null;
}

@Component({
  selector: 'app-account-clinical-history',
  standalone: true,
  imports: [CommonModule, BootstrapModule, FormNewModule, ReactiveFormsModule],
  templateUrl: './account-clinical-history.component.html',
  styles: [
    `
      .btn-outline-danger:hover .ki-trash {
        color: white !important;
      }
    `
  ]
})
export class AccountClinicalHistoryComponent implements OnInit {
  accountService = inject(AccountService);
  snackbarService = inject(SnackbarService);

  occupations = inject(OccupationsService);
  relativeTypes = inject(RelativeTypesService);
  colorBlindnesses = inject(ColorBlindnessesService);
  maritalStatuses = inject(MaritalStatusesService);
  educationLevels = inject(EducationLevelsService);
  substances = inject(SubstancesService);
  consumptionLevels = inject(ConsumptionLevelsService);
  diseases = inject(DiseasesService);

  occupationOptions: SelectOption[] = [];
  relativeTypeOptions: SelectOption[] = [];
  colorBlindnessOptions: SelectOption[] = [];
  maritalStatusOptions: SelectOption[] = [];
  educationLevelOptions: SelectOption[] = [];
  substanceOptions: SelectOption[] = [];
  consumptionLevelOptions: SelectOption[] = [];
  diseaseOptions: SelectOption[] = [];

  private fb = inject(FormBuilder);

  info: FormInfo<MedicalRecord> = {
    name: { label: 'Nombre completo', placeholder: 'Nombre completo', type: 'text', validators: [Validators.required, Validators.minLength(3)] },
    age: { label: 'Edad', placeholder: 'Edad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
    sex: { label: 'Sexo', type: 'select', showCodeSpan: false, selectOptions: sexOptions, validators: [Validators.required, validateSelectOptionId] },
    birthPlace: { label: 'Lugar de nacimiento', placeholder: 'Lugar de nacimiento', type: 'text', validators: [Validators.required] },
    birthDate: { label: 'Fecha de nacimiento', type: 'date', placeholder: 'Fecha de nacimiento', validators: [Validators.required] },
    educationLevel: { label: 'Nivel de estudios', type: 'select', showCodeSpan: false, validators: [Validators.required, validateSelectOptionId] },
    yearsOfSchooling: { label: 'Años de escolaridad', type: 'number', placeholder: 'Años de escolaridad', validators: [Validators.required, Validators.min(0), Validators.max(100)] },
    occupation: { label: 'Ocupación', type: 'select', showCodeSpan: false, validators: [Validators.required, validateSelectOptionId] },
    handDominance: { label: 'Dominancia manual', type: 'select', showCodeSpan: false, selectOptions: handDominanceOptions, validators: [Validators.required, validateSelectOptionId] },
    maritalStatus: { label: 'Estado civil', type: 'select', showCodeSpan: false, validators: [Validators.required, validateSelectOptionId] },
    currentLivingSituation: { label: 'Con quien vive actualmente', placeholder: 'Con quien vive actualmente', type: 'text', validators: [Validators.required] },
    currentAddress: { label: 'Domicilio actual', placeholder: 'Domicilio actual', type: 'text', validators: [Validators.required] },
    homePhone: { label: 'Teléfono particular', placeholder: 'Teléfono particular', type: 'text' },
    mobilePhone: { label: 'Teléfono móvil', placeholder: 'Teléfono móvil', type: 'text', validators: [Validators.required] },
    email: { label: 'Correo electrónico', placeholder: 'Correo electrónico', type: 'text', validators: [Validators.required, Validators.email] },
    attendedAlone: { label: 'Asiste acompañado', type: 'slideToggle', slideAlternateStyle: true },
    economicDependence: { label: 'Dependencia económica', placeholder: 'Dependencia económica', type: 'text' },
    usesGlassesOrHearingAid: { label: 'Usa lentes o ayuda auditiva', type: 'slideToggle', slideAlternateStyle: true },
    colorBlindness: { label: 'Daltonismo', type: 'select', showCodeSpan: false },
    familyStructure: { label: 'Estructura Familiar', type: 'array' },

    companionName: { label: 'Nombre del acompañante', placeholder: 'Nombre del acompañante', type: 'text' },
    companionRelationship: { label: 'Parentesco con el acompañante', placeholder: 'Parentesco con el acompañante', type: 'select', showCodeSpan: false },
    companionAge: { label: 'Edad del acompañante', placeholder: 'Edad del acompañante', type: 'number' },
    companionSex: { label: 'Sexo del acompañante', type: 'select', showCodeSpan: false, selectOptions: sexOptions },
    companionOccupation: { label: 'Ocupación del acompañante', placeholder: 'Ocupación del acompañante', type: 'select', showCodeSpan: false },
    companionCurrentAddress: { label: 'Domicilio del acompañante', placeholder: 'Domicilio del acompañante', type: 'text' },
    companionHomePhone: { label: 'Teléfono del acompañante', placeholder: 'Teléfono del acompañante', type: 'text' },
    companionMobilePhone: { label: 'Teléfono móvil del acompañante', placeholder: 'Teléfono móvil del acompañante', type: 'text' },
    companionEmail: { label: 'Correo electrónico del acompañante', placeholder: 'Correo electrónico del acompañante', type: 'text' },

    personalMedicalHistory: { label: 'Antecedentes médicos personales', type: 'array' },
    personalDrugHistory: { label: 'Antecedentes de consumo de sustancias', type: 'array' },
    familyMedicalHistory: { label: 'Antecedentes familiares', type: 'array' },

    comments: { label: 'Comentarios', placeholder: 'Comentarios', type: 'textarea' },
  };

  medicalRecord = new MedicalRecord({
    name: '',
    age: 0,
    birthDate: new Date(2000, 1, 1),
    birthPlace: '',
    sex: new SelectOption(),
    educationLevel: new SelectOption(),
    yearsOfSchooling: 0,
    occupation: new SelectOption(),
    handDominance: new SelectOption(),
    maritalStatus: new SelectOption(),
    currentLivingSituation: '',
    currentAddress: '',
    homePhone: '',
    mobilePhone: '',
    email: '',
    attendedAlone: 0,
    economicDependence: '',
    usesGlassesOrHearingAid: 0,
    colorBlindness: new SelectOption(),
    familyStructure: [],

    companionName: '',
    companionRelationship: new SelectOption(),
    companionAge: 0,
    companionSex: new SelectOption(),
    companionOccupation: new SelectOption(),
    companionCurrentAddress: '',
    companionHomePhone: '',
    companionMobilePhone: '',
    companionEmail: '',

    personalMedicalHistory: [],
    personalDrugHistory: [],
    familyMedicalHistory: [],

    comments: '',
  });

  form = new FormGroup2<MedicalRecord>(MedicalRecord, this.medicalRecord, this.info);

  get familyStructureFormArray() {
    return this.form.get('familyStructure') as FormArray;
  }

  get personalMedicalHistoryFormArray() {
    return this.form.get('personalMedicalHistory') as FormArray;
  }

  get personalDrugHistoryFormArray() {
    return this.form.get('personalDrugHistory') as FormArray;
  }

  get familyMedicalHistoryFormArray() {
    return this.form.get('familyMedicalHistory') as FormArray;
  }

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
      this.occupationOptions = this.occupations.options();
      this.relativeTypeOptions = this.relativeTypes.options();
      this.colorBlindnessOptions = this.colorBlindnesses.options();
      this.maritalStatusOptions = this.maritalStatuses.options();
      this.educationLevelOptions = this.educationLevels.options();
      this.substanceOptions = this.substances.options();
      this.consumptionLevelOptions = this.consumptionLevels.options();
      this.diseaseOptions = this.diseases.options();

      this.form.controls.occupation.selectOptions = this.occupationOptions;
      this.form.controls.maritalStatus.selectOptions = this.maritalStatusOptions;
      this.form.controls.colorBlindness.selectOptions = this.colorBlindnessOptions;
      this.form.controls.educationLevel.selectOptions = this.educationLevelOptions;
      this.form.controls.companionRelationship.selectOptions = this.relativeTypeOptions;
      this.form.controls.companionOccupation.selectOptions = this.occupationOptions;
    });
  }

  ngOnInit(): void {
    this.accountService.getMedicalRecord().subscribe(medicalRecord => {
      this.patchForm(medicalRecord);
    });

    if (!this.medicalRecord) {
      this.addFamilyMemberNew();
    }
  }

  patchForm(medicalRecord: MedicalRecord) {
    if (!medicalRecord) return;

    this.familyStructureFormArray.clear();
    this.personalMedicalHistoryFormArray.clear();
    this.personalDrugHistoryFormArray.clear();
    this.familyMedicalHistoryFormArray.clear();

    const medicalRecordSex = String(medicalRecord.sex);
    const sexOption = sexOptions.find(sex => sex.name === medicalRecordSex);
    const medicalRecordHandDominance = String(medicalRecord.handDominance);
    const handDominanceOption = handDominanceOptions.find(handDominance => handDominance.name === medicalRecordHandDominance);

    this.form.patchValue({
      name: medicalRecord.name,
      age: medicalRecord.age,
      sex: sexOption ?? new SelectOption(),
      birthPlace: medicalRecord.birthPlace,
      birthDate: medicalRecord.birthDate,
      educationLevel: medicalRecord.educationLevel,
      yearsOfSchooling: medicalRecord.yearsOfSchooling,
      occupation: medicalRecord.occupation,
      handDominance: handDominanceOption ?? new SelectOption(),
      maritalStatus: medicalRecord.maritalStatus,
      currentLivingSituation: medicalRecord.currentLivingSituation,
      currentAddress: medicalRecord.currentAddress,
      homePhone: medicalRecord.homePhone,
      mobilePhone: medicalRecord.mobilePhone,
      email: medicalRecord.email,
      attendedAlone: medicalRecord.attendedAlone ? 1 : 0,
      economicDependence: medicalRecord.economicDependence,
      usesGlassesOrHearingAid: medicalRecord.usesGlassesOrHearingAid ? 1 : 0,
      colorBlindness: medicalRecord.colorBlindness,
    });

    if (medicalRecord.attendedAlone) {
      const companionSex = String(medicalRecord.companionSex);
      const companionSexOption = sexOptions.find(sex => sex.name === companionSex);

      this.form.patchValue({
        companionName: medicalRecord.companionName,
        companionAge: medicalRecord.companionAge,
        companionSex: companionSexOption ?? new SelectOption(),
        companionRelationship: medicalRecord.companionRelationship,
        companionOccupation: medicalRecord.companionOccupation,
        companionCurrentAddress: medicalRecord.companionCurrentAddress,
        companionHomePhone: medicalRecord.companionHomePhone,
        companionMobilePhone: medicalRecord.companionMobilePhone,
        companionEmail: medicalRecord.companionEmail,
      });
    }

    medicalRecord.familyStructure.forEach(familyMember => {
      this.addFamilyMember(familyMember);
    });

    medicalRecord.personalMedicalHistory.forEach(medicalHistory => {
      this.addPersonalMedicalHistory(medicalHistory);
    });

    medicalRecord.personalDrugHistory.forEach(drugHistory => {
      this.addPersonalDrugHistory(drugHistory);
    });

    medicalRecord.familyMedicalHistory.forEach(familyMedicalHistory => {
      this.addFamilyMedicalHistory(familyMedicalHistory);
    });
  }

  addFamilyMemberNew() {
    const familyMemberGroup = this.fb.group({
      relativeType: [new SelectOption(), [validateSelectOptionId]],
      name: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
    });
    this.familyStructureFormArray.push(familyMemberGroup);
  }

  addFamilyMember(familyMember: FamilyMember) {
    const familyMemberGroup = this.fb.group({
      relativeType: [familyMember.relativeType, [validateSelectOptionId]],
      name: [familyMember.name, [Validators.required]],
      age: [familyMember.age, [Validators.required, Validators.min(0), Validators.max(150)]],
    });
    familyMemberGroup.patchValue({
      relativeType: this.relativeTypeOptions.find(option => option.id === familyMember.relativeType.id),
    })
    this.familyStructureFormArray.push(familyMemberGroup);
  }

  removeFamilyMember(index: number) {
    this.familyStructureFormArray.removeAt(index);
  }

  addNewPersonalMedicalHistory() {
    const personalMedicalHistoryGroup = this.fb.group({
      disease: [new SelectOption(), [validateSelectOptionId]],
      description: ['', [Validators.required]],
    });
    this.personalMedicalHistoryFormArray.push(personalMedicalHistoryGroup);
  }

  addPersonalMedicalHistory(medicalHistory: PersonalMedicalHistory) {
    const personalMedicalHistoryGroup = this.fb.group({
      disease: [medicalHistory.disease, [validateSelectOptionId]],
      description: [medicalHistory.description, [Validators.required]],
    });
    personalMedicalHistoryGroup.patchValue({
      disease: this.diseaseOptions.find(option => option.id === medicalHistory.disease.id),
    })
    this.personalMedicalHistoryFormArray.push(personalMedicalHistoryGroup);
  }

  removePersonalMedicalHistory(index: number) {
    this.personalMedicalHistoryFormArray.removeAt(index);
  }
  
  addNewPersonalDrugHistory() {
    const personalDrugHistoryGroup = this.fb.group({
      substance: [new SelectOption(), [validateSelectOptionId]],
      consumptionLevel: [new SelectOption(), [validateSelectOptionId]],
      startAge: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
      endAge: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
      isCurrent: [false]
    });
    this.personalDrugHistoryFormArray.push(personalDrugHistoryGroup);
  }

  addPersonalDrugHistory(drugHistory: PersonalDrugHistory) {
    const personalDrugHistoryGroup = this.fb.group({
      substance: [drugHistory.substance, [validateSelectOptionId]],
      consumptionLevel: [drugHistory.consumptionLevel, [validateSelectOptionId]],
      startAge: [drugHistory.startAge, [Validators.required, Validators.min(0), Validators.max(150)]],
      endAge: [drugHistory.endAge, [Validators.required, Validators.min(0), Validators.max(150)]],
      isCurrent: [drugHistory.isCurrent]
    });
    personalDrugHistoryGroup.patchValue({
      substance: this.substanceOptions.find(option => option.id === drugHistory.substance.id),
      consumptionLevel: this.consumptionLevelOptions.find(option => option.id === drugHistory.consumptionLevel.id),
    })
    this.personalDrugHistoryFormArray.push(personalDrugHistoryGroup);
  }

  removePersonalDrugHistory(index: number) {
    this.personalDrugHistoryFormArray.removeAt(index);
  }

  addNewFamilyMedicalHistory() {
    const familyMedicalHistoryGroup = this.fb.group({
      disease: [new SelectOption()],
      relativeType: [new SelectOption()],
      description: [''],
    });
    this.familyMedicalHistoryFormArray.push(familyMedicalHistoryGroup);
  }

  addFamilyMedicalHistory(familyMedicalHistory: FamilyMedicalHistory) {
    const familyMedicalHistoryGroup = this.fb.group({
      disease: [familyMedicalHistory.disease, [validateSelectOptionId]],
      relativeType: [familyMedicalHistory.relativeType, [validateSelectOptionId]],
      description: [familyMedicalHistory.description, [Validators.required]],
    });
    const relativeType = String(familyMedicalHistory.relativeType);
    const relativeTypeOption = this.relativeTypeOptions.find(option => option.name === relativeType);
    familyMedicalHistoryGroup.patchValue({
      disease: this.diseaseOptions.find(option => option.id === familyMedicalHistory.disease.id),
      relativeType: relativeTypeOption,
    })
    this.familyMedicalHistoryFormArray.push(familyMedicalHistoryGroup);
  }

  removeFamilyMedicalHistory(index: number) {
    this.familyMedicalHistoryFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.snackbarService.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.accountService.updateMedicalRecord({
      ...this.form.value,
      sex: this.form.value.sex?.name,
      handDominance: this.form.value.handDominance?.name,
      companionSex: this.form.value.companionSex?.name,
      attendedAlone: this.form.value.attendedAlone ? true : false,
      usesGlassesOrHearingAid: this.form.value.usesGlassesOrHearingAid ? true : false,
      colorBlindness: this.form.value.colorBlindness?.id === 0 ? null : this.form.value.colorBlindness,
    }).subscribe(response => {
      this.patchForm(response);
    });
  }
}

export class FamilyMember {
  relativeType = new SelectOption();
  name = '';
  age = null;

  constructor(init?: Partial<FamilyMember>) {
    Object.assign(this, init);
  }
}

export class PersonalMedicalHistory {
  disease = new SelectOption();
  description = '';

  constructor(init?: Partial<PersonalMedicalHistory>) {
    Object.assign(this, init);
  }
}

export class PersonalDrugHistory {
  substance = new SelectOption();
  consumptionLevel = new SelectOption();
  startAge = null;
  endAge = null;
  isCurrent = false;

  constructor(init?: Partial<PersonalDrugHistory>) {
    Object.assign(this, init);
  }
}

export class FamilyMedicalHistory {
  disease = new SelectOption();
  relativeType = new SelectOption();
  description = '';

  constructor(init?: Partial<FamilyMedicalHistory>) {
    Object.assign(this, init);
  }
}