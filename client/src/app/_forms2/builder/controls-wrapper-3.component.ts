import { Component, effect, HostBinding, model, output, signal } from "@angular/core";
import { Forms2ControlsModule } from "src/app/_forms2/controls/forms-2-controls.module";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { SelectOptionPair } from "src/app/_models/base/selectOptionPair";

@Component({
  selector: 'div[controlsWrapper3]',
  templateUrl: './controls-wrapper-3.component.html',
  // template: `
  //   <ng-content></ng-content>
  // `,
  standalone: true,
  imports: [ Forms2ControlsModule, ],
})
export class ControlsWrapper3Component {
  control = model.required<FormControl2<any>>();

  pair = signal<FormGroup2<SelectOptionPair>>(new FormGroup2<SelectOptionPair>(SelectOptionPair, new SelectOptionPair(), {} as any));
  hasPair = signal<boolean>(false);
  fromWrapper = signal<boolean>(true);

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
