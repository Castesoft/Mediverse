import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/_forms/form';
import { baseInfo, Column, Entity } from 'src/app/_models/types';
import { PrescriptionItem, prescriptionItemInfo } from 'src/app/_models/prescriptionItem';
import { FormGroup2, FormInfo } from 'src/app/_forms/form2';
import { User, userInfo } from 'src/app/_models/user';
import { getPaginationHeaders } from 'src/app/_utils/util';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';
import { Account, accountInfo } from 'src/app/_models/account';
import { Address } from 'src/app/_models/address';
import { Event } from 'src/app/_models/event';
import { MedicalLicense, medicalLicenseInfo } from 'src/app/_models/medicalLicense';
import { Observable } from 'rxjs';

export class Prescription extends Entity {
  exchangeAmount: number | null = null;
  notes: string | null = null;
  logoUrl: string | null = null;
  orderId: number | null = null;
  date: Date | null = null;

  doctor: Account = new Account();

  clinic: Address = new Address();
  event: Event = new Event();
  patient: User = new User();

  items: PrescriptionItem[] = [];
  product: SelectOption | null = null;

  isCollapsed = true;

  constructor(init?: Partial<Prescription>) {
    super();

    Object.assign(this, init);
  }
}

export const prescriptionInfo: FormInfo<Prescription> = {
  ...baseInfo,
  doctor: accountInfo,
  exchangeAmount: { label: 'Monto de cambio', type: 'number', },
  isCollapsed: { label: 'Colapsado', type: 'checkbox', },
  items: prescriptionItemInfo,
  product: { label: 'Productos', type: 'typeahead', },
  logoUrl: { label: 'URL del logo', type: 'text', },
  notes: { label: 'Notas', type: 'textarea', },
  orderId: { label: 'ID de pedido', type: 'number', },
} as FormInfo<Prescription>;

export class PrescriptionForm extends FormGroup2<Prescription> {

  readonly prescriptionItemColumns: Column[] = [
    new Column('name', 'Nombre'),
    new Column('description', 'Descripción'),
    new Column('dose', 'Dosis'),
    new Column('instructions', 'Instrucciones'),
    new Column('quantity', 'Cantidad'),
  ];

  private _productOptions: SelectOption[] = [];

  set productOptions(value: SelectOption[]) {
    this._productOptions = value;
    if (this.controls.items.controls.length && this.controls.items.controls.length > 0) {
      this.controls.items.controls.forEach(x => {
        x.controls.selectProduct.selectOptions = this._productOptions;
      });
    }
  }

  constructor() {
    super(Prescription, new Prescription(), prescriptionInfo);

    this.addEmptyProductItem();
  }

  patch(doctor: Account, prescription: Prescription | null) {
    console.log('doctor', doctor, 'prescription', prescription);


    if (this.use === 'create') {
      this.controls.doctor.patchValue(
        new Account({
          ...doctor,
      }));

      this.controls.date.patchValue(new Date());

      if (doctor.doctorClinics.length && doctor.doctorClinics.length > 0) {
        const clinic = doctor.doctorClinics[0];
        this.controls.clinic.patchValue(new Address({
          city: clinic.city,
          country: clinic.country,
          exteriorNumber: clinic.exteriorNumber,
          interiorNumber: clinic.interiorNumber,
          photoUrl: clinic.logoUrl,
          isMain: clinic.isMain,
          latitude: clinic.latitude,
          longitude: clinic.longitude,
          neighborhood: clinic.neighborhood,
          zipcode: clinic.zipcode,
          state: clinic.state,
          street: clinic.street,
        }));
      }

      if (doctor.medicalLicenses.length && doctor.medicalLicenses.length > 0) {
        doctor.medicalLicenses.forEach(license => {
          this.controls.doctor.controls.medicalLicenses.push(new FormGroup2<MedicalLicense>(MedicalLicense, new MedicalLicense({
            ...license,
            licenseNumber: license.licenseNumber,
            specialtyId: license.specialtyId,
            specialtyLicense: license.specialtyLicense,
            specialtyName: license.specialtyName,
          }), medicalLicenseInfo));
        })
      }
    }


    if (this.use === 'detail' || this.use === 'edit') {
      if (prescription !== null) {
        this.controls.items.clear();
        prescription.items.forEach(x => {
          const prescriptionItem = new PrescriptionItem({
            ...x,
          });
          const prescriptionItemGroup = new FormGroup2<PrescriptionItem>(PrescriptionItem, prescriptionItem, prescriptionItemInfo);
          if (x.unit) {
            prescriptionItemGroup.controls.dosage.inputGroupAppend = x.unit;
          }
          this.controls.items.push(prescriptionItemGroup);
        });

        this.controls.date.patchValue(prescription.date);

        this.controls.clinic.patchValue(new Address({
          ...prescription.clinic,
        }));

        this.controls.doctor.patchValue(new Account({
          ...prescription.doctor,
        }));
      }
    }

    this.updateValueAndValidity();
  }

