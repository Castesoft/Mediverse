import { Validators } from '@angular/forms';
import { Address } from 'src/app/_models/addresses/address';
import { Column } from 'src/app/_models/base/column';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { PrescriptionItem, prescriptionItemInfo } from 'src/app/_models/prescriptionItem';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { prescriptionFormInfo } from 'src/app/_models/prescriptions/prescriptionConstants';
import { isNullOrWhiteSpace } from 'src/app/_utils/util';
import { medicalLicenseFormInfo } from 'src/app/_models/medicalLicenses/medicalLicenseConstants';
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { FormUse, TypedFormGroup } from "src/app/_models/forms/formTypes";
import { Patient } from "src/app/_models/patients/patient";
import Clinic from "src/app/_models/clinics/clinic";
import { DoctorClinic } from "src/app/_models/doctors/doctorClinics/doctorClinic";
import { Doctor } from "src/app/_models/doctors/doctor.model";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Options } from "src/app/_models/base/options";

export class PrescriptionForm extends FormGroup2<Prescription> {
  clinicSelectMode: boolean = true;

  readonly prescriptionItemColumns: Column[] = [
    new Column('number', '#'),
    new Column('name', 'Nombre'),
    new Column('description', 'Descripción'),
    new Column('dose', 'Dosis'),
    new Column('quantity', 'Cantidad'),
    new Column('', ''),
  ];

  private _productOptions: SelectOption[] = [];
  private _patientOptions: SelectOption[] = [];
  private _clinicOptions: SelectOption[] = [];

  private itemsValueChangesSubscription: Subscription | null = null;

  constructor() {
    super(Prescription, new Prescription(), prescriptionFormInfo);


    this.controls.patient.controls.select.showLabel = false;
    this.controls.date.showLabel = false;

    this.subscribeToPatientSelectChanges();
    this.subscribeToClinicSelectChanges();

    this.subscribeToItemsValueChanges();
  }


  get addButtonEnabled(): boolean {
    return this.controls.items.controls.every(
      (x: FormGroup2<PrescriptionItem>) => x.controls.selectProduct.value?.id !== null
    );
  }

  get addressString1(): string {
    const { street, exteriorNumber } = this.controls.clinic.controls;
    return street.value && exteriorNumber.value
      ? `${street.value}, ${exteriorNumber.value || 'Sin Número'}`
      : '';
  }

  get addressString2(): string {
    const { city, state, country } = this.controls.clinic.controls;
    const parts: (string | null)[] = [ city.value, state.value, country.value ].filter(Boolean);
    return parts.join(', ').trim();
  }

  get doctorPhoneNumber(): string | null {
    const { phoneNumberCountryCode, phoneNumber } = this.controls.doctor.controls;
    return phoneNumberCountryCode.value && phoneNumber.value
      ? `${phoneNumberCountryCode.value} ${phoneNumber.value}`
      : null;
  }

  get doctorLicenseNumber(): string | null {
    return this.getMedicalLicenseProperty('licenseNumber');
  }

  get doctorSpecialtyLicense(): string | null {
    return this.getMedicalLicenseProperty('specialtyLicense');
  }

  get payload(): any {
    const patient: TypedFormGroup<Patient> = this.controls.patient.controls;
    const clinic: TypedFormGroup<Clinic> = this.controls.clinic.controls;

    return {
      date: this.controls.date.value,

      items: this.controls.items.controls
        .filter((x: FormGroup2<PrescriptionItem>) => x.controls.selectProduct.value !== null && x.controls.selectProduct.value.id !== 0)
        .map((x: FormGroup2<PrescriptionItem>) => ({
          product: x.controls.selectProduct.value,
          quantity: x.controls.quantity.value,
          instructions: x.controls.instructions.value,
          dosage: x.controls.dosage.value,
          unit: x.controls.unit.value,
        })),
      patient: patient.id.value === null ? null : new SelectOption({
        id: patient.id.value,
      }),
      eventId: this.controls.event.controls.id.value,
      clinic: clinic.id.value === null ? null : new SelectOption({
        id: clinic.id.value,
      }),
      exchangeAmount: this.controls.exchangeAmount.value,
      notes: this.controls.notes.value,
    };
  }


