import Event from "src/app/_models/events/event";
import { ManualPaymentType } from "src/app/payments/models/manual-payment-type.enum";

export interface EventPaymentModalData {
  title: string;
  item: Event | null;
  defaultSendBill?: boolean;
}

export interface EventPaymentModalResult {
  paymentMethodTypeId: number;
  updatedEvent: Event | null;
  sendBill: boolean;
  success?: boolean;
  notes?: string;
}
