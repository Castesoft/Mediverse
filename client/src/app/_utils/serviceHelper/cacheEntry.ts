import { CatalogMode } from "src/app/_models/base/types";
import { EntityParams } from "src/app/_models/base/entityParams";
import { Entity } from "src/app/_models/base/entity";
import { CacheItem } from "src/app/_utils/serviceHelper/cacheItem";
import { PaginatedResponse } from "src/app/_utils/serviceHelper/pagination/paginatedResponse";

export class CacheEntry<T extends Entity, U extends EntityParams<U>> {
  entries: Record<string, CacheItem<T, U>> = {};
  type: CatalogMode;
  selected: number[] = [];

  constructor(type: CatalogMode) {
    this.type = type;
  }

  onSelectAll(paramValue: string, isSelected: boolean): void {
    this.entries[paramValue].ids.forEach(a => {
      if (isSelected) {
        if (!this.selected.includes(a.id)) {
          this.selected.push(a.id);
        }
        this.entries[paramValue].ids.find(b => b.id === a.id)!.isSelected = true;
      } else {
        this.selected = this.selected.filter(b => b !== a.id);
        this.entries[paramValue].ids.find(b => b.id === a.id)!.isSelected = false;
      }
    });
  }

  set(response: PaginatedResponse<T> | undefined = undefined, currentParam: U, current = false) {
    const currentParamValue = currentParam.paramsValue;
    if (!this.hasEntry(currentParamValue)) {
      this.entries[currentParamValue] = new CacheItem<T, U>(currentParam);
    }
    this.entries[currentParamValue].params = currentParam;
    this.entries[currentParamValue].current = current;
    if (response) {
      this.entries[currentParamValue].pagination = response?.pagination;
      this.entries[currentParamValue].ids = response?.ids ?? [];
    }
  }

  hasEntry(paramValue: string): boolean {
    if (Object.keys(this.entries).length === 0) return false;
    for(const key of Object.keys(this.entries)) {
      if (key === paramValue) return true;
    }
    return false;
  }

  getParam(): U {
    const cacheItem: CacheItem<T, U>[] = Object.values(this.entries);
    const current: CacheItem<T, U> | undefined = cacheItem.find(a => a.current);
    if (!current) throw new Error('No current item found');
    return current.params;
  }

  getCurrent(): CacheItem<T, U> {
    const cacheItem: CacheItem<T, U>[] = Object.values(this.entries);
    const current: CacheItem<T, U> | undefined = cacheItem.find(a => a.current);
    if (current === undefined) throw new Error('No current item found');
    return current;
  }

  get hasCurrent(): boolean {
    const cacheItem: CacheItem<T, U>[] = Object.values(this.entries);
    const current: CacheItem<T, U> | undefined = cacheItem.find(a => a.current);
    if (current === undefined) return false;
    return true;
  }

  getCurrentEntry(): CacheItem<T, U> {
    const cacheItem: CacheItem<T, U>[] = Object.values(this.entries);
    const current: CacheItem<T, U> | undefined = cacheItem.find(a => a.current);
    if (current === undefined) throw new Error('No current item found');
    return current;
  }

  getByValue(paramValue: string): CacheItem<T, U> {
    if (this.hasEntry(paramValue) === false) throw new Error('No entry found');
    const current: CacheItem<T, U> = this.entries[paramValue];
    return current;
  }

  hasIds(): boolean {
    if (this.count === 0) return false;
    const current = this.getCurrent();
    return !!current?.ids.length;
  }

  get count(): number {
    const cacheItem: CacheItem<T, U>[] = Object.values(this.entries);
    if (cacheItem.length === 0) return 0;
    return cacheItem.length;
  }

  get keys(): string[] {
    const cacheItem: CacheItem<T, U>[] = Object.values(this.entries);
    const keys: string[] = cacheItem.map(a => a.params.paramsValue);
    return keys;
  }

  get values(): U[] {
    return Object.values(this.entries).map(a => a.params);
  }

  hasParam(param: string): boolean {
    return !!this.entries[param];
  }
}
