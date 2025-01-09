export type Role = 'Admin' | 'User';

export class BaseNode {
  name: string | null = null;
  route: string | null = null;
  isDev: boolean = false;
  children: BaseNode[] = [];
  roles: Role[] = [];

  constructor(init?: Partial<BaseNode>) {
    Object.assign(this, init);
  }
}
