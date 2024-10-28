import { FormInfo } from "src/app/_forms/form2";
import { Entity } from "src/app/_models/types";

export class BillingDetails {
  userAddresses: UserAddress[] = [];
  userPaymentMethods: UserPaymentMethod[] = [];

  constructor(init?: Partial<BillingDetails>) {
    Object.assign(this, init);
  }
}

export class UserAddress extends Entity {
  isMain: boolean | null = false;
  isBilling: boolean | null = false;
  street: string | null = null;
  city: string | null = null;
  state: string | null = null;
  country: string | null = null;
  zipcode: string | null = null;
  neighborhood: string | null = null;
  exteriorNumber: string | null = null;
  interiorNumber: string | null = null;

  constructor(init?: Partial<UserAddress>) {
    super();
    Object.assign(this, init);
  }
}

export class ZipcodeAddressOption {
  neighborhood: string | null = null;
  city: string | null = null;
  state: string | null = null;
  settlement: string | null = null;

  constructor(init?: Partial<ZipcodeAddressOption>) {
    Object.assign(this, init);
  }
}

export class UserPaymentMethod {
  isMain: boolean | null = false;
  displayName: string | null = null;
  last4: string | null = null;
  brand: string | null = null;
  country: string | null = null;
  expirationMonth: number | null = null;
  expirationYear: number | null = null;
  stripePaymentMethodId: string | null = null;

  constructor(init?: Partial<UserPaymentMethod>) {
    Object.assign(this, init);
  }
}

export const userPaymentMethodInfo: FormInfo<UserPaymentMethod> = {
  brand: { label: 'Marca', type: 'text', },
  country: { label: 'País', type: 'text', },
  displayName: { label: 'Nombre', type: 'text', },
  expirationMonth: { label: 'Mes de expiración', type: 'number', },
  expirationYear: { label: 'Año de expiración', type: 'number', },
  isMain: { label: 'Principal', type: 'checkbox', },
  last4: { label: 'Últimos 4 dígitos', type: 'text', },
  stripePaymentMethodId: { label: 'ID de método de pago de Stripe', type: 'text', },
} as FormInfo<UserPaymentMethod>;
