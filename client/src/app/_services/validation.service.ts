import { Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  active = signal<boolean>(true);

  label = "Validación de formularios";
  subject = 'is-validation-active';
  inputId = `${this.subject}Switch`;
  sliderHelp = `${this.subject}Help`;
  helpText = "Cuando este modo está activado, los validadores en lado del cliente también están activados. Tiene este el propósito al ser desactivado, de probar la validación en el lado del servidor. En producción este modo debe estar activado y es el default.";

  constructor() {
    this.init();
  }

  init() {
    const mode = this.getLocalStorage();
    this.setLocalStorage(mode);
    this.active.set(mode);
  }

  set(value: boolean) {
    this.setLocalStorage(value);
    this.active.set(value);
  }

  toggle() {
    this.set(!this.active());
  }

  private existsInLocalStorage() {
    const mode = localStorage.getItem(this.subject);
    return mode !== null;
  }

  private getLocalStorage() {
    if (this.existsInLocalStorage()) {
      const mode = localStorage.getItem(this.subject);
      return mode === 'true';
    }
    return false;
  }

  private setLocalStorage(value: boolean) {
    localStorage.setItem(this.subject, value.toString());
  }

  /**
   * Determines if a FormControl is considered optional.
   *
   * This method checks if a FormControl has validators assigned to it. If it does,
   * it further checks if the 'required' validator is not present among those validators.
   * The FormControl is considered optional if it either has no validators or does not
   * have the 'required' validator.
   *
   * @param {FormControl} control - The FormControl instance to check.
   * @param {boolean} hide - A flag to hide the optional span.
   * @returns {boolean} - Returns `true` if the FormControl is optional (i.e., it does not
   * have the 'required' validator or has no validators at all), otherwise returns `false`.
   */
  isOptional(control: AbstractControl<any, any> | FormControl, hide: boolean = false): boolean {
    if (hide) return false;

    if (control.validator) {
      const validatorResponse = control.validator({} as FormControl);
      return !(validatorResponse && validatorResponse["required"]);
    }

    return true;
  };
}
