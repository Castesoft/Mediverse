import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaddingService {
  withPadding = signal<boolean>(true);

  constructor() {
    
  }

  get = (): boolean => this.withPadding();
  set(value: boolean) {
    this.withPadding.set(value);
  }

  toggle() {
    this.withPadding.set(!this.withPadding());
  }

}
