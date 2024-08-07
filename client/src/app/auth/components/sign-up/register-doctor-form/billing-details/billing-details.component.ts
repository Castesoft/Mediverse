import { Component, ElementRef, inject, input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeCardNumberElement, Stripe, StripeCardExpiryElement, StripeCardCvcElement, loadStripe } from '@stripe/stripe-js';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { UtilsService } from 'src/app/_services/utils.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-billing-details',
  standalone: true,
  imports: [ReactiveFormsModule, InputControlComponent, ControlCheckComponent, ControlSelectComponent],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent implements OnInit {
  public controlContainer = inject(ControlContainer);
  private utilsService = inject(UtilsService);
  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardErrors: any;

  submitted = input.required<boolean>();
  myForm!: FormGroup;

  states: string[] = this.utilsService.states;
  get citiesList() {
    const selectedState = this.myForm.get('BillingState')?.value;
    if (!selectedState) return [];
    return this.utilsService.cities(selectedState);
  }

  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;

    loadStripe(environment.stripe_pk).then(stripe => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement.nativeElement);
        this.cardNumber.on('change', event => {
          if (event.error) {
            this.cardErrors = event.error.message;
          } else {
            this.cardErrors = null;
          }
        });

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
        this.cardExpiry.on('change', event => {
          if (event.error) {
            this.cardErrors = event.error.message;
          } else {
            this.cardErrors = null;
          }
        });

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement.nativeElement);
        this.cardCvc.on('change', event => {
          if (event.error) {
            this.cardErrors = event.error.message;
          } else {
            this.cardErrors = null;
          }
        });
      }
    });

    this.myForm.get('SameAddress')?.valueChanges.subscribe(value => {
      this.updateBillingValidators(value);
    });

    // Initial update of validators
    this.updateBillingValidators(this.myForm.get('SameAddress')?.value);
  }

  unselectCity() {
    this.myForm.get('BillingCity')?.setValue('');
  }

  private updateBillingValidators(sameaddress: boolean): void {
    const billingControls = ['BillingState', 'BillingCity', 'BillingAddress', 'BillingZipCode'];

    if (sameaddress) {
      billingControls.forEach(control => {
        this.myForm.get(control)?.clearValidators();
        this.myForm.get(control)?.updateValueAndValidity();
      });
    } else {
      billingControls.forEach(control => {
        this.myForm.get(control)?.setValidators(Validators.required);
        this.myForm.get(control)?.updateValueAndValidity();
      });
    }
  }

}
