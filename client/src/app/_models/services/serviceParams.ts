import { EntityParams } from "src/app/_models/base/entityParams";
import { Service } from "src/app/_models/services/service";

export class ServiceParams extends EntityParams<Service> {
  constructor(key: string | null) {
    super(key);
  }
}
