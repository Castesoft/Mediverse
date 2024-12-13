import { Component, ElementRef, inject, input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeCardNumberElement, Stripe, StripeCardExpiryElement, StripeCardCvcElement, loadStripe } from '@stripe/stripe-js';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ZipcodeAddressOption } from 'src/app/_models/billingDetails';
import { UtilsService } from 'src/app/_services/utils.service';
import { AddressesService } from 'src/app/addresses/addresses.config';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-billing-details',
  standalone: true,
  imports: [ReactiveFormsModule, InputControlComponent, ControlCheckComponent, ControlSelectComponent],
  templateUrl: './billing-details.component.html',
})
export class BillingDetailsComponent implements OnInit {
  public controlContainer = inject(ControlContainer);
  private utilsService = inject(UtilsService);
  private addressesService = inject(AddressesService);
  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardErrors: any;

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
      this.myForm.get('BillingCity')?.setValue(selectedNeighborhood.city);
      this.myForm.get('BillingState')?.setValue(selectedNeighborhood.state);
    }
  }

  private updateBillingValidators(sameaddress: boolean): void {
    const billingControls = ['BillingState', 'BillingCity', 'BillingAddress', 'BillingZipcode'];

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
