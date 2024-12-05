import { CommonModule } from "@angular/common";
import { Component, model, signal, effect } from "@angular/core";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormUse } from "src/app/_models/forms/formTypes";
import { getFormHeaderText } from "src/app/_models/forms/formUtils";

@Component({
  selector: 'h4[formHeader]',
  template: `{{ text() }}`,
  standalone: true,
  imports: [CommonModule,],
})
export class FormHeaderComponent {
  dictionary = model.required<NamingSubject>();
  use = model.required<FormUse>();
  id = model.required<number | null>();
  title = model<string>();

  text = signal<string>('');

  constructor() {
    effect(() => {
      this.text.set(getFormHeaderText(
        this.dictionary(),
        this.use(),
        this.id(),
        this.title(),
      ));
    });
  }
}
