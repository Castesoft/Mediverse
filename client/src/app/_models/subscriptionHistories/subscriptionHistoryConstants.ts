import { Column } from 'src/app/_models/base/column';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { FormInfo } from 'src/app/_models/forms/formTypes';
import { baseInfo } from 'src/app/_models/base/entity';
import { baseFilterFormInfo } from 'src/app/_models/base/entityParams';
import { SubscriptionHistory } from 'src/app/_models/subscriptionHistories/subscriptionHistory';
import { baseTableCells, PartialCellsOf } from 'src/app/_models/tables/tableCellItem';

export const subscriptionHistoryDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'subscription history',
  'subscription histories',
  'Historial de Suscripciones',
  'subscriptionHistories'
);

export const subscriptionHistoryColumns: Column[] = [
  new Column('changedAt', 'Fecha de Cambio'),
  new Column('oldStatus', 'Cambio'),
  new Column('note', 'Nota')
];

export const subscriptionHistoryFormInfo: FormInfo<SubscriptionHistory> = {
  ...baseInfo
} as unknown as FormInfo<SubscriptionHistory>;

export const subscriptionHistoryFiltersFormInfo: FormInfo<SubscriptionHistory> = {
  ...baseFilterFormInfo,
} as unknown as FormInfo<SubscriptionHistory>;

export const subscriptionHistoryCells: PartialCellsOf<SubscriptionHistory> = {
  ...baseTableCells
};

const subscriptionHistoryStatusTranslations: { [key: string]: string } = {
  "Active": "Activo",
  "Inactive": "Inactivo",
  "Expired": "Expirado",
  "Pending": "Pendiente"
};

export function getTranslatedSubscriptionHistoryStatus(status: string): string {
  return subscriptionHistoryStatusTranslations[status] || status;
}

export class SubscriptionHistoryStatus {
  public static readonly Active: string = "Active";
  public static readonly Inactive: string = "Inactive";
  public static readonly Expired: string = "Expired";
  public static readonly Pending: string = "Pending";
}
