import { CommonModule } from '@angular/common';
import { Component, computed, model, signal } from '@angular/core';
import { DoctorResult } from "src/app/_models/doctorResults/doctorResult";

@Component({
  selector: 'div[doctorGeneralTab]',
  templateUrl: './doctor-general-tab.component.html',
  standalone: true,
  imports: [CommonModule,],
})
export class DoctorGeneralTabComponent {
  doctor = model.required<DoctorResult | null>();
  showAllServices = signal(false);
  showAllInsurances = signal(false);

  visibleServices = computed(() => {
    if (this.showAllServices()) {
      return this.doctor()?.services || [];
    }
    return (this.doctor()?.services || []).slice(0, 5);
  });

  visibleInsurances = computed(() => {
    if (this.showAllInsurances()) {
      return this.doctor()?.medicalInsuranceCompanies || [];
    }
    return (this.doctor()?.medicalInsuranceCompanies || []).slice(0, 5);
  });

  toggleServices() {
    this.showAllServices.update(value => !value);
  }

  toggleInsurances() {
    this.showAllInsurances.update(value => !value);
  }

  getPaymentIcon(methodName: string): string {
    const lowerCaseName = methodName.toLowerCase();
    if (lowerCaseName.includes('tarjeta') || lowerCaseName.includes('credit') || lowerCaseName.includes('debit')) {
      return 'ki-duotone ki-credit-cart';
    } else if (lowerCaseName.includes('efectivo') || lowerCaseName.includes('cash')) {
      return 'ki-duotone ki-dollar';
    } else if (lowerCaseName.includes('transferencia') || lowerCaseName.includes('transfer')) {
      return 'ki-duotone ki-bank';
    } else if (lowerCaseName.includes('paypal')) {
      return 'ki-duotone ki-paypal';
    } else {
      return 'ki-duotone ki-payment';
    }
  }
}
