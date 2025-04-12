import { Options } from "./options";


export class SelectOption {
  id: number = 0;
  code: string = '';
  name: string = '';
  enabled: boolean = true;
  visible: boolean = true;
  options: Options | null = null;
  isActive?: boolean = true; 
  
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
