import { Component, HostBinding, effect, model } from "@angular/core";
import { FormGroup2 } from "src/app/_forms/form2";

@Component({
  host: { class: 'form-text', },
  selector: 'div[groupHelpBlock]',
  template: `@if(group().helperText) { {{ group().helperText }} }`,
  standalone: true,
})
export class GroupHelpBlockComponent {
  group = model.required<FormGroup2<any>>();

  constructor() {
    effect(() => {

    })
  }

  @HostBinding('id') get id() {
    return this.group().id + '-help';
  }

}