  private subscribeToPatientSelectChanges() {
    this.controls.patient.controls.select.valueChanges.subscribe({
      next: (value: SelectOption | string | null | undefined): void => {
        if (typeof value === 'string' || value === null || value === undefined) {

          if (value === '' || value === null) {
            this.resetPatient(false);
          }
          return;
        }

        const { patient } = this.controls;

        patient.controls.id.patchValue(value.id);
        patient.controls.fullName.patchValue(value.name);
        patient.controls.email.patchValue(value.code);

        if (value.options) {
          patient.controls.photoUrl.patchValue(value.options.photoUrl);
          patient.controls.age.patchValue(value.options.age);

          if (value.options.sex) {
            patient.controls.sex.patchValue(new SelectOption({
              name: value.options.sex,
              code: value.options.sex,
            }));
          }
        }
      }
    });
  }

  private subscribeToClinicSelectChanges() {
    this.controls.clinic.controls.select.valueChanges.subscribe((value: SelectOption | null): void => {
        if (value !== null && value !== undefined && !isNullOrWhiteSpace(value)) {
          this.controls.clinic.controls.id.patchValue(value.id, { emitEvent: false });

          if (value.options !== null) {
            this.controls.clinic.controls.photoUrl.patchValue(value.options.photoUrl, { emitEvent: false });
          }
        } else if (value === null) {
          this.controls.clinic.patchValue(new Clinic(), { emitEvent: false });
          this.clinicSelectMode = true;
        }
      }
    );
  }

  private subscribeToItemsValueChanges(): void {

    this.itemsValueChangesSubscription?.unsubscribe();

    this.itemsValueChangesSubscription = this.controls.items.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(() => {
        this.updateFilteredProductOptions();
      });
  }

  setProductOptions(value: SelectOption[]): this {
    this._productOptions = [ ...value ];

    if (this.controls.items.controls.length === 0) {
      this.addEmptyProductItem();
    } else {
      this.updateFilteredProductOptions();
    }
    return this;
  }

  setPatientOptions(value: SelectOption[]): this {
    this._patientOptions = [ ...value ];
    this.controls.patient.controls.select.selectOptions = this._patientOptions;
    return this;
  }

  setClinicOptions(value: SelectOption[]): this {
    this._clinicOptions = [ ...value ];
    this.controls.clinic.controls.select.selectOptions = this._clinicOptions;
    this.controls.clinic.controls.select.enable({ emitEvent: false });
    return this;
  }

