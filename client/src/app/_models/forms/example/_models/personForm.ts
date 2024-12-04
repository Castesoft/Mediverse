import { Validators } from '@angular/forms';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { Address } from 'src/app/_models/forms/example/_models/address';
import { Person } from 'src/app/_models/forms/example/_models/person';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { ControlErrors, FormInfo } from 'src/app/_models/forms/formTypes';
import { transform } from 'src/app/_models/base/paramUtils';
import {
  ramiro,
  permissionOptions,
  typeOptions,
  passwordComplexRegex,
} from 'src/app/_models/forms/example/_models/exampleConstants';
import { matchValues } from 'src/app/_models/forms/formUtils';

export const personInfo: FormInfo<Person> = {
  id: { label: 'ID', type: 'number' },
  isActive: { label: 'Activo', type: 'checkbox' },
  age: {
    label: 'Edad',
    placeholder: 'Escribe tu edad',
    type: 'number',
    hint: 'Escribe tu edad',
    validators: [Validators.min(18), Validators.max(100), Validators.required],
    suffix: 'años',
    appearance: 'outline',
  },
  name: {
    label: 'Nombre',
    placeholder: 'Nombre',
    type: 'text',
    hint: 'Escribe tu nombre completo',
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ],
  },
  type: {
    label: 'Tipo',
    type: 'select',
    selectOptions: [
      new SelectOption({ id: 1, code: 'admin', name: 'Administrador' }),
      new SelectOption({ id: 2, code: 'user', name: 'Usuario' }),
      new SelectOption({ id: 3, code: 'guest', name: 'Invitado' }),
    ],
    validators: [Validators.required],
  },
  permissions: { label: 'Permisos', type: 'multiselect' },
  dateOfBirth: {
    label: 'Fecha de nacimiento',
    type: 'date',
    placeholder: 'Fecha de nacimiento',
    hint: 'Escribe tu fecha de nacimiento',
    validators: [Validators.required],
  },
  photo: {
    url: {
      label: 'URL',
      placeholder: 'URL',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(500)],
    },
    caption: {
      label: 'Descripción',
      placeholder: 'Descripción',
      type: 'text',
      validators: [Validators.maxLength(500)],
    },
  },
  addresses: {
    photo: {
      caption: {
        label: 'Descripción',
        placeholder: 'Descripción',
        type: 'text',
        validators: [Validators.maxLength(500)],
      },
      url: {
        label: 'URL',
        placeholder: 'URL',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(500)],
      },
    },
    street: {
      label: 'Calle',
      placeholder: 'Calle',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(500)],
    },
    city: {
      label: 'Ciudad',
      placeholder: 'Ciudad',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(500)],
    },
    state: {
      label: 'Estado',
      placeholder: 'Estado',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(500)],
    },
    zip: {
      label: 'Código postal',
      placeholder: 'Código postal',
      type: 'text',
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ],
    },
  },
  description: {
    label: 'Descripción',
    type: 'textarea',
    validators: [Validators.minLength(50), Validators.maxLength(500)],
  },
  email: {
    label: 'Correo electrónico',
    type: 'email',
    validators: [
      Validators.required,
      Validators.email,
      Validators.maxLength(500),
    ],
  },
  password: {
    label: 'Contraseña',
    type: 'password',
    validators: [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(passwordComplexRegex),
    ],
    hint: 'Tu contraseña debe tener entre 8 y 30 caracteres de longitud, contener letras y números, y debe incluir al menos un carácter especial. No debe contener espacios ni emojis.',
    validationErrors: {
      'required': 'Su contraseña nueva es un campo requerido.',
      'minlength': 'Su contraseña debe tener un mínimo de 8 caracteres.',
      'maxlength': 'Su contraseña debe tener un máximo de 30 caracteres.',
      'pattern': 'Su contraseña no es lo suficientemente compleja.',
    } as ControlErrors,
  },
  passwordConfirm: {
    label: 'Confirmar contraseña',
    type: 'password',
    validators: [Validators.required, matchValues('password')],
    validationErrors: {
      'required': 'Su contraseña de confirmación es un campo requerido.',
      'notMatching': 'Su contraseña y su contraseña repetida deben ser iguales.'
    } as ControlErrors,
  },
} as FormInfo<Person>;

const person = ramiro;

/**
 * Represents a form group for a person, extending the `FormGroup2` class with a generic type of `Person`.
 * This form group includes controls for various person-related fields such as name, date of birth, age, and addresses.
 * It also sets up validation rules and default values for these controls.
 */
export class PersonForm extends FormGroup2<Person> {
  readonly person = person;
  readonly typeOptions = typeOptions;
  readonly permissionOptions = permissionOptions;

  constructor() {
    super(Person, new Person(), personInfo);

    this.controls.password.valueChanges.subscribe({
      next: (value) => {
        this.controls.passwordConfirm.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
      },
    });

    this.controls.type.selectOptions = this.typeOptions;
    this.controls.permissions.selectOptions = this.permissionOptions;
    this.controls.description.type = 'textarea';

    this.patchValue(this.person as any);

    const value = transform(this.value);

    this.controls.addresses.controls.push(
      new FormGroup2(Address, this.person.addresses[0], personInfo.addresses)
    );
  }
}
