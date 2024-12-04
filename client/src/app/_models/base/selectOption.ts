import { Options } from "./options";


export class SelectOption {
  id = 0;
  code: string = '';
  name: string = '';
  enabled: boolean = true;
  visible: boolean = true;
  propiedad = null;
  options: Options | null = null;

  constructor(init?: Partial<SelectOption>, obj?: any) {
    Object.assign(this, init);

    if (!this.code) {
      this.code = this.name;
    }

    if (!this.name) {
      this.name = this.code;
    }

    if (obj) {
      this.id = obj.id;
      this.code = obj.code;
      this.name = obj.name;
    }
  }
}
