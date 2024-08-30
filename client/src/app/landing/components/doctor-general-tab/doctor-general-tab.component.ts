import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';

@Component({
  selector: 'app-doctor-general-tab',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './doctor-general-tab.component.html',
})
export class DoctorGeneralTabComponent {
  doctor = input<DoctorSearchResult>();
  showAllServices = signal(false);

  visibleServices = computed(() => {
    if (this.showAllServices()) {
      return this.doctor()?.services || [];
    }
    return (this.doctor()?.services || []).slice(0, 5);
  });

  toggleServices() {
    this.showAllServices.update(value => !value);
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
