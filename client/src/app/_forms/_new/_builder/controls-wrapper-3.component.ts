import { Component, effect, HostBinding, model, output, signal } from "@angular/core";
import { FormNewControlsModule } from "src/app/_forms/_new/_controls/form-new-controls.module";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { SelectOptionPair } from "src/app/_models/select-option-pair";

@Component({
  selector: 'div[controlsWrapper3]',
  templateUrl: './controls-wrapper-3.component.html',
  // template: `
  //   <ng-content></ng-content>
  // `,
  standalone: true,
  imports: [ FormNewControlsModule, ],
})
export class ControlsWrapper3Component {
  control = model.required<FormControl2<any>>();

  pair = signal<FormGroup2<SelectOptionPair>>(new FormGroup2<SelectOptionPair>(SelectOptionPair, new SelectOptionPair(), {} as any));
  hasPair = signal<boolean>(false);

  onSelectionChange = output<SelectOption | null>();

  class = 'col d-flex align-items-end';

  @HostBinding('class') get hostClass() {
    if (
      this.control().type === 'radio' &&
      this.control().orientation === 'inline'
    ) {
      this.class = 'col d-flex align-items-center';
      return this.class;
    }

    return this.class;
  }

  constructor() {
    effect(() => {
      const parent = this.control().parent as FormGroup2<any>;

      if (parent.type === 'selectPair') {
        this.pair.set(parent);
        this.hasPair.set(true);
      }

    });
  }
}
