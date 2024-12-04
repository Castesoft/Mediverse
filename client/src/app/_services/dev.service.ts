import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevService {
  isDev = signal<boolean>(true);

  label = 'Modo desarrollo';
  subject = 'is-dev-mode';
  inputId = `${this.subject}Switch`;
  sliderHelp = `${this.subject}Help`;
  helpText = 'Cuando este modo está activado, se activa el modo de desarrollo. En este modo se activan las herramientas de desarrollo y se desactivan las herramientas de producción.';

  constructor() {
    this.init();
  }

  init() {
    const mode = this.getLocalStorage();
    this.setLocalStorage(mode);
    this.isDev.set(mode);
  }

  set(value: boolean) {
    this.setLocalStorage(value);
    this.isDev.set(value);
  }

  toggle() {
    this.set(!this.isDev());
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
}
