import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlCheckListComponent } from 'src/app/_forms/control-check-list.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ZipcodeAddressOption } from 'src/app/_models/billingDetails';
import { PaymentMethodType } from 'src/app/_models/paymentMethodType';
import { Specialty } from 'src/app/_models/specialty';
import { AccountService } from 'src/app/_services/account.service';
import { AddressesService } from 'src/app/_services/addresses.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [ReactiveFormsModule, InputControlComponent, ControlSelectComponent, ControlCheckListComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent {
  public controlContainer = inject(ControlContainer);
  private utilsService = inject(UtilsService);
  private accountService = inject(AccountService);
  private addressesService = inject(AddressesService);

  submitted = input.required<boolean>();
  myForm!: FormGroup;
  states: string[] = this.utilsService.states;
  get citiesList() {
    const selectedState = this.myForm.get('State')?.value;
    if (!selectedState) return [];
    return this.utilsService.cities(selectedState);
  }

  specialties: Specialty[] = [];
  paymentMethodTypes: PaymentMethodType[] = [];
  neighborhoods: ZipcodeAddressOption[] = [];
  
  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;

    this.accountService.getFormFields().subscribe({
      next: (response) => {
        this.specialties = response.specialties;
        this.paymentMethodTypes = response.paymentMethodTypes;
      }
    })
  }

  unselectCity() {
    this.myForm.get('City')?.setValue('');
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.myForm.get('file')?.setValue(event.target.files[0]);
    }
  }

  enterZipcode(event: any) {
    const zipcode = event.target.value;
    if (zipcode.length === 5) {
      this.searchZipcodes(zipcode);
    } else if (zipcode.length < 5) {
      this.neighborhoods = [];
    } else {
      event.target.value = zipcode.slice(0, 5);
    }
  }

  searchZipcodes(zipcode: string) {
    this.addressesService.getAddressesByZipcode(zipcode).subscribe(addresses => {
      this.neighborhoods = addresses.map((address: ZipcodeAddressOption) => {
        return {
          ...address,
          value: address.neighborhood,
          name: address.neighborhood
        }
      });
    });
  }

  onNeighborhoodChange(event: any) {
    const neighborhood = event.target.value;
    const selectedNeighborhood = this.neighborhoods.find(n => n.neighborhood === neighborhood);
    if (selectedNeighborhood) {
      this.myForm.get('City')?.setValue(selectedNeighborhood.city);
      this.myForm.get('State')?.setValue(selectedNeighborhood.state);
    }
  }

  showRequireAnticipatedCardPaymentsField() {
    if (this.myForm.get('AcceptedPaymentMethods') === null) return false;
    const paymentMethods = this.myForm.get('AcceptedPaymentMethods')!.value as string;
    return paymentMethods.split(',').includes('1') || paymentMethods.split(',').includes('2');
  }

  setValueAnticipatedCardPayments(e: any) {
    if (e.target.checked) {
      this.myForm.get('RequireAnticipatedCardPayments')?.setValue(true);
    } else {
      this.myForm.get('RequireAnticipatedCardPayments')?.setValue(false);
    }
  }
}
