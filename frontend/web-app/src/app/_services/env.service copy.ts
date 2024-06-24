import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  private mode = new BehaviorSubject<boolean>(true);
  mode$ = this.mode.asObservable();


  label = 'Modo desarrollo';
  subject = 'envMode';
  inputId = `${this.subject}Switch`;
  sliderHelp = `${this.subject}Help`;
  helpText = 'Cuando este modo está activado, se activa el modo de desarrollo. En este modo se activan las herramientas de desarrollo y se desactivan las herramientas de producción.';

  constructor() {
    this.init();
  }

  init() {
    const mode = this.getLocalStorage();
    this.setLocalStorage(mode);
    this.mode.next(mode);
  }

  get = (): boolean => this.mode.value;
  set(value: boolean) {
    this.setLocalStorage(value);
    this.mode.next(value);
  }

  toggle() {
    this.setLocalStorage(!this.mode.value);
    this.mode.next(!this.mode.value);
  }

  private existsInLocalStorage = () => {
    const mode = localStorage.getItem(this.subject);
    return mode !== null;
  }

  private getLocalStorage = () => {
    if (this.existsInLocalStorage()) {
      const mode = localStorage.getItem(this.subject);
      return mode === 'true';
    }
    return false;
  }

  private setLocalStorage = (value: boolean): void => {
    localStorage.setItem(this.subject, value.toString());
  }
}
