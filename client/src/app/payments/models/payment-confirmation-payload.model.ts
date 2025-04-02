export interface PaymentConfirmationPayload {
  selectedPaymentMethodTypeId: number;
  referenceNumber?: string;
  notes?: string;
}
