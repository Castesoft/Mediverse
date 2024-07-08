export interface Column {
    name: string;
    label: string;
    devModeOnly?: boolean;
    options?: ColumnOptions;
  }
  
  export class ColumnOptions {
    justify?: 'start' | 'center' | 'end' = 'start';
    isNew?: boolean = false;
  
    constructor(justify: 'start' | 'center' | 'end') {
      this.justify = justify;
    }
  }

  export class SortOptions {
    sort: string;
    isSortAscending: boolean;
  
    constructor(sort: string, isSortAscending: boolean) {
      this.sort = sort;
      this.isSortAscending = isSortAscending;
    }
  }

export interface MultiselectOption {
    value: number | string;
    name: string;
  }
  
  export type FormUse = 'create' | 'edit' | 'detail';
  
  export type AdminSections = 'records' | 'sales' | 'animals' | 'males' | 'females' | 'donors' | 'recipients' | 'illegitimates' | 'embryos' | 'semen' | 'straws';
  
  export type AnimalStatus = { name: 'active', label: 'Activo' } | { name: 'inactive', label: 'Inactivo' };
  
  export type tooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';
  
  export type InputTypes = 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'url' | 'tel' | 'search' | 'color';
  
  export type CatalogMode = 'view' | 'select' | 'multiselect' | 'readonly';
  