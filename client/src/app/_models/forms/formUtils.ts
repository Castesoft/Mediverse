import { DecimalPipe } from "@angular/common";
import { ValidatorFn, AbstractControl } from "@angular/forms";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormUse } from "src/app/_models/forms/formTypes";

/**
 * Checks if the given value is an instance of File.
 *
 * @param value - The value to check.
 * @returns True if the value is a File, otherwise false.
 */
export function isFile(value: any): value is File {
  return value instanceof File;
}

export function matchValues(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
  }
}

export function getFormHeaderText(
  dictionary: NamingSubject,
  use: FormUse,
  id: number | null,
  title?: string
): string {
  const decimalPipe = new DecimalPipe('es-MX');

  let stringToReturn = '';

  if (title !== undefined) {
    stringToReturn = title;
  } else if (title === undefined) {
    switch (use) {
      case 'create':
        stringToReturn = `Crear ${dictionary.singular}`;
        break;
      case 'edit':
        if (id === null) {
          throw new Error('FormHeaderComponent: id is required for edit mode');
        } else if (id !== null) {
          stringToReturn = `Editar ${dictionary.singular} #${decimalPipe.transform(id)}`;
        }
        break;
      case 'detail':
        if (id === null) {
          throw new Error('FormHeaderComponent: id is required for detail mode');
        } else if (id !== null) {
          stringToReturn = `${dictionary.singularTitlecase} #${decimalPipe.transform(id)}`;
        }
        break;
    }
  }

  return stringToReturn;
}
