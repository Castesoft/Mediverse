import { EntityParams } from "src/app/_models/base/entityParams";
import { RelativeType } from "src/app/_models/relativeTypes/relativeType";


export class RelativeTypeParams extends EntityParams<RelativeType> {
  constructor(key: string | null) {
    super(key);
  }
}
