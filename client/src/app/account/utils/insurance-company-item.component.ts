import { CommonModule } from "@angular/common";
import { Component, inject, model } from "@angular/core";
import { FormUse } from "src/app/_models/forms/formTypes";
import { UserMedicalInsuranceCompany } from "src/app/_models/users/userMedicalInsuranceCompany/userMedicalInsuranceCompany";
import { AccountService } from "src/app/_services/account.service";

@Component({
  host: { class: 'col-xl-6', },
  selector: 'div[insuranceCompanyItem]',
  templateUrl: './insurance-company-item.component.html',
  styleUrl: './insurance-company-item.component.scss',
  standalone: true,
  imports: [ CommonModule, ],
})
export class InsuranceCompanyItemComponent {
  service = inject(AccountService);

  item = model.required<UserMedicalInsuranceCompany | null>();
  use = model.required<FormUse>();

  constructor() {}

  protected readonly FormUse = FormUse;
}
