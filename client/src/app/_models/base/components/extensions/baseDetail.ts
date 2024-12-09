import { inject } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";


/**
 * A generic base class for handling detailed views of entities.
 *
 * @template T - The type of the entity.
 * @template U - The type of the entity parameters.
 * @template V - The type of the form group.
 * @template Z - The type of the service helper.
 */
export default class BaseDetail<
  T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>,
  Z extends ServiceHelper<T, U, V>
> {
  service: Z;

  constructor(
    serviceToken: new (...args: any[]) => Z
  ) {
    this.service = inject(serviceToken);
  }

}
