import { Column } from 'src/app/_models/base/column';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { FormInfo } from 'src/app/_models/forms/formTypes';
import { baseInfo } from 'src/app/_models/base/entity';
import { baseFilterFormInfo } from 'src/app/_models/base/entityParams';
import { SubscriptionParams } from "src/app/_models/subscriptions/subscriptionParams";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { baseTableCells, PartialCellsOf } from "src/app/_models/tables/tableCellItem";

export const subscriptionDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'subscription',
  'subscriptions',
  'Subscriptions',
  'subscriptions'
);

export const subscriptionColumns: Column[] = [
  new Column('subscriptionPlanName', 'Plan'),
  new Column('subscriptionStartDate', 'Fecha de Inicio'),
  new Column('nextBillingDate', 'Próxima Facturación'),
  new Column('nextBillingDate', 'Stripe Sub ID'),
  new Column('status', 'Estatus')
];

export const subscriptionFormInfo: FormInfo<Subscription> = {
  ...baseInfo
} as unknown as FormInfo<Subscription>;

export const subscriptionFiltersFormInfo: FormInfo<SubscriptionParams> = {
  ...baseFilterFormInfo,
} as unknown as FormInfo<SubscriptionParams>;

export const subscriptionCells: PartialCellsOf<Subscription> = {
  ...baseTableCells
};

const subscriptionStatusTranslations: { [key: string]: string } = {
  "Active": "Activo",
  "Inactive": "Inactivo",
  "Expired": "Expirado",
  "Pending": "Pendiente"
};

export function getTranslatedSubscriptionStatus(status: string): string {
  return subscriptionStatusTranslations[status] || status;
}

export class SubscriptionStatus {
  public static readonly Active: string = "Active";
  public static readonly Inactive: string = "Inactive";
  public static readonly Expired: string = "Expired";
  public static readonly Pending: string = "Pending";
}
