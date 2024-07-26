import {HttpErrorResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";

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

export type FormUse = 'create' | 'edit' | 'detail';

export type AdminSections = 'records' | 'sales' | 'animals' | 'males' | 'females' | 'donors' | 'recipients' | 'illegitimates' | 'embryos' | 'semen' | 'straws' | 'relocations' | 'weighings' | 'treatments' | 'feedings';

export type AnimalStatus = { name: 'active', label: 'Activo' } | { name: 'inactive', label: 'Inactivo' };

export type tooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

export type InputTypes = 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'url' | 'tel' | 'search' | 'color';

export type CatalogMode = 'view' | 'select' | 'multiselect' | 'readonly';

export type LoadingTypes = 'current' | 'all' | string;

export type NamingSubjectType = {
  singular: string;
  plural: string;
  singularTitlecase: string;
  pluralTitlecase: string;
  createRoute: string;
  catalogRoute: string;
  title: string;
  undefinedArticle: string;
  definedArticle: string;
  undefinedArticlePlural: string;
  definedArticlePlural: string;
  articleSex: 'masculine' | 'feminine';
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
  error: any;

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
