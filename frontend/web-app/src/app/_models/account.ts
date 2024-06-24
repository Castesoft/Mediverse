import { Modal } from "./modal";
import cuid from "cuid";
import { FormControl, FormGroup, Validators } from "@angular/forms";

export class Account {
  id: number;
  username: string;
  riskLevel: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  isPhoneNumberVerified: boolean;
  sex: string;
  token: string;
  photoUrl: string;
  roles: string[];
  dateOfBirth: Date;
  dateCreated: Date;
  permissions: string[];

  constructor(
    id: number,
    username: string,
    riskLevel: number,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    isEmailVerified: boolean,
    phoneNumber: string,
    phoneNumberCountryCode: string,
    isPhoneNumberVerified: boolean,
    sex: string,
    token: string,
    photoUrl: string,
    roles: string[],
    dateOfBirth: Date,
    dateCreated: Date,
    perimissions: string[]
  ) {
    this.id = id;
    this.username = username;
    this.riskLevel = riskLevel;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = fullName;
    this.email = email;
    this.isEmailVerified = isEmailVerified;
    this.phoneNumber = phoneNumber;
    this.phoneNumberCountryCode = phoneNumberCountryCode;
    this.isPhoneNumberVerified = isPhoneNumberVerified;
    this.sex = sex;
    this.token = token;
    this.photoUrl = photoUrl;
    this.roles = roles;
    this.dateOfBirth = dateOfBirth;
    this.dateCreated = dateCreated;
    this.permissions = perimissions;
  }

  // static initDeleteForm = (
  //   fb: FormBuilder,
  //   dataService: AccountService,
  // ): FormGroup => {


  //   const form = fb.group({
  //     requiredText: ['', [Validators.required, validateRequiredText(this.account)]],
  //   });

  //   return form;
  // }
}

export const deleteAccountConfirmModal: Modal = {
  title: 'Eliminar cuenta',
  message: '¿Estás seguro que deseas eliminar esta cuenta?',
  btnOkText: 'Eliminar',
  btnCancelText: 'Cancelar'
};

export const updatePasswordConfirmModal: Modal = {
  title: 'Actualizar contraseña',
  message: '¿Estás seguro que deseas actualizar la contraseña de esta cuenta?',
  btnOkText: 'Actualizar',
  btnCancelText: 'Cancelar'
};

export const updateEmailAddressConfirmModal: Modal = {
  title: 'Actualizar dirección de correo electrónico',
  message: '¿Estás seguro que deseas actualizar la dirección de correo electrónico de esta cuenta?',
  btnOkText: 'Actualizar',
  btnCancelText: 'Cancelar'
};

export const updatePhoneNumberConfirmModal: Modal = {
  title: 'Actualizar número de teléfono',
  message: '¿Estás seguro que deseas actualizar el número de teléfono de esta cuenta?',
  btnOkText: 'Actualizar',
  btnCancelText: 'Cancelar'
};

export const updateProfileConfirmModal: Modal = {
  title: 'Actualizar perfil',
  message: '¿Estás seguro que deseas actualizar el perfil de esta cuenta?',
  btnOkText: 'Actualizar',
  btnCancelText: 'Cancelar'
};

export const deleteAccountToastSuccessMessage: string = 'Perfil eliminado';

export const genders = [
  {
    id: 'Masculino',
    value: 'Masculino'
  },
  {
    id: 'Femenino',
    value: 'Femenino'
  },
  {
    id: 'Otro',
    value: 'Otro',
  },
  {
    id: 'Prefiero no contestar',
    value: 'Prefiero no contestar'
  }
];

export class PasswordResetForm {
    formGroup: FormGroup;
    id: string;
    subject = 'newPassword';
    submitted = false;
  
    constructor(
  
    ) {
      this.id = `${this.subject}Form${cuid()}`;
      this.formGroup = new FormGroup({
        email: new FormControl(''),
      });
  
    }
  
    setValidators(mode: boolean) {
      if (mode) {
        this.formGroup.controls['email'].setValidators([Validators.required, Validators.email]);
      } else {
        this.formGroup.controls['email'].clearValidators();
        this.formGroup.controls['email'].clearAsyncValidators();
      }
  
      this.formGroup.updateValueAndValidity();
    }
  
    patchWithSample = () => this.formGroup.patchValue({email: getRandomEmail()});
  
  }
  
  export const sampleEmails: string[] = [
    "example1@example.com", "example2@example.com", "example3@example.com", "example4@example.com", "example5@example.com", "example6@example.com", "example7@example.com",
    "example8@example.com", "example9@example.com", "example10@example.com", "example11@example.com", "example12@example.com", "example13@example.com",
    "example14@example.com", "example15@example.com", "example16@example.com", "example17@example.com", "example18@example.com", "example19@example.com", "example20@example.com",
    "example21@example.com", "example22@example.com", "example23@example.com", "example24@example.com", "example25@example.com", "example26@example.com", "example27@example.com",
    "example28@example.com", "example29@example.com", "example30@example.com", "example31@example.com", "example32@example.com", "example33@example.com", "example34@example.com",
    "example35@example.com", "example36@example.com", "example37@example.com", "example38@example.com", "example39@example.com", "example40@example.com", "example41@example.com",
    "example42@example.com", "example43@example.com", "example44@example.com", "example45@example.com", "example46@example.com", "example47@example.com", "example48@example.com",
    "example49@example.com", "example50@example.com"
  ];
  
  export const getRandomEmail = () => {
    const randomIndex = Math.floor(Math.random() * sampleEmails.length);
    return sampleEmails[randomIndex];
  }
  
