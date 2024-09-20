import { SelectOption } from "src/app/_forms/form";
import { FormInfo } from "src/app/_forms/form2";

export class Person {
  name: string = '';
  type = new SelectOption();
  age: number = 0;
  dateOfBirth: Date = new Date();
  photo: Photo = new Photo();
  addresses: Address[] = [];

  constructor(init?: Partial<Person>) {
    Object.assign(this, init);
  }
}

export class Photo {
  url: string = '';
  caption: string = '';

  constructor(init?: Partial<Photo>) {
    Object.assign(this, init);
  }
}

export class Address {
  street: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';

  photo: Photo = new Photo();

  constructor(init?: Partial<Address>) {
    Object.assign(this, init);
  }
}

export const personInfo: FormInfo<Person> = {
  age: { label: 'Edad', placeholder: 'Edad', type: 'number', helperText: 'Escribe tu edad', },
  name: { label: 'Nombre', placeholder: 'Nombre', type: 'text', helperText: 'Escribe tu nombre completo' },
  type: { label: 'Tipo', type: 'select', selectOptions: [
    new SelectOption({ id: 1, code: 'admin', name: 'Administrador' }),
    new SelectOption({ id: 2, code: 'user', name: 'Usuario' }),
    new SelectOption({ id: 3, code: 'guest', name: 'Invitado' }),
  ]},
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date', placeholder: 'Fecha de nacimiento', helperText: 'Escribe tu fecha de nacimiento' },
  photo: {
    url: { label: 'URL', placeholder: 'URL', type: 'text' },
    caption: { label: 'Descripción', placeholder: 'Descripción', type: 'text' }
  },
  addresses: {
    photo: {
      caption: { label: 'Descripción', placeholder: 'Descripción', type: 'text' },
      url: { label: 'URL', placeholder: 'URL', type: 'text' },
    },
    street: { label: 'Calle', placeholder: 'Calle', type: 'text' },
    city: { label: 'Ciudad', placeholder: 'Ciudad', type: 'text' },
    state: { label: 'Estado', placeholder: 'Estado', type: 'text' },
    zip: { label: 'Código postal', placeholder: 'Código postal', type: 'text' },
  }
};
