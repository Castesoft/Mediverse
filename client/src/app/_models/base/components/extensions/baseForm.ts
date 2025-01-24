import { inject, ModelSignal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { View } from "src/app/_models/base/types";
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import { ValidationService } from "src/app/_services/validation.service";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";


/**
 * BaseForm is a generic class that provides a foundation for form handling in an Angular application.
 * It includes methods for form submission, creation, updating, and cancellation.
 *
 * @template T - The type of the entity.
 * @template U - The type of the entity parameters.
 * @template V - The type of the form group for entity parameters.
 * @template W - The type of the form group for the entity.
 * @template Z - The type of the service helper.
 */
export default class BaseForm<
  T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>, W extends FormGroup2<T>,
  Z extends ServiceHelper<T, U, V>
> {
  /**
   * Injected Angular ActivatedRoute service.
   */
  protected route = inject(ActivatedRoute);

  /**
   * Injected Angular Router service.
   */
  protected router = inject(Router);

  /**
   * Injected ToastrService for displaying toast notifications.
   */
  protected toastr = inject(ToastrService);

  /**
   * Injected ValidationService for form validation.
   */
  protected validation = inject(ValidationService);

  /**
   * Injected MatSnackBar for displaying snack bar notifications.
   */
  protected matSnackBar = inject(MatSnackBar);

  /**
   * Injected DevService for development utilities.
   */
  dev = inject(DevService);

  /**
   * Injected IconsService for managing icons.
   */
  icons = inject(IconsService);

  /**
   * The service helper instance.
   */
  service: Z;

  /**
   * The form group instance.
   */
  form: W;

  /**
   * Constructs a new instance of BaseForm.
   *
   * @param serviceToken - The service token for the service helper.
   * @param formInstance - The form instance for the form group.
   */
  constructor(
    serviceToken: new (...args: any[]) => Z,
    formInstance: new (init?: Partial<W>) => W
  ) {
    this.service = inject(serviceToken);
    this.form = new formInstance();
  }
}
