import { CatalogMode } from "src/app/_models/base/types";
import { EntityParams } from "src/app/_models/base/entityParams";
import { Entity } from "src/app/_models/base/entity";
import { CacheEntry } from "src/app/_utils/serviceHelper/cacheEntry";
import { CacheItem } from "src/app/_utils/serviceHelper/cacheItem";
import { PaginatedResponse } from "src/app/_utils/serviceHelper/pagination/paginatedResponse";

export class Cache<T extends Entity, U extends EntityParams<U>> {
  entries: Record<string, CacheEntry<T, U>> = {};

  constructor(private paramConstructor: new (key: string) => U) {}

  add(key: string, type: CatalogMode): Cache<T, U> {
    if (this.hasEntry(key)) return this;
    const params = new this.paramConstructor(key);
    this.entries[key] = new CacheEntry<T, U>(type);
    this.entries[key].entries[params.paramsValue] = new CacheItem<T, U>(params);
    this.entries[key].entries[params.paramsValue].setCurrent(true);
    this.entries[key].entries[params.paramsValue].setParams(params);
    return this;
  }

  hasSelected(key: string): boolean {
    // return this.entries[key].getCurrent()?.ids.length > 0;
    return false;
  }

  selected(key: string): number[] {
    return this.entries[key].selected;
  }

  get values(): string[] {
    return Object.keys(this.entries);
  }

  getEntry(key: string): CacheEntry<T, U> {
    return this.entries[key];
  }

  hasEntry(key: string): boolean {
    if (Object.keys(this.entries).length === 0) return false;
    for (const k of Object.keys(this.entries)) {
      if (k === key) return true;
    }
    return false;
  }

  hasPagedList(key: string, paramsValue: string): boolean {
    if (this.hasEntry(key)) {
      if (this.entries[key].hasEntry(paramsValue)) {
        return this.entries[key].entries[paramsValue].ids.length > 0;
      }
    }

    return false;
  }

  getParamValues(key: string): string[] {
    return Object.keys(this.entries[key].entries);
  }

  getParam(key: string): U {
    if (!this.hasEntry(key)) {
      throw new Error('No entry found');
    }

    const entry: CacheEntry<T, U> = this.entries[key];

    return entry.getParam();
  }

  disableParam(key: string, param: string): Cache<T, U> {
    this.entries[key].entries[param].current = false;
    return this;
  }

  setParamState(key: string, param: string, value = false): Cache<T, U> {
    this.entries[key].entries[param].current = value;
    return this;
  }

  createEntry(key: string, value: U, type: CatalogMode): Cache<T, U> {
    if (!this.hasEntry(key)) {
      this.entries[key] = new CacheEntry<T, U>(type);
    }
    if (!this.entries[key].hasEntry(value.paramsValue)) {
      this.entries[key].entries[value.paramsValue] = new CacheItem<T, U>(value);
    }
    this.entries[key].entries[value.paramsValue].setCurrent(true);
    this.entries[key].entries[value.paramsValue].setParams(value);
    return this;
  }

  getItem(key: string, paramValue: string): CacheItem<T, U> {
    return this.entries[key].entries[paramValue];
  }

  hasParam(key: string, param: string): boolean {
    if (!this.hasEntry(key)) return false;

    const entry: CacheEntry<T, U> = this.entries[key];

    return entry.hasEntry(param);
  }

  get count(): number {
    return Object.keys(this.entries).length;
  }

  hasIds(key: string): boolean {
    if (!this.hasEntry(key)) return false;
    const current = Object.values(this.entries[key].entries).find(a => a.current);
    return !!current?.ids.length;
  }

  createPaginatedResult(key: string, params: U, data: T[]): PaginatedResponse<T> {
    const item = this.getItem(key, params.paramsValue);
    this.entries[key].entries[params.paramsValue].setCurrent(true);
    const list = item.ids.map(({ id }) => data.find(a => a.id === id)!);
    return new PaginatedResponse<T>(list, item.pagination!);
  }

  setPaginatedResult(key: string, paramValue: string, response: PaginatedResponse<T>, params: U, current: boolean): Cache<T, U> {
    this.entries[key].entries[paramValue].setCurrent(current);
    this.entries[key].entries[paramValue].setParams(params);
    this.entries[key].entries[paramValue].setIdsAndPagination(response);
    return this;
  }
};
