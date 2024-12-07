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


export class PrescriptionForm extends FormGroup2<Prescription> {

  clinicSelectMode = false;

  readonly prescriptionItemColumns: Column[] = [
    new Column('number', '#'),
    new Column('name', 'Nombre'),
    new Column('description', 'Descripción'),
    new Column('dose', 'Dosis'),
    // new Column('instructions', 'Instrucciones'),
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
          }), medicalLicenseFormInfo));
        });
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

  patchPatient(value: SelectOption | null) {
    if (value !== null) {
      this.controls.patient.patchValue(new User({
        id: value.id,
        fullName: value.name,
      }));
      this.controls.patient.controls.select.patchValue(new SelectOption({
        ...value,
      }));
    }
  }

  patchClinic(value: SelectOption | null) {
    if (value !== null) {
      this.controls.clinic.patchValue(new Address({
        id: value.id,
      }));
      this.controls.clinic.controls.select.patchValue(new SelectOption({
        ...value,
      }));
    }
  }

  patchProductItem(value: SelectOption | null, index: number) {
    if (this.controls.items.length && this.controls.items.length > 0) {
      if (value !== null) {
        const prescriptionItem = this.controls.items.controls[index];
        prescriptionItem.controls.selectProduct.patchValue(new SelectOption({ ...value }));
        prescriptionItem.controls.quantity.patchValue(1);

        if (value?.options?.dosage) {
          prescriptionItem.controls.dosage.patchValue(value?.options?.dosage);
          if (value?.options?.unit) {
            prescriptionItem.controls.dosage.inputGroupAppend = value?.options?.unit;
            prescriptionItem.controls.unit.patchValue(value?.options?.unit);
          }
        }

        if (value?.options?.description) {
          prescriptionItem.controls.description.patchValue(value?.options?.description);
        }

        prescriptionItem.disable();
        prescriptionItem.controls.selectProduct.enable();
        prescriptionItem.controls.instructions.enable();
        prescriptionItem.controls.quantity.enable();
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

    prescriptionItemGroup.controls.selectProduct.setValidators([Validators.required, Validators.maxLength(500)]);
    prescriptionItemGroup.controls.quantity.setValidators([Validators.required, Validators.min(1), Validators.max(1000)]);
    prescriptionItemGroup.controls.instructions.setValidators([Validators.required, Validators.maxLength(1000)]);

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
