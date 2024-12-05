import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { serviceFiltersFormInfo } from "src/app/_models/services/serviceConstants";
import { ServiceParams } from "src/app/_models/services/serviceParams";

export class ServiceFiltersForm extends FormGroup2<ServiceParams> {
  constructor() {
    super(ServiceParams as any, new ServiceParams(createId()), serviceFiltersFormInfo);
  }
}
