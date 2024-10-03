import {HttpErrorResponse, HttpParams} from "@angular/common/http";
import { inject, InputSignal } from "@angular/core";
import {FormGroup} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SelectOption } from "src/app/_forms/form";
import { EnvService } from "src/app/_services/env.service";
import { IconsService } from "src/app/_services/icons.service";
import { getPaginationHeaders } from "src/app/_utils/util";

export class Column {
  name: string;
  label: string;
  devModeOnly?: boolean;
  options?: ColumnOptions;

  constructor(name: string, label: string, init?: Partial<Column>) {
    Object.assign(this, init);

    this.name = name;
    this.label = label;
  }
}

export class ColumnOptions {
  justify?: "start" | "center" | "end" = "start";
  isNew? = false;
  unit?: Units = undefined;
  devModeOnly?: boolean;

  constructor(init?: Partial<ColumnOptions>) {
    Object.assign(this, init);
  }
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

export type CatalogMode = 'view' | 'select' | 'multiselect' | 'readonly';

export type LoadingTypes = 'current' | 'all' | string;

export type ArticleSex = 'masculine' | 'femenine';

export class NamingSubject {
  subject: string;
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
  baseUrl: string;

  constructor(subject: string, singular: string, plural: string, title: string, articleSex: ArticleSex, baseUrl: string) {
    this.subject = subject.toLowerCase();
    this.singular = singular;
    this.plural = plural;
    this.title = title;
    this.baseUrl = `/${baseUrl}/${this.subject}/`;

    this.singularTitlecase = singular.charAt(0).toUpperCase() + singular.slice(1);
    this.pluralTitlecase = plural.charAt(0).toUpperCase() + plural.slice(1);

    this.createRoute = `${this.baseUrl}create`;
    this.catalogRoute = `${this.baseUrl}`;

    this.undefinedArticle = articleSex === 'masculine' ? 'un' : 'una';
    this.definedArticle = articleSex === 'masculine' ? 'el' : 'la';
    this.undefinedArticlePlural = articleSex === 'masculine' ? 'unos' : 'unas';
    this.definedArticlePlural = articleSex === 'masculine' ? 'los' : 'las';
    this.articleSex = articleSex;
  }

  editRoute(id: number): string {
    return `${this.baseUrl}${id}/edit`;
  }

