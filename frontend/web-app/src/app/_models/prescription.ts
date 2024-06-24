import { HttpParams } from '@angular/common/http';
import { Modal } from './modal';
import {
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, switchMap, map, catchError, of } from 'rxjs';
import cuid from 'cuid';
import { Column } from './types';
import { PrescriptionsService } from '../_services/data/prescriptions.service';
import { ConfirmService } from '../_services/confirm/confirm.service';
import { Doctor } from './user';
import { getPaginationHeaders } from '../_utils/util';
import { Medicine } from './medicine';
import { Patient } from './patient';

export interface Inventory {
    medicines: Medicine[];
    prescriptions: Prescription[];
  }
  

  export interface PrescribedMedicine {
    medicine: Medicine;
    dose: number;
    unit: string;
    frequency: string;
    duration: string;
  }
  
  export enum PrescriptionStatus {
    Active = 'Activa',
    Completed = 'Completada',
    Canceled = 'Cancelada',
    Expired = 'Expirada',
  }

const subject = 'prescription';

export class Prescription {
  id: number;
  isSelected: boolean;

    date: Date;
    patient: Patient;
    doctor: Doctor;
    medicines: PrescribedMedicine[];
    dosageInstructions: string;
    refillable: boolean;
    numberOfRefills: number;
    status: PrescriptionStatus;
  
  static columns: Column[] = [
    { name: 'id', label: 'ID' },
    { name: 'shortName', label: 'Nombre corto' },
    { name: 'name', label: 'Nombre' },
  ];

  constructor(
    id: number,
    isSelected: boolean,
    date: Date,
    patient: Patient,
    doctor: Doctor,
    medicines: PrescribedMedicine[],
    dosageInstructions: string,
    refillable: boolean,
    numberOfRefills: number,
    status: PrescriptionStatus,
  ) {
    this.id = id;
    this.isSelected = isSelected;

    this.date = date;
    this.patient = patient;
    this.doctor = doctor;
    this.medicines = medicines;
    this.dosageInstructions = dosageInstructions;
    this.refillable = refillable;
    this.numberOfRefills = numberOfRefills;
    this.status = status;
  }

  static deleteItems = (
    items: Prescription[],
    service: PrescriptionsService,
    confirm: ConfirmService,
    toastr: ToastrService,
  ) => {
    if (!items || items.length === 0) return;

    if (items.length === 1) {
      this.deleteById(items[0].id, service, confirm, toastr).subscribe();
    } else {
      const selectedIds = items
        .filter((item) => item.isSelected)
        .map((item) => item.id);

      this.deleteRangeById(selectedIds, service, confirm, toastr).subscribe();
    }
  };

  static deleteById(
    id: number,
    service: PrescriptionsService,
    confirm: ConfirmService,
    toastr: ToastrService,
  ): Observable<boolean> {
    return confirm.confirm(raceDeleteModal).pipe(
      switchMap((result) => {
        if (result) {
          return service.delete(id).pipe(
            map(() => {
              toastr.success('Prescripción eliminada');
              return true;
            }),
            catchError((error) => {
              toastr.error('Error al eliminar la prescripción');
              console.error(error);
              return of(false);
            }),
          );
        }
        return of(false);
      }),
    );
  }

  static deleteRangeById(
    ids: number[],
    service: PrescriptionsService,
    confirm: ConfirmService,
    toastr: ToastrService,
  ): Observable<boolean> {
    return confirm.confirm(raceDeleteModal).pipe(
      switchMap((result) => {
        if (result) {
          return service.deleteRange(ids.join(',')).pipe(
            map(() => {
              toastr.success('Categorias eliminadas');
              return true;
            }),
            catchError((error) => {
              toastr.error('Error al eliminar las prescripciones');
              console.error(error);
              return of(false);
            }),
          );
        }
        return of(false);
      }),
    );
  }
}

export class PrescriptionParams {
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

  updateFromPartial(partial: Partial<PrescriptionParams>) {
    Object.assign(this, partial);
  }
}

export class FilterForm {
  subject = 'race';
  formGroup: FormGroup;
  id: string;

  constructor() {
    this.id = `${this.subject}filterForm${cuid()}`;
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

  patchValue(params: PrescriptionParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.formGroup.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
      },
      { emitEvent: false, onlySelf: true },
    );
  }
}

export class CreateForm {
  formGroup: FormGroup;
  id: string;

  constructor(mode: boolean) {
    this.id = `${subject}Form${cuid()}`;

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
    this.id = `${subject}Form${cuid()}`;

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

  patchValues = (item: Prescription) => this.formGroup.patchValue(item);

  constructor() {
    this.id = `${subject}Form${cuid()}`;

    this.formGroup = new FormGroup({
      name: new FormControl({ value: '', disabled: true }),
      shortName: new FormControl({ value: '', disabled: true }),
    });
  }
}

const getRandomSample = () =>
  sampleData[Math.floor(Math.random() * sampleData.length)];

export const raceCreateToastSuccessMessage = 'Prescripción creada exitosamente';
export const raceUpdateToastSuccessMessage = 'Prescripción actualizada exitosamente';
export const raceDeleteToastSuccessMessage = 'Prescripción eliminada exitosamente';

export const raceDeleteRangeModal: Modal = {
  title: 'Eliminar prescripciones',
  message: '¿Estás seguro que deseas eliminar las prescripciones seleccionadas?',
  btnOkText: 'Eliminar',
  btnCancelText: 'Cancelar',
};

export const raceDeleteModal: Modal = {
  title: 'Eliminar prescripción',
  message: '¿Estás seguro que deseas eliminar la prescripción?',
  btnOkText: 'Eliminar',
  btnCancelText: 'Cancelar',
};

export const raceEditModal: Modal = {
  title: 'Actualizar',
  message: '¿Confirmas los cambios hechos en esta prescripción?',
  btnOkText: 'Confirmar',
  btnCancelText: 'Cancelar',
};

export const raceEditUnsavedChangesModal: Modal = {
  title: 'Cambios no guardados',
  message:
    '¿Estás seguro que deseas salir sin guardar los cambios realizados a esta prescripción?',
  btnOkText: 'Salir',
  btnCancelText: 'Cancelar',
};

export const raceCreateUnsavedChangesModal: Modal = {
  title: 'Cambios no guardados',
  message:
    '¿Estás seguro que deseas salir sin guardar su progreso en la creación de una nueva prescripción?',
  btnOkText: 'Salir',
  btnCancelText: 'Cancelar',
};

export const sample1: Prescription = {
    id: 1,
    isSelected: false,
  } as Prescription;
  
  export const sample2: Prescription = {
    id: 2,
    isSelected: false,
  } as Prescription;
  
  export const sample3: Prescription = {
    id: 3,
    isSelected: false,
  } as Prescription;
  
  export const sample4: Prescription = {
    id: 4,
    isSelected: false,
  } as Prescription;
  
  export const sample5: Prescription = {
    id: 5,
    isSelected: false,
  } as Prescription;
  
  export const sampleData: Prescription[] = [
    sample1 as Prescription,
    sample2 as Prescription,
    sample3 as Prescription,
    sample4 as Prescription,
    sample5 as Prescription,
  ];
  
