import { Validators } from '@angular/forms';
import { Address } from 'src/app/_models/addresses/address';
import { Column } from 'src/app/_models/base/column';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { PrescriptionItem, prescriptionItemInfo } from 'src/app/_models/prescriptionItem';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { prescriptionFormInfo } from 'src/app/_models/prescriptions/prescriptionConstants';
import { User } from 'src/app/_models/users/user';
import { isNullOrWhiteSpace } from 'src/app/_utils/util';
import { medicalLicenseFormInfo } from 'src/app/_models/medicalLicenses/medicalLicenseConstants';
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { TypedFormGroup } from "src/app/_models/forms/formTypes";
import { Patient } from "src/app/_models/patients/patient";
import Clinic from "src/app/_models/clinics/clinic";
import { DoctorClinic } from "src/app/_models/doctors/doctorClinics/doctorClinic";
import { Doctor } from "src/app/_models/doctors/doctor.model";


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

  constructor() {
    super(Prescription, new Prescription(), prescriptionFormInfo);

    this.addEmptyProductItem();

    this.controls.patient.controls.select.showLabel = false;
    this.controls.date.showLabel = false;

    this.subscribeToPatientSelectChanges();
    this.subscribeToClinicSelectChanges();
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
      items: this.controls.items.controls.map((x: FormGroup2<PrescriptionItem>) => ({
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
          this.controls.clinic.controls.id.patchValue(value.id);
          if (value.options !== null) {
            this.controls.clinic.controls.photoUrl.patchValue(value.options.photoUrl);
          }
        }
      }
    );
  }

  setProductOptions(value: SelectOption[]): this {
    this._productOptions = value;
    if (this.controls.items.controls.length && this.controls.items.controls.length > 0) {
      this.controls.items.controls.forEach((x: FormGroup2<PrescriptionItem>) => {
        x.controls.selectProduct.selectOptions = this._productOptions;
      });
    }
    return this;
  }

  setPatientOptions(value: SelectOption[]): this {
    this._patientOptions = value;
    this.controls.patient.controls.select.selectOptions = this._patientOptions;
    return this;
  }

  setClinicOptions(value: SelectOption[]): this {
    this._clinicOptions = value;
    this.controls.clinic.controls.select.selectOptions = this._clinicOptions;
    return this;
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
      if (prescription !== null && prescription.doctor !== null) {
        const doctor: Doctor = prescription.doctor;

        this.controls.doctor.patchValue(doctor);
        this.controls.date.patchValue(new Date());

        if (doctor && doctor.clinics.length && doctor.clinics.length > 0) {
          const clinic: DoctorClinic = doctor.clinics[0];
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
          doctor.medicalLicenses.forEach((license: MedicalLicense) => {
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

    }

    if (this.use === 'detail' || this.use === 'edit') {
      if (prescription !== null) {
        const { doctor, clinic, patient } = prescription;

        this.controls.items.clear();

        prescription.items.forEach((pi: PrescriptionItem) => {
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
        this.controls.clinic.patchValue(clinic, { emitEvent: false });
        this.controls.clinic.controls.photoUrl.patchValue(clinic?.photoUrl);
        this.controls.doctor.patchValue(doctor, { emitEvent: false });
        this.controls.patient.patchValue(patient, { emitEvent: false });

        if (doctor) {
          this.patchMedicalLicenses(doctor.medicalLicenses);
        }
      }
    }

    if (fromEventWindow) {
      this.controls.date.disable({ emitEvent: false });
      this.controls.patient.controls.select.disable({ emitEvent: false });
    }
  }

  patchMedicalLicenses(medicalLicenses: MedicalLicense[]): void {
    if (!medicalLicenses.length || medicalLicenses.length == 0) return;

    medicalLicenses.forEach((license: MedicalLicense) => {
      this.controls.doctor.controls.medicalLicenses.push(new FormGroup2<MedicalLicense>(MedicalLicense, new MedicalLicense({
        ...license,
        licenseNumber: license.licenseNumber,
        specialtyId: license.specialtyId,
        specialtyLicense: license.specialtyLicense,
        specialtyName: license.specialtyName,
      }), medicalLicenseFormInfo));
    });
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

  private getMedicalLicenseProperty(property: 'licenseNumber' | 'specialtyLicense'): string | null {
    const medicalLicense: FormGroup2<MedicalLicense>[] = this.controls.doctor.controls.medicalLicenses.controls;
    if (!medicalLicense.length || medicalLicense.length == 0) return null;

    switch (property) {
      case 'licenseNumber':
        return medicalLicense[0].controls.licenseNumber.getRawValue();
      case 'specialtyLicense':
        return medicalLicense[0].controls.specialtyLicense.getRawValue();
      default:
        return null;
    }
  }

  resetPatient() {
    this.controls.patient.reset();
    this.controls.patient.patchValue(new User());
    this.controls.patient.markAsPristine();
    this.updateValueAndValidity();
  }
}
