import {
  Component,
  ElementRef,
  inject,
  model,
  ModelSignal,
  OnInit,
  output,
  OutputEmitterRef,
  ViewChild
} from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  loadStripe,
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement
} from '@stripe/stripe-js';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { environment } from 'src/environments/environment';
import { NgClass } from "@angular/common";
import { BadRequest } from "src/app/_models/forms/badRequest";
import { ErrorsAlert3Component } from "src/app/_forms2/helper/errors-alert-3.component";
import { AddressFormComponent } from "src/app/addresses/address-form/address-form.component";

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  imports: [
    ReactiveFormsModule,
    InputControlComponent,
    ControlCheckComponent,
    NgClass,
    ErrorsAlert3Component,
    AddressFormComponent
  ],
})
export class BillingDetailsComponent implements OnInit {
  controlContainer: ControlContainer = inject(ControlContainer);

  onSubmit: OutputEmitterRef<void> = output();
  isSubmitting: ModelSignal<boolean> = model(false);
  submissionErrors: ModelSignal<BadRequest | null> = model.required();

  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardNumberErrors: any;
  cardExpiryErrors: any;
  cardCvcErrors: any;

  ngOnInit() {
    loadStripe(environment.stripe_pk).then(stripe => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {
        // Card Number Element
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement.nativeElement);
        this.cardNumber.on('change', event => {
          if (event.error) {
            console.log('CardNumber error:', event.error);
            this.cardNumberErrors = event.error;
          } else {
            this.cardNumberErrors = null;
          }
        });

        // Card Expiry Element
        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
        this.cardExpiry.on('change', event => {
          if (event.error) {
            console.log('CardExpiry error:', event.error);
            this.cardExpiryErrors = event.error;
          } else {
            this.cardExpiryErrors = null;
          }
        });

        // Card CVC Element
        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement.nativeElement);
        this.cardCvc.on('change', event => {
          if (event.error) {
            console.log('CardCvc error:', event.error);
            this.cardCvcErrors = event.error;
          } else {
            this.cardCvcErrors = null;
          }
        });
      }
    });

    this.form.get('SameAddress')?.valueChanges.subscribe(value => {
      this.updateBillingValidators(value);
    });

    this.updateBillingValidators(this.form.get('SameAddress')?.value);
  }

  get form() {
    return <FormGroup>this.controlContainer.control;
  }

  private updateBillingValidators(sameAddress: boolean): void {
    const billingControls: string[] = [ 'State', 'City', 'Street', 'Zipcode' ];
    if (sameAddress) {
      billingControls.forEach((control: string) => {
        this.form.get(control)?.clearValidators();
        this.form.get(control)?.updateValueAndValidity();
      });
    } else {
      billingControls.forEach((control: string) => {
        this.form.get(control)?.setValidators(Validators.required);
        this.form.get(control)?.updateValueAndValidity();
      });
    }
  }
}
