import { Component, inject, input, OnInit } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  host: { class: 'btn px-3 btn-phoenix-secondary', type: 'submit', '[attr.form]': 'formId' },
  selector: 'submit-btn, button[submitBtn]',
  template: `<fa-icon [icon]="icons.faSearch" class="text-primary"></fa-icon>`,
  standalone: true,
  imports: [ FontAwesomeModule, ],
})
export class SubmitBtnComponent implements OnInit {
  icons = inject(IconsService);

  id = input.required<string>();

  formId = 'pending';

  ngOnInit(): void {
    this.formId = this.id();
  }

}
