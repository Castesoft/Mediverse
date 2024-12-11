import { Component, model } from "@angular/core";
import { NamingSubject } from "src/app/_models/base/namingSubject";


@Component({
  host: { class: 'btn btn-primary', type: 'button', },
  selector: 'button[createBtn]',
  template: `<i class="ki-duotone ki-plus fs-2"></i>Agregar {{naming().singular}}`,
  standalone: true,
  imports: [],
})
export class CreateBtnComponent {
  naming = model.required<NamingSubject>();
}
