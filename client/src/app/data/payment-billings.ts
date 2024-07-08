import { PaymentBilling, PaymentMethod, PaymentStatus } from '../_models/payment';
import { services } from './services';

export const paymentBillings: PaymentBilling[] = [
  {
    paymentMethod: PaymentMethod.CreditCard,
    billingAddress: 'Calle Principal 123, Ciudad, México',
    insuranceProvider: 'IMSS',
    insurancePolicyNumber: 'POL123456',
    transactionId: 'TXN1234567890',
    paymentStatus: PaymentStatus.Failed,
    notes: 'Pago realizado con tarjeta de crédito',
    services: [services[0], services[1]],
  },
  {
    paymentMethod: PaymentMethod.Cash,
    billingAddress: 'Calle Secundaria 456, Ciudad, México',
    transactionId: 'TXN0987654321',
    paymentStatus: PaymentStatus.Paid,
    notes: 'Pago pendiente',
    services: [services[2], services[3]],
  },
  {
    paymentMethod: PaymentMethod.CreditCard,
    billingAddress: 'Avenida Uno 3943, Ciudad, México',
    transactionId: 'TXN0237654321',
    paymentStatus: PaymentStatus.Pending,
    notes: 'Pago pendiente',
    services: [services[1], services[2], services[5]],
  },
  {
    paymentMethod: PaymentMethod.DebitCard,
    billingAddress: 'Avenida REforma, Ciudad, México',
    transactionId: 'TXN098423211',
    paymentStatus: PaymentStatus.Failed,
    notes: 'Pago pendiente',
    services: [services[3], services[4], services[6]],
  },
  {
    paymentMethod: PaymentMethod.Cash,
    billingAddress: 'Boulevard Acapulco, Ciudad, México',
    transactionId: 'TXN0985555321',
    paymentStatus: PaymentStatus.Pending,
    notes: 'Pago pendiente',
    services: [services[0]],
  },
];
