
export class SortOptions {
  sort: string;
  isSortAscending: boolean;

  constructor(sort: string, isSortAscending: boolean) {
    this.sort = sort;
    this.isSortAscending = isSortAscending;
  }
}
