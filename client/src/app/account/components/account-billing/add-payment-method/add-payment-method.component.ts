import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, loadStripe } from '@stripe/stripe-js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-payment-method',
  standalone: true,
  imports: [ModalWrapperModule, InputControlComponent, ReactiveFormsModule],
  templateUrl: './add-payment-method.component.html',
  styleUrl: './add-payment-method.component.scss'
})
export class AddPaymentMethodComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private bsModalService = inject(BsModalService);
  
  bsModalRef = inject(BsModalRef);
  title?: string;

  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardErrors: any;

  submitted = false;
  paymentMethodForm = this.fb.group({
    DisplayName             : [ '', [Validators.required] ],
    StripePaymentMethodId   : [ '' ],
    Last4                   : [ '' ],
    ExpirationMonth         : [ 0 ],
    ExpirationYear          : [ 0 ],
    Brand                   : [ '' ],
    Country                 : [ '' ],
    IsMain                  : [ false ]
  });

  ngOnInit() {
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
  }

  async onSubmit() {
    this.submitted = true;

    if (!this.paymentMethodForm.valid || !this.stripe || !this.cardNumber) {
      return;
    }

    const paymentMethod = await this.stripe?.createPaymentMethod({
      type: 'card',
      card: this.cardNumber!
    });
    if (paymentMethod.error) {
      this.cardErrors = paymentMethod.error.message;
      return;
    }
    this.paymentMethodForm.get('StripePaymentMethodId')?.setValue(paymentMethod!.paymentMethod!.id);
    this.paymentMethodForm.get('Last4')?.setValue(paymentMethod!.paymentMethod!.card!.last4);
    this.paymentMethodForm.get('ExpirationMonth')?.setValue(paymentMethod!.paymentMethod!.card!.exp_month);
    this.paymentMethodForm.get('ExpirationYear')?.setValue(paymentMethod!.paymentMethod!.card!.exp_year);
    this.paymentMethodForm.get('Brand')?.setValue(paymentMethod!.paymentMethod!.card!.brand);
    this.paymentMethodForm.get('Country')?.setValue(paymentMethod!.paymentMethod!.card!.country);

    this.accountService.addPaymentMethod(this.paymentMethodForm.value).subscribe({
      next: _ => {
        this.bsModalRef.hide();
        this.submitted = false
      }
    });
  }
}
