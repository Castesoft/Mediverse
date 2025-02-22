import { FormInfo } from "../../_models/forms/formTypes";
import { Validators } from "@angular/forms";
import { FormGroup2 } from "../../_models/forms/formGroup2";

export class Login {
  email: string | null = null;
  password: string | null = null;
  twoFactorCode: string | null = null;

  constructor(init?: Partial<Login>) {
    Object.assign(this, init);
  }
}

export const loginInfo: FormInfo<Login> = {
  email: {
    type: 'text', label: 'Email', validators: [ Validators.required, Validators.email, Validators.maxLength(255) ],
    validationErrors: {
      required: 'El nombre de usuario o el correo es requerido.',
      minlength:
        'El nombre de usuario o el correo debe tener al menos 6 caracteres.',
      maxlength:
        'El nombre de usuario o el correo no debe tener más de 255 caracteres.'
    },
  },
  password: {
    type: 'password',
    label: 'Contraseña',
    validators: [ Validators.required, Validators.minLength(8), Validators.maxLength(30) ],
    validationErrors: {
      'required': 'La contraseña es requerida',
      'minlength': 'La contraseña debe tener al menos 6 caracteres.',
      'maxlength': 'La contraseña no debe tener más de 100 caracteres.'
    },
  },
  twoFactorCode: {
    type: 'text', label: 'Código',
    validationErrors: {
      required: 'El código de autenticación es requerido.',
      minlength:
        'El código de autenticación debe tener al menos 6 caracteres.',
      maxlength:
        'El código de autenticación no debe tener más de 6 caracteres.'
    },
  },
} as FormInfo<Login>;

export class LoginForm extends FormGroup2<Login> {
  constructor() {
    super(Login, new Login(), loginInfo);
  }
}
