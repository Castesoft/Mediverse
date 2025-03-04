import { Component, effect, HostBinding, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { IconsService } from "src/app/_services/icons.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgClass } from "@angular/common";

@Component({
  host: { role: 'alert' },
  selector: 'div[alert]',
  templateUrl: './alert.component.html',
  imports: [ FaIconComponent, NgClass ]
})
export class AlertComponent {
  readonly icons: IconsService = inject(IconsService);

  title: InputSignal<string> = input.required();
  message: InputSignal<string> = input.required();
  addMargin: InputSignal<boolean> = input(true);
  type: InputSignal<'info' | 'danger' | 'success'> = input('info' as any);

  onClose: OutputEmitterRef<void> = output();

  private baseClass: string = 'alert alert-dismissible d-flex flex-row align-items-start justify-content-between w-100 p-5';

  @HostBinding('class') hostClass: string = '';

  constructor() {
    effect(() => {
      const marginClass: 'mb-10' | 'mb-0' = this.addMargin() ? 'mb-10' : 'mb-0';
      const colorSuffix: 'info' | 'danger' | 'success' = this.type();
      this.hostClass = `${this.baseClass} ${marginClass} bg-light-${colorSuffix} border-${colorSuffix}`;
    });
  }
}
