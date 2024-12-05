import { EntityParams } from "src/app/_models/base/entityParams";
import { MaritalStatus } from "src/app/_models/maritalStatuses/maritalStatus";


export class MaritalStatusParams extends EntityParams<MaritalStatus> {
  constructor(key: string | null) {
    super(key);
  }
}
