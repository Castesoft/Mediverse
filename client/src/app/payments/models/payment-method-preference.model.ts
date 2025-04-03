export interface PaymentMethodPreference {
  userId: number;
  paymentMethodTypeId: number;
  displayOrder: number;
  isDefault: boolean;
  isActive?: boolean;
}

export interface PaymentMethodPreferenceDto {
  userId: number;
  paymentMethodTypeId: number;
  displayOrder: number;
  isDefault: boolean;
  isActive: boolean;
  paymentMethodTypeName?: string;
  paymentMethodTypeIconName?: string;
  paymentMethodTypeIconPrefix?: string;
}