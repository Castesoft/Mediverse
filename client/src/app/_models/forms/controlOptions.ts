import { Observable } from "rxjs";
import { SelectOption } from "src/app/_models/base/selectOption";

export class TextareaOptions {
  height: number | null = null;

  constructor(init?: Partial<TextareaOptions>) {
    Object.assign(this, init);
  }
}

export class SelectOptionOptions {
  showCodeSpan = true;
  showDisabled = true;

  constructor(init?: Partial<SelectOptionOptions>) {
    Object.assign(this, init);
  }
}

export class TypeaheadOptions {
  field = "";
  options: string[] = [];
  options$: Observable<SelectOption[]> = new Observable<SelectOption[]>();
  scrollable = 10;
  limit = 20;
  async = false;

  constructor(init?: Partial<TypeaheadOptions>) {
    Object.assign(this, init);
  }
}
