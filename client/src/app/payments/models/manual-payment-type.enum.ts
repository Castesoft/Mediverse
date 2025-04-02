export enum ManualPaymentType {
  Unknown = 'Unknown',
  Cash = 'Cash',
  BankTransfer = 'BankTransfer',
  CreditCardTerminal = 'CreditCardTerminal',
  DebitCardTerminal = 'DebitCardTerminal',
  Other = 'Other'
}

export const ManualPaymentTypeDisplayNames: Record<ManualPaymentType, string> = {
  [ManualPaymentType.Unknown]: 'Desconocido',
  [ManualPaymentType.Cash]: 'Efectivo',
  [ManualPaymentType.BankTransfer]: 'Transferencia Bancaria',
  [ManualPaymentType.CreditCardTerminal]: 'Tarjeta de Crédito (Terminal)',
  [ManualPaymentType.DebitCardTerminal]: 'Tarjeta de Débito (Terminal)',
  [ManualPaymentType.Other]: 'Otro',
};
