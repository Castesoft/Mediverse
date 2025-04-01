import Event from "src/app/_models/events/event";

export interface EventPaymentModalData {
  title: string;
  item: Event | null;
  defaultSendBill?: boolean;
}

export interface EventPaymentModalResult {
  paymentMethod: 'cash' | 'transfer' | 'credit_card' | 'debit_card' | 'other';
  sendBill: boolean;
  success?: boolean;
}
