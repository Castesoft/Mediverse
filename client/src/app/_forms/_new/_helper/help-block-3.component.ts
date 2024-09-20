import { Component, HostBinding, OnInit, effect, input, model } from "@angular/core";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2 } from "src/app/_forms/form2";
import { DateRange } from "src/app/_models/types";

@Component({
  host: { class: 'form-text', },
  selector: 'div[helpBlock3]',
  template: `@if(control().helperText) { {{ control().helperText }} }`,
  standalone: true,
})
export class HelpBlock3Component {
  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();

  constructor() {
    effect(() => {

    })
  }

  @HostBinding('id') get id() {
    return this.control().id + '-help';
  }

}
