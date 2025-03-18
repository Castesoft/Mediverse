import { CommonModule } from "@angular/common";
import { Component, inject, model } from "@angular/core";
import { FormUse } from "src/app/_models/forms/formTypes";
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { AccountService } from "src/app/_services/account.service";

@Component({
  host: { class: 'col-xl-6', },
  selector: 'div[medicalLicenseItem]',
  templateUrl: './medical-license-item.component.html',
  styleUrl: './medical-license-item.component.scss',
  standalone: true,
  imports: [ CommonModule, ],
})
export class MedicalLicenseItemComponent {
  service = inject(AccountService);

  item = model.required<MedicalLicense | null>();
  use = model.required<FormUse>();

  constructor() {}

  protected readonly FormUse = FormUse;
}
