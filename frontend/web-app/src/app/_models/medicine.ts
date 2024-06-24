import { ToastrService } from "ngx-toastr";
import { Observable, switchMap, map, catchError, of } from "rxjs";
import { ConfirmService } from "../_services/confirm/confirm.service";
import { MedicinesService } from "../_services/data/medicines.service";
import { Column } from "./types";
import { Modal } from "./modal";
import { HttpParams } from "@angular/common/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import cuid from "cuid";
import { getPaginationHeaders } from "../_utils/util";

const subject = 'medicine';

export class Medicine {
  id: number;
  isSelected: boolean;

  name: string;
  description: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  price: number;
  manufacturer: string;
  lotNumber: string;

  static columns: Column[] = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Nombre' },
    { name: 'quantity', label: 'Cantidad' },
    { name: 'unit', label: 'Unidad' },
    { name: 'price', label: 'Precio' },
    { name: 'manufacturer', label: 'Fabricante' },
    { name: 'lotNumber', label: 'Número de lote' },
  ];

  constructor(
    id: number,
    isSelected: boolean,
    name: string,
    description: string,
    quantity: number,
    unit: string,
    expirationDate: Date,
    price: number,
    manufacturer: string,
    lotNumber: string,
  ) {
    this.id = id;
    this.isSelected = isSelected;

    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.unit = unit;
    this.expirationDate = expirationDate;
    this.price = price;
    this.manufacturer = manufacturer;
    this.lotNumber = lotNumber;
  }

  static deleteItems = (
    items: Medicine[],
    service: MedicinesService,
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
    service: MedicinesService,
    confirm: ConfirmService,
    toastr: ToastrService,
  ): Observable<boolean> {
    return confirm.confirm(medicineDeleteModal).pipe(
      switchMap((result) => {
        if (result) {
          return service.delete(id).pipe(
            map(() => {
              toastr.success('Medicamento eliminada');
              return true;
            }),
            catchError((error) => {
              toastr.error('Error al eliminar el medicamento');
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
    service: MedicinesService,
    confirm: ConfirmService,
    toastr: ToastrService,
  ): Observable<boolean> {
    return confirm.confirm(medicineDeleteModal).pipe(
      switchMap((result) => {
        if (result) {
          return service.deleteRange(ids.join(',')).pipe(
            map(() => {
              toastr.success('Medicamentos eliminados');
              return true;
            }),
            catchError((error) => {
              toastr.error('Error al eliminar los medicamentos');
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

export class MedicineParams {
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
  
    updateFromPartial(partial: Partial<MedicineParams>) {
      Object.assign(this, partial);
    }
  }
  
  export class FilterForm {
    subject = 'medicine';
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
  
    patchValue(params: MedicineParams) {
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
  
    patchValues = (item: Medicine) => this.formGroup.patchValue(item);
  
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
  
  export const medicineCreateToastSuccessMessage = 'Medicamento creada exitosamente';
  export const medicineUpdateToastSuccessMessage = 'Medicamento actualizada exitosamente';
  export const medicineDeleteToastSuccessMessage = 'Medicamento eliminada exitosamente';
  
  export const medicineDeleteRangeModal: Modal = {
    title: 'Eliminar prescripciones',
    message: '¿Estás seguro que deseas eliminar los medicamentos seleccionadas?',
    btnOkText: 'Eliminar',
    btnCancelText: 'Cancelar',
  };
  
  export const medicineDeleteModal: Modal = {
    title: 'Eliminar prescripción',
    message: '¿Estás seguro que deseas eliminar el medicamento?',
    btnOkText: 'Eliminar',
    btnCancelText: 'Cancelar',
  };
  
  export const medicineEditModal: Modal = {
    title: 'Actualizar',
    message: '¿Confirmas los cambios hechos en este medicamento?',
    btnOkText: 'Confirmar',
    btnCancelText: 'Cancelar',
  };
  
  export const medicineEditUnsavedChangesModal: Modal = {
    title: 'Cambios no guardados',
    message:
      '¿Estás seguro que deseas salir sin guardar los cambios realizados a este medicamento?',
    btnOkText: 'Salir',
    btnCancelText: 'Cancelar',
  };
  
  export const medicineCreateUnsavedChangesModal: Modal = {
    title: 'Cambios no guardados',
    message:
      '¿Estás seguro que deseas salir sin guardar su progreso en la creación de un nuevo medicamento?',
    btnOkText: 'Salir',
    btnCancelText: 'Cancelar',
  };
  
  export const sample1: Medicine = {
      id: 1,
      isSelected: false,
    } as Medicine;
    
    export const sample2: Medicine = {
      id: 2,
      isSelected: false,
    } as Medicine;
    
    export const sample3: Medicine = {
      id: 3,
      isSelected: false,
    } as Medicine;
    
    export const sample4: Medicine = {
      id: 4,
      isSelected: false,
    } as Medicine;
    
    export const sample5: Medicine = {
      id: 5,
      isSelected: false,
    } as Medicine;
    
    export const sampleData: Medicine[] = [
      sample1 as Medicine,
      sample2 as Medicine,
      sample3 as Medicine,
      sample4 as Medicine,
      sample5 as Medicine,
    ];
    
  
