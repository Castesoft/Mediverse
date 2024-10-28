import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectOption } from "src/app/_forms/form";
import { AccountService } from "src/app/_services/account.service";

@Component({
  host: { class: 'col-xl-6', },
  selector: 'div[insuranceCompanySwitch]',
  templateUrl: './insurance-company-switch.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ],
})
export class InsuranceCompanySwitchComponent {
  service = inject(AccountService);

  item = model.required<SelectOption>();

  constructor() {
    effect(() => {

    });
  }

  onChange(event: boolean) {
    console.log(this.item().id, event);

    this.service.toggleDoctorInsurance(this.item().id, event).subscribe();
  }

}
