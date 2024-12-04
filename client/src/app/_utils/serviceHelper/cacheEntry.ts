
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { CatalogMode } from "src/app/_models/base/types";
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
    const current = Object.values(this.entries).find(a => a.current)!;
    return current.params;
  }

  getCurrent(): CacheItem<T, U> | undefined {
    return Object.values(this.entries).find(a => a.current);
  }

  get hasCurrent(): boolean {
    return !!Object.values(this.entries).find(a => a.current);
  }

  getCurrentEntry(): CacheItem<T, U> {
    return Object.values(this.entries).find(a => a.current)!;
  }

  getByValue(paramValue: string): CacheItem<T, U> | undefined {
    if (!this.hasParam(paramValue)) return undefined;
    return this.entries[paramValue];
  }

  hasIds(): boolean {
    if (this.count === 0) return false;
    const current = this.getCurrent();
    return !!current?.ids.length;
  }

  get count(): number {
    return Object.keys(this.entries).length;
  }

  get keys(): string[] {
    return Object.keys(this.entries);
  }

  get values(): U[] {
    return Object.values(this.entries).map(a => a.params);
  }

  hasParam(param: string): boolean {
    return !!this.entries[param];
  }
}
