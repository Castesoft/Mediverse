import { Entity } from "src/app/_models/base/entity";
import { NotificationType } from "src/app/_models/notifications/notificationType";

export class Notification extends Entity {
  title!: string;
  message!: string;
  actionUrl?: string;
  type!: NotificationType;
  payload?: string;
  isRead!: boolean;
  isFavorite!: boolean;
  isImportant!: boolean;
  readAt?: Date;
  deliveredAt?: Date;

  constructor(init?: Partial<Notification>) {
    super();
    Object.assign(this, init);
  }
}
