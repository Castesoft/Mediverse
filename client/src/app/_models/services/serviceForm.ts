import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Service } from "src/app/_models/services/service";
import { serviceFormInfo } from "src/app/_models/services/serviceConstants";

export class ServiceForm extends FormGroup2<Service> {
  constructor() {
    super(Service, new Service(), serviceFormInfo);
  }
}
