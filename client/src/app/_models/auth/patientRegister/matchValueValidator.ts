import { AbstractControl, ValidatorFn } from '@angular/forms';

export default function matchValueValidator(formControlName: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.parent || !control) {
      return null;
    }

    const formControl: AbstractControl<any, any> | null = control.parent.get(formControlName);

    if (formControl === null) return null;

    return formControl.value === control.value ? null : { isMatching: true };
  };

}
