import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  opened: boolean = true;

  label: string = 'Expansión de menú lateral';
  subject: string = 'is-sidebar-expanded';
  inputId: string = `${this.subject}Switch`;
  sliderHelp: string = `${this.subject}Help`;
  helpText: string = 'Expansión de menú lateral';

  constructor() {
    this.init();
  }

  init(): void {
    const mode: boolean = this.getLocalStorage();
    this.setLocalStorage(mode);
    this.opened = mode;
  }

  set(value: boolean): void {
    this.setLocalStorage(value);
    this.opened = value;
  }

  toggle(): void {
    this.set(!this.opened);
  }

  private existsInLocalStorage(): boolean {
    const mode: string | null = localStorage.getItem(this.subject);
    return mode !== null;
  }

  private getLocalStorage(): boolean {
    if (this.existsInLocalStorage()) {
      const mode: string | null = localStorage.getItem(this.subject);
      return mode === 'true';
    }
    return false;
  }

  private setLocalStorage(value: boolean): void {
    localStorage.setItem(this.subject, value.toString());
  }
}
