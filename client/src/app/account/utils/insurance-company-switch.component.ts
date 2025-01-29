import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectOption } from "src/app/_models/base/selectOption";
import { AccountService } from "src/app/_services/account.service";

@Component({
  host: { class: 'col-xl-6', },
  selector: 'div[insuranceCompanySwitch]',
  templateUrl: './insurance-company-switch.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ],
})
export class InsuranceCompanySwitchComponent {
  service: AccountService = inject(AccountService);

  item: ModelSignal<SelectOption> = model.required<SelectOption>();

  onChange(event: boolean) {
    this.service.toggleDoctorInsurance(this.item().id, event).subscribe();
  }
}
