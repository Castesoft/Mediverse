import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { UserAddress } from 'src/app/_models/billingDetails';
import { AccountService } from 'src/app/_services/account.service';
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
  private utilsService = inject(UtilsService);
  private accountService = inject(AccountService);

  bsModalRef = inject(BsModalRef);
  title?: string;
  type: 'add' | 'edit' = 'add';
  address: UserAddress | null = null;
  disableSelectIsBilling = false;

  submitted = false;
  addressForm = this.fb.group({
    State                   : [ '', [Validators.required] ],
    City                    : [ '', [Validators.required] ],
    Address                 : [ '', [Validators.required] ],
    ZipCode                 : [ '', [Validators.required] ],
    IsBilling               : [ false ],
    IsMain                  : [ false ]
  });

  states: string[] = this.utilsService.states;
  get citiesList() {
    const selectedState = this.addressForm.get('State')?.value;
    if (!selectedState) return [];
    return this.utilsService.cities(selectedState);
  }
  unselectCity() {
    this.addressForm.get('City')?.setValue('');
  }

  ngOnInit() {
    if (this.type === 'edit' && this.address) {
      this.addressForm.get('State')?.setValue(this.address.state);
      this.addressForm.get('City')?.setValue(this.address.city);
      this.addressForm.get('Address')?.setValue(this.address.street);
      this.addressForm.get('ZipCode')?.setValue(this.address.zipcode);
      this.addressForm.get('IsBilling')?.setValue(this.address.isBilling);
      if (this.address.isBilling) {
        this.addressForm.get('IsBilling')?.disable();
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    if (!this.addressForm.valid) {
      return;
    }

    if (this.type === 'add') {
      this.accountService.addAddress(this.addressForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.submitted = false;
        }
      });
    } else {
      if (!this.address) return;
      this.addressForm.get('IsBilling')?.enable();
      this.accountService.updateAddress(this.address.addressId, this.addressForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.submitted = false;
        }
      });
    }
  }
}
