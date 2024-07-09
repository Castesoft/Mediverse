import { HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { createId } from '@paralleldrive/cuid2';
import { Modal } from 'src/app/_models/modal';
import { Sex, MedicalHistory, Allergy, EmergencyContact } from 'src/app/_models/user';
import { getPaginationHeaders } from 'src/app/_utils/util';

const subject = 'patient'     ;

export class Patient {
  id: number;
  isSelected: boolean;

  firstName: string;
  lastName: string;
  birthDate: Date;
  photoUrl: string;
  sex: Sex;
  address: string;
  phoneNumber: string;
  email: string;
  medicalHistory: MedicalHistory[];
  allergies: Allergy[];
  currentMedications: Patient[];
  emergencyContact: EmergencyContact;

  constructor(
    id: number,
    isSelected: boolean,
    firstName: string,
    lastName: string,
    birthDate: Date,
    photoUrl: string,
    sex: Sex,
    address: string,
    phoneNumber: string,
    email: string,
    medicalHistory: MedicalHistory[],
    allergies: Allergy[],
    currentMedications: Patient[],
    emergencyContact: EmergencyContact
  ) {
    this.id = id;
    this.isSelected = isSelected;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.photoUrl = photoUrl;
    this.sex = sex;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.medicalHistory = medicalHistory;
    this.allergies = allergies;
    this.currentMedications = currentMedications;
    this.emergencyContact = emergencyContact;
  }
}

export class PatientParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'dateCreatedDesc';
  isSortAscending = false;
  id?: number;

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.id) params = params.append('id', this.id.toString());

    return params;
  }

  updateFromPartial(partial: Partial<PatientParams>) {
    Object.assign(this, partial);
  }
}

export class FilterForm {
  subject = 'patient';
  formGroup: FormGroup;
  id: string;

  constructor() {
    this.id = `${this.subject}filterForm${createId()}`;
    this.formGroup = new FormGroup({
      search: new FormControl(''),
      dateRange: new FormControl({ value: ['', ''], disabled: false }),
      pageSize: new FormControl(10, [
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ]),
    });
  }

  patchValue(params: PatientParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.formGroup.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
      },
      { emitEvent: false, onlySelf: true }
    );
  }
}

export class CreateForm {
  formGroup: FormGroup;
  id: string;

  constructor(mode: boolean) {
    this.id = `${subject}Form${createId()}`;

    this.formGroup = new FormGroup({
      name: new FormControl(''),
      shortName: new FormControl(''),
    });

    this.setValidators(mode);
  }

  setValidators(mode: boolean) {
    const controls = this.formGroup.controls;

    if (mode) {
      //   controls['name'].setValidators([Validators.required]);
      //   controls['shortName'].setValidators([Validators.required]);
    } else {
      //   controls['name'].clearValidators();
      //   controls['name'].clearAsyncValidators();
      //   controls['shortName'].clearValidators();
      //   controls['shortName'].clearAsyncValidators();
    }
  }

  patchWithSample() {
    let sample = getRandomSample();
    this.formGroup.patchValue(sample);
  }
}

export class EditForm {
  formGroup: FormGroup;
  id: string;

  constructor(mode: boolean) {
    this.id = `${subject}Form${createId()}`;

    this.formGroup = new FormGroup({
      name: new FormControl(''),
      shortName: new FormControl(''),
    });

    this.setValidators(mode);
  }

  setValidators(mode: boolean) {
    const controls = this.formGroup.controls;

    if (mode) {
      //   controls['name'].setValidators([Validators.required]);
      //   controls['shortName'].setValidators([Validators.required]);
    } else {
      //   controls['name'].clearValidators();
      //   controls['name'].clearAsyncValidators();
      //   controls['shortName'].clearValidators();
      //   controls['shortName'].clearAsyncValidators();
    }
  }

  patchWithSample() {
    let sample = getRandomSample();
    this.formGroup.patchValue(sample);
  }
}

export class DetailForm {
  formGroup: FormGroup;
  id: string;

  patchValues = (item: Patient) => this.formGroup.patchValue(item);

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.formGroup = new FormGroup({
      name: new FormControl({ value: '', disabled: true }),
      shortName: new FormControl({ value: '', disabled: true }),
    });
  }
}

const getRandomSample = () =>
  sampleData[Math.floor(Math.random() * sampleData.length)];

export const patientCreateToastSuccessMessage =
  'Paciente creado exitosamente';
export const patientUpdateToastSuccessMessage =
  'Paciente actualizado exitosamente';
export const patientDeleteToastSuccessMessage =
  'Paciente eliminado exitosamente';

export const patientDeleteRangeModal: Modal = {
  title: 'Eliminar pacientes',
  message: '¿Estás seguro que deseas eliminar los pacientes seleccionados?',
  btnOkText: 'Eliminar',
  btnCancelText: 'Cancelar',
};

export const patientDeleteModal: Modal = {
  title: 'Eliminar paciente',
  message: '¿Estás seguro que deseas eliminar el paciente?',
  btnOkText: 'Eliminar',
  btnCancelText: 'Cancelar',
};

export const patientEditModal: Modal = {
  title: 'Actualizar',
  message: '¿Confirmas los cambios hechos en este paciente?',
  btnOkText: 'Confirmar',
  btnCancelText: 'Cancelar',
};

export const patientEditUnsavedChangesModal: Modal = {
  title: 'Cambios no guardados',
  message:
    '¿Estás seguro que deseas salir sin guardar los cambios realizados a este paciente?',
  btnOkText: 'Salir',
  btnCancelText: 'Cancelar',
};

export const patientCreateUnsavedChangesModal: Modal = {
  title: 'Cambios no guardados',
  message:
    '¿Estás seguro que deseas salir sin guardar su progreso en la creación de un nuevo paciente?',
  btnOkText: 'Salir',
  btnCancelText: 'Cancelar',
};

export const sample1: Patient = {
  id: 1,
  isSelected: false,
} as Patient;

export const sample2: Patient = {
  id: 2,
  isSelected: false,
} as Patient;

export const sample3: Patient = {
  id: 3,
  isSelected: false,
} as Patient;

export const sample4: Patient = {
  id: 4,
  isSelected: false,
} as Patient;

export const sample5: Patient = {
  id: 5,
  isSelected: false,
} as Patient;

export const sampleData: Patient[] = [
  sample1 as Patient,
  sample2 as Patient,
  sample3 as Patient,
  sample4 as Patient,
  sample5 as Patient,
];