  patch(prescription: Prescription | null, fromEventWindow: boolean = false): void {
    const currentUse: FormUse = this.use;

    this.reset(new Prescription(), { emitEvent: false });

    if (currentUse === FormUse.CREATE) {
      if (prescription?.doctor) {
        const doctor: Doctor = prescription.doctor;
        this.controls.doctor.patchValue(doctor, { emitEvent: false });
        this.controls.date.patchValue(new Date(), { emitEvent: false });

        if (doctor.clinics?.length > 0) {
          const clinic: DoctorClinic = doctor.clinics[0];
          this.controls.clinic.patchValue(new Address({
            id: clinic.id, city: clinic.city, country: clinic.country,
            exteriorNumber: clinic.exteriorNumber, interiorNumber: clinic.interiorNumber,
            photoUrl: clinic.logoUrl, isMain: clinic.isMain, latitude: clinic.latitude,
            longitude: clinic.longitude, neighborhood: clinic.neighborhood,
            zipcode: clinic.zipcode, state: clinic.state, street: clinic.street,
          }), { emitEvent: false });
          this.clinicSelectMode = false;
        } else {
          this.clinicSelectMode = true;
          this.controls.clinic.reset(new Clinic(), { emitEvent: false });
        }
        if (doctor.medicalLicenses?.length > 0) {
          this.patchMedicalLicenses(doctor.medicalLicenses);
        }
      } else {
        this.clinicSelectMode = true;
        this.controls.date.patchValue(new Date(), { emitEvent: false });

        this.controls.clinic.reset(new Clinic(), { emitEvent: false });
      }
    } else if (currentUse === 'detail' || currentUse === 'edit') {

      if (prescription !== null) {
        const { doctor, clinic, patient, items } = prescription;

        this.controls.notes.patchValue(prescription.notes, { emitEvent: false });
        this.controls.date.patchValue(prescription.date, { emitEvent: false });
        this.controls.clinic.patchValue(clinic, { emitEvent: false });
        this.controls.clinic.controls.photoUrl.patchValue(clinic?.photoUrl, { emitEvent: false });
        this.controls.doctor.patchValue(doctor, { emitEvent: false });
        this.controls.patient.patchValue(patient, { emitEvent: false });
        this.clinicSelectMode = false;

        if (doctor) {
          this.patchMedicalLicenses(doctor.medicalLicenses);
        }

        if (items && items.length > 0) {
          items.forEach((prescriptionItem: PrescriptionItem) => {
            let optionForControl: SelectOption | null = null;
            if (prescriptionItem?.id != null && prescriptionItem.id !== 0) {
              const foundInMasterList = this._productOptions.find(opt => opt.id === prescriptionItem.id);
              if (foundInMasterList) {
                optionForControl = foundInMasterList;
              } else {
                const productId = prescriptionItem.id;
                const selectOptionOptions: Options = {
                  description: prescriptionItem.description,
                  dosage: null,

                  unit: prescriptionItem.unit,
                  price: prescriptionItem.price,
                  sex: null,
                  race: null,
                  age: null,
                  photoUrl: null,
                  color: null,
                  isMain: null,
                };
                optionForControl = new SelectOption({
                  id: productId,
                  name: prescriptionItem.name ?? 'Producto Desconocido',

                  options: selectOptionOptions,
                });
                console.warn(`Product ID ${prescriptionItem.id} from loaded prescription was not found in the master product options list. Created a fallback SelectOption.`);
              }
            } else {
              optionForControl = null;
              if (prescriptionItem.name) console.warn(`Prescription item had name '${prescriptionItem.name}' but no valid associated product ID.`);
            }

            const prescriptionItemModel = new PrescriptionItem({
              ...prescriptionItem,
              selectProduct: optionForControl
            });

            const prescriptionItemGroup = new FormGroup2<PrescriptionItem>(
              PrescriptionItem,
              prescriptionItemModel,
              prescriptionItemInfo
            );

            prescriptionItemGroup.controls.selectProduct.patchValue(optionForControl, { emitEvent: false });

            if (prescriptionItemModel.unit) {
              prescriptionItemGroup.controls.dosage.inputGroupAppend = prescriptionItemModel.unit;
            }

            this.controls.items.push(prescriptionItemGroup);
          });
        }

      }

    }

    if ((currentUse === 'create' || currentUse === 'edit') && this.controls.items.length === 0) {
      this.addEmptyProductItem();
    }

    this.updateFilteredProductOptions();

    if (fromEventWindow) {
      this.controls.date.disable({ emitEvent: false });
      this.controls.patient.controls.select.disable({ emitEvent: false });
    }

    this.setUse(currentUse);

    this.updateValueAndValidity({ onlySelf: false, emitEvent: false });
  }

  patchMedicalLicenses(medicalLicenses: MedicalLicense[]): void {
    if (!medicalLicenses?.length) return;

    this.controls.doctor.controls.medicalLicenses.clear();
    medicalLicenses.forEach((license: MedicalLicense) => {
      this.controls.doctor.controls.medicalLicenses.push(new FormGroup2<MedicalLicense>(MedicalLicense, new MedicalLicense({
        ...license,
      }), medicalLicenseFormInfo));
    });
  }

