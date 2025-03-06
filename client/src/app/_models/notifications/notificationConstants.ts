import { Column, columnCreatedAt } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Notification } from "src/app/_models/notifications/notification";
import { NotificationParams } from "src/app/_models/notifications/notificationParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";

export const notificationDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'notificación',
  'notificaciones',
  'Notificaciones',
  'notifications'
);

export const notificationColumns: Column[] = [
  new Column('name', 'Nombre'),
  new Column('description', 'Descripción'),
  new Column('address', 'Dirección'),
  columnCreatedAt,
];

export const notificationFormInfo: FormInfo<Notification> = {
  ...baseInfo,
  name: { label: 'Nombre', type: 'text' },
  description: { label: 'Descripción', type: 'text' },
  address: { label: 'Dirección', type: 'select' },
} as unknown as FormInfo<Notification>;

export const notificationFiltersFormInfo: FormInfo<NotificationParams> = {
  ...baseFilterFormInfo,
  name: { label: 'Nombre', type: 'text' },
  address: { label: 'Dirección', type: 'select' },
} as FormInfo<NotificationParams>;

export const notificationCells: PartialCellsOf<Notification> = {
  ...baseTableCells,
  name: new TableCellItem<string, 'name'>('name', 'string', { justification: 'start' }),
  description: new TableCellItem<string, 'description'>('description', 'string', { justification: 'start' }),
  address: new TableCellItem<string, 'address'>('address', 'string', { justification: 'start' }),
  createdAt: new TableCellItem<Date, 'createdAt'>('createdAt', 'date', { justification: 'end', fullDate: true }),
} as PartialCellsOf<Notification>;
