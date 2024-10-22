import { Entity } from "src/app/_models/types";

export class Item {
  id: number;
  isSelected = false;

  constructor(id: number) {
    this.id = id;
  }
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResponse<T extends Entity> {
  result: T[] = [];
  pagination: Pagination;

  constructor(result: T[] = [], pagination: Pagination) {
    this.result = result;
    this.pagination = pagination;
  }

  get ids(): Item[] {
    return this.result.map((x) => new Item(x.id!));
  }
}

export class PaginatedResult<T> {
  result?: T;
  pagination?: Pagination;
}
