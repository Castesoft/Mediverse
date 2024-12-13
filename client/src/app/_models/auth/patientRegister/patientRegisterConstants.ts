import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import matchValueValidator from 'src/app/_models/auth/patientRegister/matchValueValidator';
import PatientRegister from 'src/app/_models/auth/patientRegister/patientRegister';
import { baseInfo } from 'src/app/_models/base/entity';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormInfo } from 'src/app/_models/forms/formTypes';

export const sexOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'Masculino', name: 'Masculino' }),
  new SelectOption({ id: 2, code: 'Femenino', name: 'Femenino' }),
];

export const complexPasswordRegex = '(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*';

export function notNullValidator(): ValidatorFn {
  return (control: AbstractControl<SelectOption | null, SelectOption | null>) => {
    return control.value === null ? { notNull: true } : null;
  };
}

export const patientRegisterFormInfo: FormInfo<PatientRegister> = {
  agreeTerms: { type: 'checkbox', label: 'Acepto los términos y condiciones', validators: [ Validators.required,  ], },
  firstName: { type: 'text', label: 'Nombre', validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(500), ], },
  lastName: { type: 'text', label: 'Apellido', validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(500), ], },
  email: { type: 'email', label: 'Correo electrónico', validators: [ Validators.required, Validators.email, Validators.maxLength(500), ], },
  password: { type: 'password', label: 'Contraseña', validators: [ Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(complexPasswordRegex), ], },
  dateOfBirth: { type: 'date', label: 'Fecha de nacimiento', validators: [ Validators.required, Validators.maxLength(500), ], },
  sex: { type: 'radio', label: 'Sexo', validators: [ Validators.required, notNullValidator(), ], selectOptions: sexOptions, orientation: 'inline', showCodeSpan: false, },
  confirmPassword: { type: 'password', label: 'Confirmar contraseña',
    validators: [ Validators.required, Validators.minLength(8), Validators.maxLength(30), matchValueValidator('password'), ],
  },

  ...baseInfo,
} as FormInfo<PatientRegister>;
