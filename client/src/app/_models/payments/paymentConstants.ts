import { baseInfo } from "src/app/_models/base/entity";
import { userPaymentMethodInfo } from "src/app/_models/billingDetails";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Payment } from "src/app/_models/payments/payment";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { Column } from "src/app/_models/base/column";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { baseTableCells, PartialCellsOf } from "src/app/_models/tables/tableCellItem";

export const paymentDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'pago',
  'pagos',
  'Pago',
  'payments'
);

export const paymentFiltersFormInfo: FormInfo<PaymentParams> = {
  ...baseFilterFormInfo
} as FormInfo<PaymentParams>;

export const paymentFormInfo: FormInfo<Payment> = {
  ...baseInfo,
  amount: { label: 'Cantidad', type: 'number', },
  date: { label: 'Fecha', type: 'date', },
} as FormInfo<Payment>;

export const paymentColumns: Column[] = [
  new Column('date', 'Fecha'),
  new Column('amount', 'Cantidad'),
  new Column('status', 'Estado'),
  new Column('event', 'Evento'),
  new Column('paymentMethod', 'Método de Pago'),
];

export const paymentCells: PartialCellsOf<Payment> = {
  ...baseTableCells,
} as PartialCellsOf<Payment>;

export class PaymentStatus {
  public static readonly RequiresPaymentMethod: string = "RequiresPaymentMethod";
  public static readonly RequiresConfirmation: string = "RequiresConfirmation";
  public static readonly RequiresAction: string = "RequiresAction";
  public static readonly Processing: string = "Processing";
  public static readonly RequiresCapture: string = "RequiresCapture";
  public static readonly Succeeded: string = "Succeeded";
  public static readonly Canceled: string = "Canceled";
  public static readonly Refunded: string = "Refunded";
}
