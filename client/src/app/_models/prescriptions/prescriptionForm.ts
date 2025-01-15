import { Validators } from "@angular/forms";
import { Account } from "../account/account";
import { Address } from "src/app/_models/addresses/address";
import { Column } from "src/app/_models/base/column";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { medicalLicenseFormInfo } from "../medicalLicenses/medicalLicenseConstants";
import { MedicalLicense } from "../medicalLicenses/medicalLicense";
import { PrescriptionItem, prescriptionItemInfo } from "src/app/_models/prescriptionItem";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { prescriptionFormInfo } from "src/app/_models/prescriptions/prescriptionConstants";
import { User } from "src/app/_models/users/user";
import { Patient } from 'src/app/_models/patients/patient';
import Clinic from 'src/app/_models/clinics/clinic';
import { isNullOrWhiteSpace } from 'src/app/_utils/util';


export class PrescriptionForm extends FormGroup2<Prescription> {
  clinicSelectMode = true;

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

  set productOptions(value: SelectOption[]) {
    this._productOptions = value;
    if (this.controls.items.controls.length && this.controls.items.controls.length > 0) {
      this.controls.items.controls.forEach(x => {
        x.controls.selectProduct.selectOptions = this._productOptions;
      });
    }
  }

  set patientOptions(value: SelectOption[]) {
    this._patientOptions = value;
    this.controls.patient.controls.select.selectOptions = this._patientOptions;
  }

  set clinicOptions(value: SelectOption[]) {
    this._clinicOptions = value;
    this.controls.clinic.controls.select.selectOptions = this._clinicOptions;
  }

  constructor() {
    super(Prescription, new Prescription(), prescriptionFormInfo);

    this.addEmptyProductItem();
    this.controls.patient.controls.select.showLabel = false;
    this.controls.date.showLabel = false;

    this.controls.patient.controls.select.valueChanges.subscribe({
      next: (value: SelectOption | null): void => {
        if (value !== null && value !== undefined && !isNullOrWhiteSpace(value)) {
          this.controls.patient.controls.id.patchValue(value.id);
          this.controls.patient.controls.fullName.patchValue(value.name);
          this.controls.patient.controls.email.patchValue(value.code);

          if (value.options !== null) {
            this.controls.patient.controls.photoUrl.patchValue(value.options.photoUrl);
            if (value.options.sex !== null) {
              this.controls.patient.controls.sex.patchValue(new SelectOption({
                name: value.options.sex,
                code: value.options.sex,
              }));
            }
          }
        }
      }
    });

    this.controls.clinic.controls.select.valueChanges.subscribe({
      next: (value: SelectOption | null): void => {
        if (value !== null && value !== undefined && !isNullOrWhiteSpace(value)) {
          this.controls.clinic.controls.id.patchValue(value.id);
          if (value.options !== null) {
            this.controls.clinic.controls.photoUrl.patchValue(value.options.photoUrl);
          }
        }
      }
    });
  }

