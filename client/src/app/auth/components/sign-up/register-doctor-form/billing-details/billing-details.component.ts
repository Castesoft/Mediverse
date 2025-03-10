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
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElement,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent
} from '@stripe/stripe-js';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ZipcodeAddressOption } from 'src/app/_models/billingDetails';
import { UtilsService } from 'src/app/_services/utils.service';
import { AddressesService } from 'src/app/addresses/addresses.config';
import { environment } from 'src/environments/environment';
import { NgClass } from "@angular/common";
import { BadRequest } from "src/app/_models/forms/badRequest";
import { ErrorsAlert3Component } from "src/app/_forms2/helper/errors-alert-3.component";

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  imports: [
    ReactiveFormsModule,
    InputControlComponent,
    ControlCheckComponent,
    ControlSelectComponent,
    NgClass,
    ErrorsAlert3Component
  ],
})
export class BillingDetailsComponent implements OnInit {
  public controlContainer = inject(ControlContainer);
  private utilsService = inject(UtilsService);
  private addressesService = inject(AddressesService);

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

  myForm!: FormGroup;

  states: string[] = this.utilsService.states;

  get citiesList() {
    const selectedState = this.myForm.get('BillingState')?.value;
    if (!selectedState) return [];
    return this.utilsService.cities(selectedState);
  }

  neighborhoods: ZipcodeAddressOption[] = [];

  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;

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

    // Update billing validators based on SameAddress control changes
    this.myForm.get('SameAddress')?.valueChanges.subscribe(value => {
      this.updateBillingValidators(value);
    });

    // Initial update of validators
    this.updateBillingValidators(this.myForm.get('SameAddress')?.value);
  }

  private getStripeError(
    event:
      StripeCardNumberElementChangeEvent |
      StripeCardCvcElementChangeEvent |
      StripeCardExpiryElementChangeEvent
  ): { [key: string]: string } {
    const stripeError: { [key: string]: string } = {};
    if (event.error) {
      stripeError[event.error.code] = event.error.message;
    }
    return stripeError;
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
        };
      });
    });
  }

  onNeighborhoodChange(event: any) {
    const neighborhood = event.target.value;
    const selectedNeighborhood = this.neighborhoods.find(n => n.neighborhood === neighborhood);
    if (selectedNeighborhood) {
      this.myForm.get('BillingCity')?.setValue(selectedNeighborhood.city);
      this.myForm.get('BillingState')?.setValue(selectedNeighborhood.state);
    }
  }

  private updateBillingValidators(sameaddress: boolean): void {
    const billingControls = [ 'BillingState', 'BillingCity', 'BillingAddress', 'BillingZipcode' ];
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
