import { SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2 } from "src/app/_forms/form2";
import { serviceFormInfo } from "./services/serviceConstants";
import { Service } from "./services/service";
import { Entity, baseInfo } from "src/app/_models/types";

export class PaymentBilling extends Entity {
  services: Service[] = [];
  paymentMethod: SelectOption | null = null;
  billingAddress: string | null = null;
  insuranceProvider: string | null = null;
  insurancePolicyNumber: string | null = null;;
  transactionId: string | null = null;
  paymentStatus: SelectOption | null = null;
  notes: string | null = null;

  constructor(init?: Partial<PaymentBilling>) {
    super();
    Object.assign(this, init);
  }
}

export const paymentBillingInfo: FormInfo<PaymentBilling> = {
  ...baseInfo,
  services: serviceFormInfo,
  paymentMethod: { label: 'Método de pago', type: 'select', },
  billingAddress: { label: 'Dirección de facturación', type: 'text', },
  insuranceProvider: { label: 'Proveedor de seguro', type: 'text', },
  insurancePolicyNumber: { label: 'Número de póliza de seguro', type: 'text', },
  transactionId: { label: 'ID de transacción', type: 'text', },
  notes: { label: 'Notas', type: 'textarea', },
  paymentStatus: { label: 'Estado de pago', type: 'select', },
} as FormInfo<PaymentBilling>;

export class PaymentBillingForm extends FormGroup2<PaymentBilling> {
  constructor() {
    super(PaymentBilling, new PaymentBilling(), paymentBillingInfo);
  }
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
