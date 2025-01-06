import { DecimalPipe } from "@angular/common";
import { Component, model } from "@angular/core";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormUse } from "src/app/_models/forms/formTypes";


@Component({
  selector: 'h4[formHeader2]',
  templateUrl: './form-header-2.component.html',
  standalone: true,
  imports: [DecimalPipe],
})
export class FormHeader2Component {
  dictionary = model.required<NamingSubject>();
  use = model.required<FormUse>();
  id = model.required<number | null>();
}