  detailRoute(id: number): string {
    return `${this.baseUrl}${id}`;
  }
};

export type Section = {
  label: string;
  route: string;
};

export type Sections =
'admin' |
'diseases' |
'substances' |
'consumptionLevels' |
'relativeTypes' |
'colorBlindnesses' |
'maritalStatuses' |
'educationLevels' |
'occupations' |
'utils' |
'reports' |
'events' |
'services' |
'users' |
'medicines' |
'customers' | 'addresses' | 'products' | 'prescriptions' | 'clinics';
;

export type SectionDictionary = {
  [key in Sections]: Section;
};

export const sectionDictionary: SectionDictionary = {
  admin: {
    label: 'Admin',
    route: '/admin',
  },
  occupations: {
    label: 'Ocupaciones',
    route: '/admin/occupations',
  },
  relativeTypes: {
    label: 'Parentescos',
    route: '/admin/relative-types',
  },
  colorBlindnesses: {
    label: 'Daltonismos',
    route: '/admin/color-blindnesses',
  },
  maritalStatuses: {
    label: 'Estados civiles',
    route: '/admin/marital-statuses',
  },
  educationLevels: {
    label: 'Niveles de educación',
    route: '/admin/education-levels',
  },
  substances: {
    label: 'Sustancias',
    route: '/admin/substances',
  },
  consumptionLevels: {
    label: 'Niveles de consumo',
    route: '/admin/consumption-levels',
  },
  diseases: {
    label: 'Enfermedades',
    route: '/admin/diseases',
  },
  addresses: {
    label: 'Direcciones',
    route: '/admin/addresses',
  },
  clinics: {
    label: 'Clínicas',
    route: '/admin/clinics',
  },
  customers: {
    label: 'Clientes',
    route: '/admin/customers',
  },
  events: {
    label: 'Citas',
    route: '/home/events',
  },
  medicines: {
    label: 'Medicamentos',
    route: '/admin/medicines',
  },
  prescriptions: {
    label: 'Recetas',
    route: '/admin/prescriptions',
  },
  products: {
    label: 'Productos',
    route: '/admin/products',
  },
  reports: {
    label: 'Reportes',
    route: '/home/reports',
  },
  services: {
    label: 'Servicios',
    route: '/home/services',
  },
  users: {
    label: 'Usuarios',
    route: '/admin/users',
  },
  utils: {
    label: 'Utilidades',
    route: '/home/utils',
  },
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

export class MedicineType {
  name = '';
  code = '';

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}

export class Entity {
  id: number = 0;
  createdAt: Date = new Date();
  name: string = "";
  description: string = "";
  isSelected: boolean = false;
  visible: boolean = true;
  enabled: boolean = true;
}

export type Units = "kg" | "días" | "ha";

export class DateRange {

  constructor(init?: Partial<DateRange>) {
    Object.assign(this, init);
  }

  start: Date | null = null;
  end: Date | null = null;
}

export interface IParams {
  get httpParams(): HttpParams;
}

export class EntityParams<T> {
  pageNumber = 1;
  pageSize = 10;
  search = "";
  sort = new SelectOption({ name: "ID", code: "id" });
  isSortAscending = true;
  dateRange: DateRange = new DateRange();
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  name = "";
  description = "";
  key: string;
  id = 0;

  constructor(key: string) {
    this.key = key;
  }

  protected value<U extends Entity>(template: { [K in keyof U]: U[K] }) {
    const value = new EntityParams<U>(this.key);

    for (const prop in template) {
      (value as any)[prop] = (this as any)[prop];
    }

    return value;
  }

  protected getHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.search) params = params.append("search", this.search);
    // if (this.sort) params = params.append("sort", this.sort);
    if (typeof this.isSortAscending !== "undefined") params = params.append("isSortAscending", this.isSortAscending);
    if (this.dateFrom) params = params.append("dateFrom", this.dateFrom.toISOString());
    if (this.dateTo) params = params.append("dateTo", this.dateTo.toISOString());
    if (this.name) params = params.append("name", this.name);
    if (this.description) params = params.append("description", this.description);

    return params;
  }

  updateFromPartial(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  get paramsValue(): string {
    return Object.keys(this).map(key => {
      const value = (this as any)[key];
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "string") {
          return value.join(",");
        } else if (value.length > 0 && typeof value[0] === "object" && "key" in value[0] && "value" in value[0]) {
          return (value as SelectOption[]).map(item => item.code).join(",");
        }
      }
      return value;
    }).join("_");
  }
}

export type CellsOf<T> = {
  [K in keyof T]: TableCellItem<T[K], K>;
};

export type PartialCellsOf<T> = CellsOf<Partial<T>>;

export type TableCells = "string" | "number" | "boolean" | "date" | "code" | "currency";

export class TableRow<T extends Entity> {
  items: CellsOf<T>;

  constructor(entity: T) {
    this.items = {} as CellsOf<T>;

    for (const key of Object.keys(entity) as Array<keyof T>) {
      this.items[key] = new TableCellItem(key, "string");
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

export class TableCellItem<T, TKey extends keyof any> {
  key: TKey;
  type: TableCells;
  justification: TableCellItemJustification = "start";
  isLink = false;
  baseUrl?: string;
  unit?: Units;

  constructor(key: TKey, type: TableCells, init?: Partial<TableCellItem<T, TKey>>) {
    Object.assign(this, init);

    this.key = key;
    this.type = type;

    switch (typeof type) {
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
