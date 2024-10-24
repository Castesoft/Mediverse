import { Service } from 'src/app/_models/service';
import { UserPaymentMethod } from './billingDetails';
import { PaymentMethodType } from './paymentMethodType';

export interface Payment {
  id: number
  amount: number
  paymentMethod: UserPaymentMethod
  paymentMethodType: PaymentMethodType
  paymentDate: Date
}
export interface PaymentBilling {
  services: Service[];
  paymentMethod: PaymentMethod;
  billingAddress: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  transactionId: string;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export enum PaymentMethod {
  Cash = 'Efectivo',
  CreditCard = 'Tarjeta de crédito',
  DebitCard = 'Tarjeta de débito',
  Insurance = 'Seguro médico',
  BankTransfer = 'Transferencia bancaria',
  Other = 'Otro',
}

export enum PaymentStatus {
  Paid = 'Pagada',
  Pending = 'Pendiente',
  Failed = 'Fallado',
}
