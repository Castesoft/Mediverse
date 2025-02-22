import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { UtilsService } from 'src/app/_services/utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgClass } from "@angular/common";
import { AddressesService } from "src/app/addresses/addresses.config";
import { ToastrService } from "ngx-toastr";
import { Address } from "src/app/_models/addresses/address";

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: [ './add-address.component.scss' ],
  imports: [
    ReactiveFormsModule,
    NgClass
  ]
})
export class AddAddressComponent implements OnInit, OnDestroy {
  private readonly addressesService: AddressesService = inject(AddressesService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly utilsService: UtilsService = inject(UtilsService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  private readonly destroy$: Subject<void> = new Subject<void>();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      street: [ '', Validators.required ],
      city: [ { value: '', disabled: true }, Validators.required ],
      state: [ '', Validators.required ],
      zipCode: [ '', [ Validators.required, Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/) ] ],
      country: [ { value: this.countryOptions[0], disabled: true }, Validators.required ],
      exteriorNumber: [ '', Validators.required ],
      interiorNumber: [ '' ],
      isDefault: [ false ],
      isBilling: [ false ]
    });
  }

  private subscribeToStateChanges(): void {
    this.addressForm.controls['state'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedState: SelectOption) => {
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

  get f() {
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
