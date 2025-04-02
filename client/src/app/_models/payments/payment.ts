import { Entity } from "src/app/_models/base/entity";
import Event from "src/app/_models/events/event";
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { ManualPaymentType } from "src/app/payments/models/manual-payment-type.enum";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";

export class Payment extends Entity {
  eventId?: number;
  amount?: number;
  currency?: string = "MXN";
  date?: Date;
  stripePaymentIntent?: string;
  stripePaymentId?: string;
  stripeInvoiceId?: string;
  paymentMethod?: Partial<PaymentMethod>;
  paymentMethodType?: PaymentMethodType;
  paymentStatus?: string;
  doctorId?: number;
  customerStripeId?: string;
  paymentMethodId?: number;
  event?: Partial<Event>;

  constructor(init?: Partial<Payment>) {
    super();
    Object.assign(this, init);
  }
}