  patchProductItem(value: SelectOption | null, index: number) {
    console.log('patchProductItem', value, index);
    const itemControl = this.controls.items.at(index) as FormGroup2<PrescriptionItem>;
    if (!itemControl) return;

    console.log('patchProductItem', value);

    if (value !== null) {
      const fullOption = this._productOptions.find(opt => opt.id === value.id);

      itemControl.controls.quantity.patchValue(1, { emitEvent: false });

      itemControl.controls.name.patchValue(value.name, { emitEvent: false });
      itemControl.controls.product.controls.id.patchValue(value.id, { emitEvent: false });
      itemControl.controls.product.controls.name.patchValue(value.name, { emitEvent: false });

      itemControl.controls.description.patchValue(fullOption?.options?.description ?? null, { emitEvent: false });
      itemControl.controls.product.controls.description.patchValue(fullOption?.options?.description ?? null, { emitEvent: false });

      const dosage = fullOption?.options?.dosage ?? null;
      const unit = fullOption?.options?.unit ?? null;

      itemControl.controls.dosage.patchValue(dosage, { emitEvent: false });
      itemControl.controls.product.controls.dosage.patchValue(dosage?.toString() ?? null, { emitEvent: false });
      itemControl.controls.unit.patchValue(unit, { emitEvent: false });
      itemControl.controls.product.controls.unit.patchValue(unit, { emitEvent: false });

      if (unit) {
        itemControl.controls.dosage.inputGroupAppend = unit;
      } else {
        itemControl.controls.dosage.inputGroupAppend = '';
      }

      itemControl.enable({ emitEvent: false });
      itemControl.controls.selectProduct.enable({ emitEvent: false });
      itemControl.controls.description.disable({ emitEvent: false });
      itemControl.controls.dosage.disable({ emitEvent: false });
      itemControl.controls.unit.disable({ emitEvent: false });
      itemControl.controls.name.disable({ emitEvent: false });
      itemControl.controls.product.disable({ emitEvent: false });
    } else {
      itemControl.reset({ selectProduct: null }, { emitEvent: false });
      itemControl.controls.selectProduct.enable({ emitEvent: false });
      itemControl.controls.quantity.disable({ emitEvent: false });
      itemControl.controls.instructions.disable({ emitEvent: false });
      itemControl.controls.description.disable({ emitEvent: false });
      itemControl.controls.dosage.disable({ emitEvent: false });
      itemControl.controls.unit.disable({ emitEvent: false });
      itemControl.controls.name.disable({ emitEvent: false });
      itemControl.controls.product.disable({ emitEvent: false });
    }


  }

  removeProductItem(index: number) {
    this.controls.items.removeAt(index);

    if (this.controls.items.length === 0) {
      this.addEmptyProductItem();
    } else {
      this.updateFilteredProductOptions();
    }
    this.updateValueAndValidity();
  }

  addEmptyProductItem() {
    const prescriptionItem = new PrescriptionItem();
    const prescriptionItemGroup = new FormGroup2<PrescriptionItem>(PrescriptionItem, prescriptionItem, prescriptionItemInfo);

    prescriptionItemGroup.controls.selectProduct.setValidators([ Validators.required ]);
    prescriptionItemGroup.controls.quantity.setValidators([ Validators.required, Validators.min(1), Validators.max(1000) ]);
    prescriptionItemGroup.controls.instructions.setValidators([ Validators.required, Validators.maxLength(1000) ]);

    prescriptionItemGroup.disable();
    prescriptionItemGroup.controls.selectProduct.enable();

    this.controls.items.push(prescriptionItemGroup);

    this.updateFilteredProductOptions();
    this.updateValueAndValidity();
  }

  private updateFilteredProductOptions(): void {
    if (!this._productOptions || this._productOptions.length === 0) {
      return;
    }

    const selectedIds = new Set<number>(
      this.controls.items.controls
        .map((control: FormGroup2<PrescriptionItem>) => control.controls.selectProduct.value?.id)
        .filter((id): id is number => id !== null && id !== undefined && id !== 0)
    );

    this.controls.items.controls.forEach((itemControl: FormGroup2<PrescriptionItem>, index: number) => {
      const currentItemId = itemControl.controls.selectProduct.value?.id;

      itemControl.controls.selectProduct.selectOptions = this._productOptions.filter(option =>
        !selectedIds.has(option.id) ||
        option.id === currentItemId
      );
    });
  }

  private getMedicalLicenseProperty(property: 'licenseNumber' | 'specialtyLicense'): string | null {
    const medicalLicenses: FormGroup2<MedicalLicense>[] = this.controls.doctor.controls.medicalLicenses.controls;
    if (!medicalLicenses?.length) return null;

    const firstLicenseControls = medicalLicenses[0]?.controls;
    if (!firstLicenseControls) return null;

    switch (property) {
      case 'licenseNumber':
        return firstLicenseControls.licenseNumber.getRawValue();
      case 'specialtyLicense':
        return firstLicenseControls.specialtyLicense.getRawValue();
      default:
        return null;
    }
  }

  resetPatient(subscribe: boolean = true) {
    const currentPatientValue = this.controls.patient.value;
    this.controls.patient.reset(new Patient(), { emitEvent: false });
    this.controls.patient.markAsPristine();
    this.controls.patient.controls.select.selectOptions = this._patientOptions;
    this.updateValueAndValidity();
    if (subscribe) {
      this.subscribeToPatientSelectChanges();
    }
  }
}
