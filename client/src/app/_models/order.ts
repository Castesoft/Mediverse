import { HttpParams } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { OrdersService } from "src/app/_services/orders.service";
import { getPaginationHeaders } from "src/app/_utils/util";
import { User } from "src/app/_models/user";
import { Product } from "src/app/_models/product";
import { Address } from "src/app/addresses/addresses.config";

const subject = 'order';

export class Order {
  id!: number;
  total!: number;
  subtotal!: number;
  discount!: number;
  tax!: number;
  amountPaid!: number;
  amountDue!: number;
  patient!: User;
  doctor!: User;
  address?: Address;
  items: Product[] = [];
  status?: OrderStatus;
  deliveryStatus?: OrderDeliveryStatus;
  createdAt!: Date;
  isSelected = false;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type OrderDeliveryStatus = 'pending' | 'processing' | 'inprogress' | 'delivered' | 'cancelled';

export class OrderParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;
  key?: string;

  // other
  sex?: string;

  constructor(key: string) {
    this.key = key;
  }

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.key) params = params.append('id', this.key);
    if (this.search) params = params.append('search', this.search);
    if (this.dateFrom)
      params = params.append(
        'dateFrom',
        this.dateFrom.toISOString(),
      );
    if (this.dateTo)
      params = params.append(
        'dateTo',
        this.dateTo.toISOString(),
      );
    if (this.sort) params = params.append('sort', this.sort);
    if (this.isSortAscending)
      params = params.append('isSortAscending', this.isSortAscending);
    if (this.pageSize) {
      params = params.append('pageSize', this.pageSize.toString());
    }

    if (this.sex) params = params.append('sex', this.sex);

    return params;
  }

  updateFromPartial(partial: Partial<OrderParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
  }

  update(group: FormGroup, service: OrdersService, key: string) {
    this.setFromFormGroup(group);
    service.setParam$(key, this);
  }
}