  patchProductItem(value: SelectOption | null, index: number) {
    if (this.controls.items.length && this.controls.items.length > 0) {
      const prescriptionItem = this.controls.items.controls[index];
      prescriptionItem.controls.selectProduct.patchValue(value);
      prescriptionItem.controls.quantity.patchValue(1);
    }
  }

  removeProductItem(index: number) {
    this.controls.items.removeAt(index);
    this.updateValueAndValidity();
  }

  addEmptyProductItem() {
    const prescriptionItem = new PrescriptionItem();
    const prescriptionItemGroup = new FormGroup2<PrescriptionItem>(PrescriptionItem, prescriptionItem, prescriptionItemInfo);
    prescriptionItemGroup.controls.selectProduct.selectOptions = this._productOptions;
    this.controls.items.push(prescriptionItemGroup);
    this.updateValueAndValidity();
  }

  get addressString1(): string {
    return `${this.controls.clinic.controls.street.value!} ${this.controls.clinic.controls.exteriorNumber.value!} ${this.controls.clinic.controls.neighborhood.value!}`;
  }

  get addressString2(): string {
    return `${this.controls.clinic.controls.city.value!}, ${this.controls.clinic.controls.state.value!}, ${this.controls.clinic.controls.country.value!}`;
  }

  get hasAddress(): boolean {
    return this.controls.clinic.controls.id.value !== null;
  }

  get doctorPhoneNumber(): string {
    return `${this.controls.doctor.controls.phoneNumberCountryCode.value!} ${this.controls.doctor.controls.phoneNumber.value!}`;
  }

  get doctorLicenseNumber(): string | null {
    const medicalLicense = this.controls.doctor.controls.medicalLicenses.controls;
    if (medicalLicense.length && medicalLicense.length > 0) {
      const licenseNumber = medicalLicense[0].controls.licenseNumber;
      if (licenseNumber.value) {
        return licenseNumber.value;
      }
    }
    return null;
  }

  get doctorSpecialtyLicense(): string | null {
    const medicalLicense = this.controls.doctor.controls.medicalLicenses.controls;
    if (medicalLicense.length && medicalLicense.length > 0) {
      const specialtyLicense = medicalLicense[0].controls.specialtyLicense;
      if (specialtyLicense.value) {
        return specialtyLicense.value;
      }
    }
    return null;
  }

  resetPatient() {
    this.controls.patient.reset();
    this.controls.patient.patchValue(new User());
    this.controls.patient.markAsPristine();
    this.updateValueAndValidity();
  }

  payload(): any {
    return this.value;
  }
}

export class PrescriptionParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;
  key?: string;

  // other
  sex?: string;

  constructor(key: string) {
    this.key = key;
  }

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.key) params = params.append('id', this.key);
    if (this.search) params = params.append('search', this.search);
    if (this.dateFrom)
      params = params.append(
        'dateFrom',
        this.dateFrom.toISOString(),
      );
    if (this.dateTo)
      params = params.append(
        'dateTo',
        this.dateTo.toISOString(),
      );
    if (this.sort) params = params.append('sort', this.sort);
    if (this.isSortAscending)
      params = params.append('isSortAscending', this.isSortAscending);
    if (this.pageSize) {
      params = params.append('pageSize', this.pageSize.toString());
    }

    if (this.sex) params = params.append('sex', this.sex);

    return params;
  }

  updateFromPartial(partial: Partial<PrescriptionParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
  }

  update(group: FormGroup, service: PrescriptionsService, key: string) {
    this.setFromFormGroup(group);
    service.setParam$(key, this);
  }
}

