import { Entity } from "src/app/_models/base/entity";

export class Notification extends Entity {
  title!: string;
  message!: string;
  actionUrl?: string;
  notificationType!: string;
  payload?: string;
  isRead!: boolean;
  readAt?: Date;
  deliveredAt?: Date;

  constructor(init?: Partial<Notification>) {
    super();
    Object.assign(this, init);
  }
}
