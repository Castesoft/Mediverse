import { EntityParams } from "src/app/_models/base/entityParams";
import { Substance } from "src/app/_models/substances/substance";


export class SubstanceParams extends EntityParams<Substance> {
  constructor(key: string | null) {
    super(key);
  }
}
