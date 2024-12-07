import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal, effect } from "@angular/core";
import { Account } from "src/app/_models/account/account";
import { SelectOption } from "src/app/_models/base/selectOption";
import { AccountService } from "src/app/_services/account.service";
import { InsuranceCompanyItemComponent } from "src/app/account/utils/insurance-company-item.component";
import { InsuranceCompanySwitchComponent } from "src/app/account/utils/insurance-company-switch.component";
import { MedicalInsuranceCompaniesService } from "src/app/medicalInsuranceCompanies/medicalInsuranceCompanies.config";

@Component({
  selector: 'app-account-insurances',
  standalone: true,
  imports: [ InsuranceCompanyItemComponent, CommonModule, InsuranceCompanySwitchComponent, ],
  templateUrl: './account-insurances.component.html',
  styleUrl: './account-insurances.component.scss'
})
export class AccountInsurancesComponent implements OnInit {
  service = inject(AccountService);
  private medicalInsuranceCompanies = inject(MedicalInsuranceCompaniesService);

  medicalInsuranceCompanyOptions = signal<SelectOption[]>([]);
  account = signal<Account | null>(null);

  constructor() {
    this.medicalInsuranceCompanies.getOptions().subscribe();

    effect(() => {
      this.account.set(this.service.current());

      const doctorInsurances = this.account()!.doctorInsuranceCompanies;
      const medicalInsuranceCompanyOptions = this.medicalInsuranceCompanies.options();

      const filteredOptions = medicalInsuranceCompanyOptions.map(option => {
        return new SelectOption({
          ...option,
          enabled: doctorInsurances.some((insurance: any) => insurance.id === option.id)
        })
      });

      this.medicalInsuranceCompanyOptions.set(filteredOptions);

    });
  }

  ngOnInit(): void {

  }

  toggleDoctorMedicalInsuranceCompany(e: any, insuranceId: number) {
    this.service.toggleDoctorInsurance(insuranceId, e.target.checked).subscribe();
  }

  doctorContainsCompany(insuranceCompany: any) {
    // if (!this.service.doctorMedicalInsuranceCompanies()) {
    //   return false;
    // }

    // return this.service.doctorMedicalInsuranceCompanies()!.some((company: any) => company.id === insuranceCompany.id);
  }
}
