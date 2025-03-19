import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlCheckListComponent } from 'src/app/_forms/control-check-list.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";
import { Specialty } from 'src/app/_models/specialties/specialty';
import { UtilsService } from 'src/app/_services/utils.service';
import { SpecialtiesService } from "src/app/specialties/specialties.config";
import { PaymentsService } from "src/app/payments/payments.config";
import { ControlCheckComponent } from "src/app/_forms/control-check.component";
import { AddressFormComponent } from "src/app/addresses/address-form/address-form.component";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  imports: [
    ReactiveFormsModule,
    InputControlComponent,
    ControlSelectComponent,
    ControlCheckListComponent,
    ControlCheckComponent,
    AddressFormComponent
  ],
})
export class AccountDetailsComponent implements OnInit {
  controlContainer: ControlContainer = inject(ControlContainer);

  private utilsService: UtilsService = inject(UtilsService);
  private paymentsService: PaymentsService = inject(PaymentsService);
  private specialtiesService: SpecialtiesService = inject(SpecialtiesService);

  states: string[] = this.utilsService.states;

  specialties: Specialty[] = [];
  paymentMethodTypes: PaymentMethodType[] = [];

  ngOnInit() {
    this.setSpecialtyOptions();
    this.setPaymentMethodOptions();
  }

  private setSpecialtyOptions() {
    this.specialtiesService.getAll().subscribe({
      next: (response: Specialty[]) => {
        this.specialties = response;
      }
    })
  }

  private setPaymentMethodOptions() {
    this.paymentsService.getAllMethods().subscribe({
      next: (response: PaymentMethodType[]) => {
        this.paymentMethodTypes = response;
      }
    })
  }

  get form() {
    return <FormGroup>this.controlContainer.control;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.get('file')?.setValue(event.target.files[0]);
    }
  }

  showRequireAnticipatedCardPaymentsField(): boolean {
    const acceptedPaymentControl: AbstractControl | null = this.form.get('AcceptedPaymentMethods');
    if (!acceptedPaymentControl) return false;

    const paymentMethods: string = acceptedPaymentControl.value;
    const methods: string[] = paymentMethods.split(',');
    return methods.includes('1') || methods.includes('2');
  }
}
