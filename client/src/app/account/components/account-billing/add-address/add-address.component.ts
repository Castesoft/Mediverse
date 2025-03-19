import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { UtilsService } from 'src/app/_services/utils.service';
import { AddressesService } from "src/app/addresses/addresses.config";
import { ToastrService } from "ngx-toastr";
import { Address } from "src/app/_models/addresses/address";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AddressFormComponent } from "src/app/addresses/address-form/address-form.component";

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: [ './add-address.component.scss' ],
  imports: [
    ReactiveFormsModule,
    AddressFormComponent
  ]
})
export class AddAddressComponent implements OnInit {
  private readonly addressesService: AddressesService = inject(AddressesService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly utilsService: UtilsService = inject(UtilsService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  readonly bsModalRef: BsModalRef = inject(BsModalRef);

  addressForm!: FormGroup;
  submitted: boolean = false;
  reloadAddresses?: (address: Address) => void;
  title?: string;

  stateOptions: SelectOption[] = [];
  cityOptions: SelectOption[] = [];
  countryOptions: SelectOption[] = [
    new SelectOption({ id: 1, code: 'MX', name: 'México' })
  ];

  ngOnInit(): void {
    this.stateOptions = this.utilsService.stateSelectOptions;
    this.initForm();
    this.subscribeToStateChanges();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      State: [ '', Validators.required ],
      City: [ { value: '', disabled: true }, Validators.required ],
      Street: [ '', Validators.required ],
      Neighborhood: [ '', Validators.required ],
      Zipcode: [ '', [ Validators.required, Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/) ] ],
      Country: [ { value: this.countryOptions[0], disabled: true }, Validators.required ],
      ExteriorNumber: [ '', Validators.required ],
      InteriorNumber: [ '' ],
      IsDefault: [ false ],
      IsBilling: [ false ]
    });
  }

  private subscribeToStateChanges(): void {
    this.addressForm.controls['state'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((selectedState: SelectOption) => {
      if (selectedState && selectedState.code) {
        this.cityOptions = this.utilsService.citySelectOptions(selectedState.code);
        this.addressForm.controls['city'].enable();
        if (this.cityOptions && this.cityOptions.length > 0) {
          this.addressForm.controls['city'].setValue(this.cityOptions[0]);
        } else {
          this.addressForm.controls['city'].setValue('');
        }
      } else {
        this.cityOptions = [];
        this.addressForm.controls['city'].disable();
        this.addressForm.controls['city'].setValue('');
      }
    });
  }

  get form() {
    return this.addressForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    const userId: number | null = this.accountService.current()!.id;
    if (userId == null) {
      this.toastr.error('No se ha podido obtener el usuario actual');
      return;
    }

    this.addressesService.createRaw(this.addressForm.getRawValue(), userId).subscribe({
      next: (res: any) => {
        console.log("Address created with response: ", res);
        this.toastr.success('¡Dirección agregada con éxito!');

        if (this.reloadAddresses) this.reloadAddresses(res);
        this.addressForm.markAsPristine();
        this.addressForm.reset();
        this.bsModalRef.hide();
      }
    });
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }
}
