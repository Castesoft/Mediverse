export interface ITypeaheadOptions {
  field: string;
  options: string[];
  scrollable: number;
  limit: number;
  async: boolean;
  donorOptions: DonorOptions;
}

export class TypeaheadOptions implements ITypeaheadOptions {
  field = '';
  options: string[] = [];
  scrollable = 10;
  limit = 20;
  async = false;
  donorOptions = new DonorOptions();

  constructor(opts?: ITypeaheadOptions) {
    if (opts) {
      this.field = opts.field ? opts.field : '';
      this.options = opts.options ? opts.options : [];
      this.scrollable = opts.scrollable ? opts.scrollable : 10;
      this.limit = opts.limit ? opts.limit : 20;
      this.async = opts.async ? opts.async : false;
      this.donorOptions = opts.donorOptions
        ? opts.donorOptions
        : new DonorOptions();
    }
  }
}
export class DonorOptions {
  key = "";
  
  constructor(opts?: { key?: string }) {
    this.key = opts?.key ? opts.key : "";
  }
}

