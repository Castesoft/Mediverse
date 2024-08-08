export interface BillingDetails {
  userAddresses: UserAddress[];
  userPaymentMethods: UserPaymentMethod[];
}

export interface UserAddress {
  addressId: number;
  isMain: boolean;
  isBilling: boolean;
  street: string;
  city: string;
  state: string;
  country: any;
  zipcode: string;
}

export interface UserPaymentMethod {
  isMain: boolean;
  displayName: string;
  last4: string;
  brand: string;
  country: string;
  expirationMonth: number;
  expirationYear: number;
  stripePaymentMethodId: string;
}
