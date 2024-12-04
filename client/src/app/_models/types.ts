export interface MultiselectOption {
  value: number | string;
  name: string;
}

export interface TypeaheadComplexOption {
  name: string;
  value: any;
}

export type Sex = 'male' | 'female' | 'both';

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

export type Role = 'Admin' | 'Doctor' | 'Patient' | 'Staff' | 'Nurse';

export class MedicineType {
  name = '';
  code = '';

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}
