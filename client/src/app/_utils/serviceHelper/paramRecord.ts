import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";

export class ParamRecord<T extends Entity, U extends EntityParams<U>> {
  entries: Record<string, U> = {};

  constructor(private paramConstructor: new (key: string) => U) {}
  // constructor(private paramConstructor: new (key: string, props?: { [K in keyof U]?: U[K] }) => U) {}

  add(key: string): ParamRecord<T, U> {
    if (this.hasKey(key)) return this;
    const params = new this.paramConstructor(key);
    this.entries[params.paramsValue] = params;
    return this;
  }

  set(key: string, value: U): ParamRecord<T, U> {
    this.entries[key] = value;
    return this;
  }

  get count(): number {
    return Object.keys(this.entries).length;
  }

  get keys(): string[] {
    return Object.keys(this.entries);
  }

  get values(): U[] {
    return Object.values(this.entries);
  }

  hasKey(key: string): boolean {
    return !!this.entries[key];
  }

  reset(key: string): ParamRecord<T, U> {
    const params = new this.paramConstructor(key)
    this.entries[params.paramsValue] = params;
    return this;
  }
}
