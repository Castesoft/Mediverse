import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";
import { Item } from "src/app/_utils/serviceHelper/pagination/item";
import { PaginatedResponse } from "src/app/_utils/serviceHelper/pagination/paginatedResponse";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";

export class CacheItem<T extends Entity, U extends EntityParams<U>> {
  current = false;
  params: U;
  pagination?: Pagination;
  ids: Item[] = [];

  constructor(params: U) {
    this.params = params;
  }

  setParams(params: U): void {
    this.params = params;
  }

  setCurrent(value: boolean): void {
    this.current = value;
  }
  setPagination(value: Pagination): void {
    this.pagination = value;
  }
  setIds(value: Item[]): void {
    this.ids = value;
  }
  setIdsAndPagination(response: PaginatedResponse<T>): void {
    this.ids = response.ids;
    this.pagination = response.pagination;
  }
};
