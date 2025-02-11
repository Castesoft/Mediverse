import { Entity } from "src/app/_models/base/entity";

export class PaymentMethod extends Entity {
  isDefault: boolean = false;
  cardholderName?: string;
  funding?: string;
  billingAddress?: string;
  billingZipCode?: string;
  billingCity?: string;
  billingCountry?: string;
  isActive: boolean = false;
  displayName?: string;
  last4?: string;
  brand?: string;
  country?: string;
  expirationMonth?: number;
  expirationYear?: number;
  stripePaymentMethodId?: string;

  constructor(init?: Partial<PaymentMethod>) {
    super();
    Object.assign(this, init);
  }
}
