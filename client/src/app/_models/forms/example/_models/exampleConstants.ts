import { Ranges } from 'src/app/_models/base/ranges';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { Address } from 'src/app/_models/forms/example/_models/address';
import { Person } from 'src/app/_models/forms/example/_models/person';
import { Photo } from 'src/app/_models/forms/example/_models/photo';

export const passwordComplexRegex: string = "(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*";

export const activeOption: SelectOption = new SelectOption({ name: 'Activo', code: 'A' });
export const inactiveOption: SelectOption = new SelectOption({ name: 'Inactivo', code: 'I' });

export const activeOptions = [activeOption, inactiveOption];

export const permissionOptions = [
  new SelectOption({ id: 1, code: 'read', name: 'Leer' }),
  new SelectOption({ id: 2, code: 'write', name: 'Escribir' }),
  new SelectOption({ id: 3, code: 'delete', name: 'Eliminar' }),
  new SelectOption({ id: 4, code: 'update', name: 'Actualizar' }),
  new SelectOption({ id: 5, code: 'create', name: 'Crear' }),
  new SelectOption({ id: 6, code: 'list', name: 'Listar' }),
  new SelectOption({ id: 7, code: 'search', name: 'Buscar' }),
  new SelectOption({ id: 8, code: 'filter', name: 'Filtrar' }),
];

export const typeOptions = [
  new SelectOption({ id: 1, code: 'admin', name: 'Administrador' }),
  new SelectOption({ id: 2, code: 'user', name: 'Usuario' }),
  new SelectOption({ id: 3, code: 'guest', name: 'Invitado' }),
  new SelectOption({ id: 4, code: 'super', name: 'Super' }),
  new SelectOption({ id: 5, code: 'mega', name: 'Mega' }),
];

export const ramiro = new Person({
  name: 'Ramiro',
  age: 24,
  email: 'redacted+022@example.invalid',
  dateOfBirth: new Date(2000, 4, 2),
  type: new SelectOption({ code: 'admin', name: 'Administrador', id: 1 }),
  yearRange: new Ranges({ min: 18, max: 100 }),
  photo: new Photo({
    caption: 'Foto de Ramiro',
    url: 'https://www.google.com',
  }),
  permissions: [permissionOptions[0], permissionOptions[1]],
  addresses: [
    new Address({
      city: 'San Pedro Garza García',
      street: 'La Gloria',
      state: 'Nuevo León',
      zip: '66247',
    }),
    new Address({
      city: 'Monterrey',
      street: 'Anillo Periférico',
      state: 'Nuevo León',
      zip: '64637',
    }),
  ],
});
