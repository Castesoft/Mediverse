import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Entity } from "src/app/_models/base/entity";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { EnvService } from "src/app/_services/env.service";

export class FormComponent2<T, U extends Entity | object, V extends FormGroup2<U>> {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(DevService);

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
