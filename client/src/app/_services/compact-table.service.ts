import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompactTableService {
  isCompact = signal<boolean>(true);

  label = 'Tabla compacta';
  subject = 'is-table-compact';
  inputId = `${this.subject}Switch`;
  sliderHelp = `${this.subject}Help`;
  helpText = 'Cuando este modo está activado, se activa el modo de tabla compacta. En este modo se activa la tabla compacta y se desactiva la tabla normal.';

  constructor() {
    this.init();
  }

  init() {
    const mode = this.getLocalStorage();
    this.setLocalStorage(mode);
    this.isCompact.set(mode);
  }

  get = (): boolean => this.isCompact();
  set(value: boolean) {
    this.setLocalStorage(value);
    this.isCompact.set(value);
  }

  toggle() {
    this.setLocalStorage(!this.isCompact());
    this.isCompact.set(!this.isCompact());
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
