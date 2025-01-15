import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaddingService {
  withPadding: WritableSignal<boolean> = signal<boolean>(true);

  get: () => boolean = (): boolean => this.withPadding();

  set(value: boolean): void {
    this.withPadding.set(value);
  }

  toggle(): void {
    this.withPadding.set(!this.withPadding());
  }
}
