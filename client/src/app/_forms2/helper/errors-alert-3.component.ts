import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef
} from '@angular/core';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  host: { role: 'alert', },
  selector: 'div[errorsAlert3]',
  templateUrl: './errors-alert-3.component.html',
  imports: [ CommonModule, CdkModule, MaterialModule, FaIconComponent, ],
})
export class ErrorsAlert3Component {
  readonly icons: IconsService = inject(IconsService);

  error: ModelSignal<BadRequest> = model.required();
  addMargin: InputSignal<boolean> = input(true);

  onClose: OutputEmitterRef<void> = output();

  class: string = 'alert alert-dismissible bg-light-danger border border-danger d-flex flex-row align-items-start justify-content-between w-100 p-5';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.addMargin()) {
        this.class.replace(' mb-0', '');
        this.class += ' mb-10';
      } else {
        this.class.replace(' mb-10', '');
        this.class += ' mb-0';
      }
    });
  }
}
