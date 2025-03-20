import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { InputControlComponent } from "src/app/_forms/input-control.component";
import { ControlSelectComponent } from "src/app/_forms/control-select.component";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ZipcodeAddressOption } from "src/app/_models/billingDetails";
import { AddressesService } from "src/app/addresses/addresses.config";

@Component({
  selector: 'div[addressForm]',
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  imports: [
    InputControlComponent,
    ControlSelectComponent,
    ReactiveFormsModule
  ],
})
export class AddressFormComponent {
  private readonly addressesService: AddressesService = inject(AddressesService);

  formGroup: InputSignal<FormGroup> = input.required();
  solicitName: InputSignal<boolean> = input(false);
  solid: InputSignal<boolean> = input(false);

  zipcodeInput: OutputEmitterRef<any> = output();
  neighborhoodChange: OutputEmitterRef<any> = output();

  neighborhoods: ZipcodeAddressOption[] = [];

  enterZipcode(event: any) {
    const zipcode: any = event.target.value;
    if (zipcode.length === 5) {
      this.searchZipcodes(zipcode);
    } else if (zipcode.length < 5) {
      this.neighborhoods = [];
    } else {
      event.target.value = zipcode.slice(0, 5);
    }
  }

  searchZipcodes(zipcode: string) {
    this.addressesService.getAddressesByZipcode(zipcode).subscribe((addresses: ZipcodeAddressOption[]) => {
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
    const input = event.target as HTMLInputElement;
    const neighborhoodValue: string = input.value;
    const selectedNeighborhood: ZipcodeAddressOption | undefined = this.neighborhoods.find(
      (n: ZipcodeAddressOption) => n.neighborhood === neighborhoodValue
    );

    if (selectedNeighborhood) {
      this.formGroup().get('City')?.setValue(selectedNeighborhood.city);
      this.formGroup().get('State')?.setValue(selectedNeighborhood.state);
    }
  }
}
