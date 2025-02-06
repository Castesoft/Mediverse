import { inject, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import { ValidationService } from "src/app/_services/validation.service";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";


/**
 * BaseCatalog is a generic class that provides a base implementation for catalog components.
 * It handles form submission, pagination, and other common functionalities.
 *
 * @template T - The type of the entity.
 * @template U - The type of the entity parameters.
 * @template V - The type of the form group.
 * @template Z - The type of the service helper.
 *
 * @property {ActivatedRoute} route - The activated route instance.
 * @property {Router} router - The router instance.
 * @property {ToastrService} toastr - The toastr service instance.
 * @property {ValidationService} validation - The validation service instance.
 * @property {MatSnackBar} matSnackBar - The material snack bar instance.
 * @property {DevService} dev - The development service instance.
 * @property {IconsService} icons - The icons service instance.
 * @property {Z} service - The service helper instance.
 * @property {V} form - The form group instance.
 * @property {Signal<Pagination | null>} pagination - The pagination signal.
 * @property {Signal<T[]>} list - The list of entities signal.
 * @property {Signal<boolean>} toggle - The toggle signal.
 * @property {Signal<boolean>} fromWrapper - The fromWrapper signal.
 * @property {Subject<void>} ngUnsubscribe - The unsubscribe subject.
 *
 * @constructor
 * @param {new (...args: any[]) => Z} serviceToken - The service token constructor.
 * @param {new (init?: Partial<V>) => V} formInstance - The form instance constructor.
 *
 * @method onSubmit - Submits the form with the given key.
 * @param {string | null} key - The key for form submission.
 */
export default class BaseCatalog<
  T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>,
  Z extends ServiceHelper<T, U, V>
> {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected toastr = inject(ToastrService);
  protected validation = inject(ValidationService);
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(DevService);
  icons = inject(IconsService);

  service: Z;
  form: V;

  toggle = signal(false);
  fromWrapper = signal(false);

  ngUnsubscribe = new Subject<void>();

  constructor(
    serviceToken: new (...args: any[]) => Z,
    formInstance: new (init?: Partial<V>) => V
  ) {
    this.service = inject(serviceToken);
    this.form = new formInstance();
  }

  onSubmit(key: string | null) {
    this.service.submitForm(key, this.form.params as any);
  }

  onParamsChange(params: U) {
    this.form.controls.isSortAscending.patchValue(params.isSortAscending);
    this.form.controls.sort.patchValue(params.sort);

    this.onSubmit(params.key);
  }
}
