export interface BillingDetails {
  userAddresses: UserAddress[];
  userPaymentMethods: UserPaymentMethod[];
}

export interface UserAddress {
  id: number;
  isMain: boolean;
  isBilling: boolean;
  street: string;
  city: string;
  state: string;
  country: any;
  zipcode: string;
  neighborhood: string;
  exteriorNumber: string;
  interiorNumber: string;
}

export interface ZipcodeAddressOption {
  neighborhood: string;
  city: string;
  state: string;
  settlement: string;
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
