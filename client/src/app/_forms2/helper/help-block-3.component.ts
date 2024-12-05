import { Component, HostBinding, OnInit, effect, input, model } from "@angular/core";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { DateRange } from "src/app/_models/base/dateRange";

@Component({
  host: { class: 'form-text', },
  selector: 'div[helpBlock3]',
  template: `@if(control().hint !== null) { {{ control().hint }} }`,
  standalone: true,
})
export class HelpBlock3Component {
  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | SelectOption[] | null>>();

  constructor() {
    effect(() => {

    })
  }

  @HostBinding('id') get id() {
    return this.control().id + '-help';
  }

}
