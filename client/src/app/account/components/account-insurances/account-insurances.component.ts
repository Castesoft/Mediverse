import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, computed, Signal } from "@angular/core";
import { SelectOption } from "src/app/_models/base/selectOption";
import { AccountService } from "src/app/_services/account.service";
import { InsuranceCompanyItemComponent } from "src/app/account/utils/insurance-company-item.component";
import { InsuranceCompanySwitchComponent } from "src/app/account/utils/insurance-company-switch.component";
import { MedicalInsuranceCompaniesService } from "src/app/medicalInsuranceCompanies/medicalInsuranceCompanies.config";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Account } from "src/app/_models/account/account";

@Component({
  selector: 'app-account-insurances',
  standalone: true,
  imports: [
    InsuranceCompanyItemComponent,
    CommonModule,
    InsuranceCompanySwitchComponent,
  ],
  templateUrl: './account-insurances.component.html',
  styleUrl: './account-insurances.component.scss'
})
export class AccountInsurancesComponent implements OnInit {
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly medicalInsuranceCompanies: MedicalInsuranceCompaniesService = inject(MedicalInsuranceCompaniesService);
  readonly accountsService: AccountService = inject(AccountService);

  account: Signal<Account | null> = computed(() => this.accountsService.current());
  medicalInsuranceOptions: Signal<SelectOption[]> = computed(() => this.medicalInsuranceCompanies.options());

  medicalInsuranceCompanyOptions: Signal<SelectOption[]> = computed(() => {
    const currentAccount: Account | null = this.account();
    const insuranceOptions: SelectOption[] = this.medicalInsuranceOptions();

    if (!currentAccount) return [];

    return insuranceOptions.map((option: SelectOption) =>
      new SelectOption({
        ...option,
        enabled: currentAccount.doctorInsuranceCompanies
          .some((insurance: SelectOption) => insurance.id === option.id)
      })
    );
  });

  ngOnInit(): void {
    this.medicalInsuranceCompanies.getOptions().subscribe({
      error: (err) => console.error('Failed to load insurance options:', err)
    });
  }
}
