import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { UserAddress, ZipcodeAddressOption } from 'src/app/_models/billingDetails';
import { AccountService } from 'src/app/_services/account.service';
import { AddressesService } from 'src/app/_services/addresses.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';

@Component({
  selector: 'app-address-modal',
  standalone: true,
  imports: [ModalWrapperModule, InputControlComponent, ReactiveFormsModule, ControlSelectComponent],
  templateUrl: './address-modal.component.html',
  styleUrl: './address-modal.component.scss'
})
export class AddressModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private addressesService = inject(AddressesService);

  bsModalRef = inject(BsModalRef);
  title?: string;
  type: 'add' | 'edit' = 'add';
  address: UserAddress | null = null;
  disableSelectIsBilling = false;

  submitted = false;
  isLoading = false;
  addressForm = this.fb.group({
    Zipcode                 : [ '', [Validators.required] ],
    Neighborhood            : [ '', [Validators.required] ],
    City                    : [ '', [Validators.required] ],
    State                   : [ '', [Validators.required] ],
    Street                  : [ '', [Validators.required] ],
    ExteriorNumber          : [ '', [Validators.required] ],
    InteriorNumber          : [ '' ],
    Country                 : [ 'México', [Validators.required] ],
    IsBilling               : [ false ],
    IsMain                  : [ false ]
  });
  neighborhoods: any[] = [];

  ngOnInit() {
    if (this.type === 'edit' && this.address) {
      this.addressForm.get('Zipcode')?.setValue(this.address.zipcode);
      this.addressForm.get('Neighborhood')?.setValue(this.address.neighborhood);
      this.addressForm.get('State')?.setValue(this.address.state);
      this.addressForm.get('City')?.setValue(this.address.city);
      this.addressForm.get('Street')?.setValue(this.address.street);
      this.addressForm.get('ExteriorNumber')?.setValue(this.address.exteriorNumber);
      this.addressForm.get('InteriorNumber')?.setValue(this.address.interiorNumber);
      this.addressForm.get('IsBilling')?.setValue(this.address.isBilling);
      if (this.address.isBilling) {
        this.addressForm.get('IsBilling')?.disable();
      }
      this.searchZipcodes(this.address.zipcode!);
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
      if (this.type === 'edit' && this.address) {
        const selectedNeighborhood = this.neighborhoods.find(n => n.value === this.address!.neighborhood);
        if (selectedNeighborhood) {
          this.addressForm.get('City')?.setValue(selectedNeighborhood.city);
          this.addressForm.get('State')?.setValue(selectedNeighborhood.state);
        }
      }
    });
  }

  onNeighborhoodChange(event: any) {
    const neighborhood = event.target.value;
    const selectedNeighborhood = this.neighborhoods.find(n => n.value === neighborhood);
    if (selectedNeighborhood) {
      this.addressForm.get('City')?.setValue(selectedNeighborhood.city);
      this.addressForm.get('State')?.setValue(selectedNeighborhood.state);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;

    if (!this.addressForm.valid) {
      this.isLoading = false;
      return;
    }

    if (this.type === 'add') {
      this.accountService.addAddress(this.addressForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.submitted = false;
          this.isLoading = false;
        }
      });
    } else {
      if (!this.address) return;
      this.addressForm.get('IsBilling')?.enable();
      this.accountService.updateAddress(this.address.id!, this.addressForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.submitted = false;
          this.isLoading = false;
        }
      });
    }
  }
}
