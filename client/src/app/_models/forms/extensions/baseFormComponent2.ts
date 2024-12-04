import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Entity } from "src/app/_models/base/entity";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { DevService } from 'src/app/_services/dev.service';
import { ValidationService } from "src/app/_services/validation.service";
import { IconsService } from "src/app/_services/icons.service";


/**
 * BaseFormComponent2 is a generic base class for form components.
 * It provides common services and utilities for form handling and navigation.
 *
 * @template T - The type of the service to be injected.
 * @template U - The type of the entity or object used in the form.
 * @template V - The type of the form group extending FormGroup2.
 *
 * @property {ActivatedRoute} route - The activated route service.
 * @property {Router} router - The router service.
 * @property {ToastrService} toastr - The toastr service for notifications.
 * @property {FormsService} formsService - The forms service for form operations.
 * @property {MatSnackBar} matSnackBar - The material snack bar service for notifications.
 * @property {EnvService} dev - The environment service.
 * @property {IconsService} icons - The icons service.
 * @property {T} service - The injected service instance.
 * @property {V} form - The form group instance.
 *
 * @constructor
 * @param {new (...args: any[]) => T} serviceToken - The constructor for the service to be injected.
 * @param {new (...args: any[]) => V} formConstructor - The constructor for the form group.
 */
export class BaseFormComponent2<T, U extends Entity | object, V extends FormGroup2<U>> {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected toastr = inject(ToastrService);
  protected validation = inject(ValidationService);
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(DevService);
  icons = inject(IconsService);

  service: T;
  form: V;

  constructor(
    serviceToken: new (...args: any[]) => T,
    formConstructor: new (...args: any[]) => V
  ) {
    this.service = inject(serviceToken);
    this.form = new formConstructor();
  }
}
