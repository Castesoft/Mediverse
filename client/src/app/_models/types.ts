import {HttpErrorResponse} from "@angular/common/http";
import { inject, InputSignal } from "@angular/core";
import {FormGroup} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Entity } from "src/app/_forms/form";
import { EnvService } from "src/app/_services/env.service";
import { IconsService } from "src/app/_services/icons.service";

export interface Column {
    name: string;
    label: string;
    devModeOnly?: boolean;
    options?: ColumnOptions;
  }

export interface MultiselectOption {
  value: number | string;
  name: string;
}

export interface TypeaheadComplexOption {
  name: string;
  value: any;
}

export class DropdownMenu {
  title: string;
  items: DropdownMenuItem[];
  isVisible: boolean;
  x: number;
  y: number;

  constructor(
    title: string,
    items: DropdownMenuItem[],
    isVisible: boolean,
    x: number,
    y: number
  ) {
    this.title = title;
    this.items = items;
    this.isVisible = isVisible;
    this.x = x;
    this.y = y;
  }
}

export interface BreedingBullData {
  key: string;
  doses: number[];
}

export class DropdownMenuItem {
  label: string;
  type: DropdownMenuItemType = 'link';
  url?: string;

  constructor(label: string, type: DropdownMenuItemType, url?: string) {
    this.label = label;
    this.type = type;
    this.url = url;
  }
}

export type DropdownMenuItemType = 'link' | 'divider' | 'header' | 'button';

export type DropdownMenuProps = {
  x: number;
  y: number;
  isVisible: boolean;
  event: MouseEvent;
};

export interface Column {
  name: string;
  label: string;
  devModeOnly?: boolean;
  options?: ColumnOptions;
}

export class ColumnOptions {
  justify?: 'start' | 'center' | 'end' = 'start';
  isNew?= false;

  constructor(justify: 'start' | 'center' | 'end') {
    this.justify = justify;
  }
}

export type Sex = 'male' | 'female' | 'both';

export type SexFull = Sex | 'Donadora' | 'Semental' | 'Macho' | 'Hembra';

export class SortOptions {
  sort?: string;
  isSortAscending: boolean;

  constructor(sort: string | undefined, isSortAscending = false) {
    this.sort = sort;
    this.isSortAscending = isSortAscending;
  }
}

export interface MultiselectOption {
  value: number | string;
  name: string;
}

export type FormUse = 'create' | 'edit' | 'detail' | 'filter';

export type AdminSections = 'records' | 'sales' | 'animals' | 'males' | 'females' | 'donors' | 'recipients' | 'illegitimates' | 'embryos' | 'semen' | 'straws' | 'relocations' | 'weighings' | 'treatments' | 'feedings';

export type AnimalStatus = { name: 'active', label: 'Activo' } | { name: 'inactive', label: 'Inactivo' };

export type tooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

export type InputTypes = 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'url' | 'tel' | 'search' | 'color' | 'file';

export type CatalogMode = 'view' | 'select' | 'multiselect' | 'readonly';

export type LoadingTypes = 'current' | 'all' | string;

export type ArticleSex = 'masculine' | 'femenine';

export class NamingSubject {
  singular: string;
  plural: string;
  articleSex: ArticleSex;
  title: string;

  singularTitlecase: string;
  pluralTitlecase: string;

  createRoute: string;
  catalogRoute: string;

  undefinedArticle: string;
  definedArticle: string;
  undefinedArticlePlural: string;
  definedArticlePlural: string;

  constructor(singular: string, plural: string, title: string, articleSex: ArticleSex, baseUrl: string) {
    this.singular = singular;
    this.plural = plural;
    this.title = title;

    this.singularTitlecase = singular.charAt(0).toUpperCase() + singular.slice(1);
    this.pluralTitlecase = plural.charAt(0).toUpperCase() + plural.slice(1);

    this.createRoute = `${baseUrl}/${singular.toLowerCase()}/create`;
    this.catalogRoute = `${baseUrl}/${plural.toLowerCase()}`;

    this.undefinedArticle = articleSex === 'masculine' ? 'un' : 'una';
    this.definedArticle = articleSex === 'masculine' ? 'el' : 'la';
    this.undefinedArticlePlural = articleSex === 'masculine' ? 'unos' : 'unas';
    this.definedArticlePlural = articleSex === 'masculine' ? 'los' : 'las';
    this.articleSex = articleSex;
  }
};

export type Section = {
  label: string;
  route: string;
};

export type Sections = 'admin' | 'maintenance' | 'utils' | 'reports' | 'codes' | 'events'
  | 'males' | 'services' | 'users' | 'donors' | 'medicines' | 'customers' | 'foods' | 'irons' | 'relocations' | 'sales' | 'treatments' | 'addresses' | 'products' | 'prescriptions' | 'records' | 'animals' | 'feedings' | 'semens' | 'clinics';
;

export type SectionDictionary = {
  [key in Sections]: Section;
};

export type View = 'page' | 'modal' | 'inline';

export interface Identifiable {
  id: number | string;
}

export interface BaseForm {
  group: FormGroup;
  id: string;
  errors: string[];
  submitted: boolean;
  validation: boolean;
}

export type Role = 'Admin' | 'Doctor' | 'Patient' | 'Staff' | 'Nurse';

export type Errors = 'BadRequest' | 'ValidationError';

export class BadRequest {
  type: Errors;
  message?: string;
  validationErrors: string[] = [];
  error: HttpErrorResponse;

  constructor(error: HttpErrorResponse) {
    this.error = error;
    this.message = error.error;
    if (error.error.errors) {
      this.type = 'ValidationError';
      const modalStateErrors = [];
      for (const key in error.error.errors) {
        if (error.error.errors[key]) {
          modalStateErrors.push(error.error.errors[key])
        }
      }
      this.validationErrors = modalStateErrors.flat();
    } else {
      this.type = 'BadRequest';
    }
  }
}

export type FormControlStyles = 'solid' | 'normal';

export type Addresses = 'Account' | 'Clinic';

export class TableMenu<T> {
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(EnvService);
  icons = inject(IconsService);

  service: T;

  constructor(serviceToken: new (...args: any[]) => T) {
    this.service = inject(serviceToken);
  }
}

export interface ITableMenu<T extends Entity> {
  item: InputSignal<T>;
  key: InputSignal<string>;
}

export class TableRow<T extends Entity> {
  items: { [K in keyof T]: TableCellItem<T[K], K> };

  constructor(entity: T) {
    this.items = {} as { [K in keyof T]: TableCellItem<T[K], K> };

    for (const key of Object.keys(entity) as Array<keyof T>) {
      this.items[key] = new TableCellItem(key, entity[key]);
    }
  }

  getItems(keys?: (keyof T)[]): { item: TableCellItem<T[keyof T], keyof T> }[] {
    if (!keys) {
      return Object.keys(this.items).map(key => {
        return { item: this.items[key as keyof T] };
      });
    } else {
      return keys.map(key => {
        return { item: this.items[key] };
      });
    }
  }
}

export class TableCellItem<TValue, TKey extends keyof any> {
  key: TKey;
  type: string;
  justification: TableCellItemJustification = "start";
  isLink = false;
  url?: string;

  constructor(key: TKey, type: TValue) {
    this.key = key;
    this.type = typeof type;

    switch(typeof type) {
      case "string":
        this.justification = "start";
        break;
      case "number":
        this.justification = "end";
        break;
      case "boolean":
        this.justification = "center";
        break;
      default:
        this.justification = "start";
        break;
    }
  }
}

export type TableCellItemJustification = "start" | "center" | "end";

export class MedicineType {
  name = '';
  code = '';

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}