  /**
   * Patches the form with prescription data based on the current use case ('create', 'detail', or 'edit').
   * This method populates form controls with data from the provided prescription object.
   *
   * @param prescription - The prescription object containing data to patch the form with. Can be null.
   * @param fromEventWindow - A boolean flag indicating if the patch is triggered from an event window.
   *                          Default is false. When true, it disables certain form controls.
   *
   * @returns void This method doesn't return a value, it updates the form state internally.
   */
  patch(prescription: Prescription | null, fromEventWindow: boolean = false): void {
    if (this.use === 'create') {
      const doctor = prescription?.doctor;
      this.controls.doctor.patchValue(doctor as Account);
      this.controls.date.patchValue(new Date());

      if (doctor && doctor.doctorClinics.length && doctor.doctorClinics.length > 0) {
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

      if (doctor && doctor.medicalLicenses.length && doctor.medicalLicenses.length > 0) {
        doctor.medicalLicenses.forEach(license => {
          this.controls.doctor.controls.medicalLicenses.push(new FormGroup2<MedicalLicense>(MedicalLicense, new MedicalLicense({
            ...license,
            licenseNumber: license.licenseNumber,
            specialtyId: license.specialtyId,
            specialtyLicense: license.specialtyLicense,
            specialtyName: license.specialtyName,
          }), medicalLicenseFormInfo));
        });
      }
    }

    if (this.use === 'detail' || this.use === 'edit') {
      if (prescription !== null) {
        const { doctor, clinic, patient } = prescription;

        this.controls.items.clear();

        prescription.items.forEach(pi => {
          const prescriptionItem = new PrescriptionItem({ ...pi, });
          const prescriptionItemGroup = new FormGroup2<PrescriptionItem>(PrescriptionItem, prescriptionItem, prescriptionItemInfo);

          prescriptionItemGroup.controls.selectProduct.setValue(new SelectOption({
            name: prescriptionItem.name ?? undefined,
            code: prescriptionItem.name ?? undefined,
          }));

          if (pi.unit) prescriptionItemGroup.controls.dosage.inputGroupAppend = pi.unit;

          this.controls.items.push(prescriptionItemGroup);
        });

        this.controls.notes.patchValue(prescription.notes);
        this.controls.date.patchValue(prescription.date, { emitEvent: false });
        this.controls.clinic.patchValue(clinic as Address, { emitEvent: false });
        this.controls.clinic.controls.photoUrl.patchValue(clinic.photoUrl);
        this.controls.doctor.patchValue(doctor as Account, { emitEvent: false });
        this.controls.patient.patchValue(patient as Patient, { emitEvent: false });
      }
    }

    if (fromEventWindow) {
      this.controls.date.disable({ emitEvent: false });
      this.controls.patient.controls.select.disable({ emitEvent: false });
    }
  }

  patchProductItem(value: SelectOption | null, index: number) {
    if (this.controls.items.length && this.controls.items.length > 0) {
      if (value !== null) {
        this.controls.items.controls[index].controls.quantity.patchValue(1);
        this.controls.items.controls[index].controls.id.patchValue(value.id);
        this.controls.items.controls[index].controls.name.patchValue(value.name);
        this.controls.items.controls[index].controls.product.controls.id.patchValue(value.id);
        this.controls.items.controls[index].controls.product.controls.name.patchValue(value.name);

        if (value.options?.price) {
          this.controls.items.controls[index].controls.product.controls.description.patchValue(value.options?.description);
        }

        if (value.options?.dosage) {
          this.controls.items.controls[index].controls.product.controls.dosage.patchValue(value.options?.dosage.toString());
        }

        if (value?.options?.dosage) {
          this.controls.items.controls[index].controls.dosage.patchValue(value?.options?.dosage);
          if (value?.options?.unit) {
            this.controls.items.controls[index].controls.dosage.inputGroupAppend = value?.options?.unit;
            this.controls.items.controls[index].controls.unit.patchValue(value?.options?.unit);
          }
        }

        if (value?.options?.description) {
          this.controls.items.controls[index].controls.description.patchValue(value?.options?.description);
        }

        this.controls.items.controls[index].disable();
        this.controls.items.controls[index].controls.selectProduct.enable();
        this.controls.items.controls[index].controls.instructions.enable();
        this.controls.items.controls[index].controls.quantity.enable();
      }
    }
  }

  removeProductItem(index: number) {
    this.controls.items.removeAt(index);
    this.updateValueAndValidity();
  }

  // returns true if all of the items in the FormArray<FormGroup2<PrescriptionItem>> have a value in the itemId property
  get addButtonEnabled(): boolean {
    return this.controls.items.controls.every(x => x.controls.selectProduct.value?.id !== null);
  }

  addEmptyProductItem() {
    const prescriptionItem = new PrescriptionItem();
    const prescriptionItemGroup = new FormGroup2<PrescriptionItem>(PrescriptionItem, prescriptionItem, prescriptionItemInfo);
    prescriptionItemGroup.controls.selectProduct.selectOptions = this._productOptions;

    prescriptionItemGroup.disable();
    prescriptionItemGroup.controls.selectProduct.enable();

    prescriptionItemGroup.controls.selectProduct.setValidators([ Validators.required, Validators.maxLength(500) ]);
    prescriptionItemGroup.controls.quantity.setValidators([ Validators.required, Validators.min(1), Validators.max(1000) ]);
    prescriptionItemGroup.controls.instructions.setValidators([ Validators.required, Validators.maxLength(1000) ]);

    this.controls.items.push(prescriptionItemGroup);
    this.updateValueAndValidity();
  }

  get addressString1(): string | null {
    const street = this.controls.clinic.controls.street.value;
    const exteriorNumber = this.controls.clinic.controls.exteriorNumber.value || 'Sin Número';

    if (street && exteriorNumber) {
      return `${street}, ${exteriorNumber}`;
    }

    return null;
  }

  get addressString2(): string | null {
    const city = this.controls.clinic.controls.city.value;
    const state = this.controls.clinic.controls.state.value;
    const country = this.controls.clinic.controls.country.value;

    if (!city && !state && !country) return null;

    let address = '';

    if (city) address += `${city}, `;
    if (state) address += `${state}, `;
    if (country) address += `${country}`;

    return address.trim();
  }

  get hasAddress(): boolean {
    return this.controls.clinic.controls.id.value !== null;
  }

  get doctorPhoneNumber(): string | null {
    const { phoneNumberCountryCode, phoneNumber } = this.controls.doctor.controls;

    if (!phoneNumberCountryCode.value || !phoneNumber.value) return null;

    return `${phoneNumberCountryCode.value} ${phoneNumber.value}`;
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

  get payload(): {
    items: {
      product: SelectOption | null;
      quantity: number | null;
      instructions: string | null;
      dosage: number | null;
      unit: string | null;
    }[];
    patient: SelectOption | null;
    event: SelectOption | null;
    clinic: SelectOption | null;
    exchangeAmount: number | null;
    notes: string | null;
  } {
    const patient = this.controls.patient.controls;
    const clinic = this.controls.clinic.controls;
    const event = this.controls.event.controls;

    return {
      items: this.controls.items.controls.map(x => ({
        product: x.controls.selectProduct.value,
        quantity: x.controls.quantity.value,
        instructions: x.controls.instructions.value,
        dosage: x.controls.dosage.value,
        unit: x.controls.unit.value,
      })),
      patient: patient.id.value === null ? null : new SelectOption({
        id: patient.id.value,
      }),
      event: event.id.value === null ? null : new SelectOption({
        id: event.id.value,
      }),
      clinic: clinic.id.value === null ? null : new SelectOption({
        id: clinic.id.value,
      }),
      exchangeAmount: this.controls.exchangeAmount.value,
      notes: this.controls.notes.value,
    };
  }
}
