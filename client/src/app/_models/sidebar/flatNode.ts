import { Role } from "src/app/_models/sidebar/baseNode";

export class FlatNode {
  expandable: boolean = false;
  name: string | null = null;
  route: string | null = null;
  isDev: boolean = false;
  roles: Role[] = [];
  level: number = 0;

  constructor(init?: Partial<FlatNode>) {
    Object.assign(this, init);
  }
}
