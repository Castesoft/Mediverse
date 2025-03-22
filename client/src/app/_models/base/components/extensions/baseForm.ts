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
import { SubmitOptions } from "src/app/_utils/serviceHelper/types/submitOptions";


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

  /**
   * Handles form submission based on the form's use case (create or edit).
   *
   * @param view - A signal representing the current view model.
   * @param use - A signal representing the form use case.
   * @param options - Additional options for the submission.
   */
  onSubmit(view: ModelSignal<View>, use: ModelSignal<FormUse>, options?: Partial<SubmitOptions>) {
    this.form.submitted = true;
    switch (this.form.use) {
      case 'create':
        this.create(view, use, options);
        break;
      case 'edit':
        this.update(view, use, options);
        break;
    }
  }

  /**
   * Handles the creation of a new entity.
   *
   * @param view - A signal representing the current view model.
   * @param use - A signal representing the form use case.
   * @param options - Additional options for the submission.
   */
  create(view: ModelSignal<View>, use: ModelSignal<FormUse>, options?: Partial<SubmitOptions>) {
    const id: number | null = this.form.controls.id.getRawValue();

    if (id !== null && options !== undefined && options.id === undefined) {
      options = { ...options, id: id };
    }

    if (this.form.submittable) {
      this.service.create(this.form, options).subscribe({
        next: response => {
          this.form.onSuccess(response);

          const _use: FormUse | undefined = options?.use;

          if (_use !== undefined) {
            this.form.use = _use;
            use.set(_use);
          } else {
            this.form.use = FormUse.DETAIL;
            use.set(FormUse.DETAIL);
          }
        },
        error: (error: BadRequest) => this.form.error = error
      })
    }
  }

  /**
   * Handles the updating of an existing entity.
   *
   * @param view - A signal representing the current view model.
   * @param use - A signal representing the form use case.
   * @param options - Additional options for the submission.
   */
  update(view: ModelSignal<View>, use: ModelSignal<FormUse>, options?: Partial<SubmitOptions>) {
    const id: number | null = this.form.controls.id.getRawValue();

    if (id !== null && options?.id === undefined) {
      options = { ...options, id: id };
    }

    console.log(options);

    if (this.form.submittable) {
      this.service.update(this.form, options).subscribe({
        next: response => {
          this.form.onSuccess(response);

          const _use: FormUse | undefined = options?.use;

          if (_use !== undefined) {
            this.form.use = _use;
            use.set(_use);
          } else {
            this.form.use = FormUse.DETAIL;
            use.set(FormUse.DETAIL);
          }
        },
        error: (error: BadRequest) => this.form.error = error
      })
    }
  }

  /**
   * Handles form cancellation and resets the form based on the use case.
   *
   * @param view - A signal representing the current view model.
   * @param use - A signal representing the form use case.
   */
  onCancel(view: ModelSignal<View>, use: ModelSignal<FormUse>) {
    this.form.submitted = false;
    if (use() === 'create') {
      this.form.reset();
    } else if (use() === 'edit') {
      this.form.reset();
    }
  }
}
