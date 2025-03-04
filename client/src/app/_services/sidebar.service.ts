import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  opened = signal<boolean>(true);

  label = 'Expansión de menú lateral';
  subject = 'is-sidebar-expanded';
  inputId = `${this.subject}Switch`;
  sliderHelp = `${this.subject}Help`;
  helpText = 'Expansión de menú lateral';

  constructor() {
    this.init();
  }

  init() {
    const mode = this.getLocalStorage();
    this.setLocalStorage(mode);
    this.opened.set(mode);
  }

  set(value: boolean) {
    this.setLocalStorage(value);
    this.opened.set(value);
  }

  toggle() {
    this.set(!this.opened());
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
