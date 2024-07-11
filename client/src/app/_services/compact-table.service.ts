import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompactTableService {
  private mode = new BehaviorSubject<boolean>(true);
  mode$ = this.mode.asObservable();


  label = 'Tabla compacta';
  subject = 'compactTableMode';
  inputId = `${this.subject}Switch`;
  sliderHelp = `${this.subject}Help`;
  helpText = 'Cuando este modo está activado, se activa el modo de tabla compacta. En este modo se activa la tabla compacta y se desactiva la tabla normal.';

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
