import { inject, ModelSignal, signal, Type } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, ResolveFn, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { CatalogMode, View } from "src/app/_models/base/types";
import { BadRequest } from "src/app/_models/forms/error";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Sections } from "src/app/_models/sections/sectionTypes";
import { DevService } from "src/app/_services/dev.service";
import { ValidationService } from "src/app/_services/validation.service";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

export type SubmitOptions = {
  use: FormUse;
  value: any;
  id: number;
}

export class BaseForm<
T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>, W extends FormGroup2<T>,
Z extends ServiceHelper<T, U, V>
> {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected validation = inject(ValidationService);
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(DevService);

  service: Z;
  form: W;

  constructor(
    serviceToken: new (...args: any[]) => Z,
    formInstance: new (init?: Partial<W>) => W,
  ) {
    this.service = inject(serviceToken);
    this.form = new formInstance();
  }

  onSubmit(view: ModelSignal<View>, use: ModelSignal<FormUse>, options?: Partial<SubmitOptions>) {
    console.log('onSubmit', view(), use(), options, this.form);

    this.form.submitted = true;
    switch(this.form.use) {
      case 'create':
        this.create(view, use, options);
        break;
      case 'edit':
        this.update(view, use, options);
        break;
    }
  }

  create(view: ModelSignal<View>, use: ModelSignal<FormUse>, options?: Partial<SubmitOptions>) {
    if (this.form.submittable) {
      this.service.create(this.form, view()).subscribe({
        next: response => {
          this.form.onSuccess(response);

          const _use = options?.use;

          if (_use !== undefined) {
            this.form.use = _use;
            use.set(_use);
          } else {
            this.form.use = 'detail';
            use.set('detail');
          }
        },
        error: (error: BadRequest) => this.form.error = error
      })
    }
  }

  update(view: ModelSignal<View>, use: ModelSignal<FormUse>, options?: Partial<SubmitOptions>) {
    if (this.form.submittable) {
      this.service.update(this.form, view()).subscribe({
        next: response => {
          this.form.onSuccess(response);

          const _use = options?.use;

          if (_use !== undefined) {
            this.form.use = _use;
            use.set(_use);
          } else {
            this.form.use = 'detail';
            use.set('detail');
          }
        },
        error: (error: BadRequest) => this.form.error = error
      })
    }

  }

  onCancel(view: ModelSignal<View>, use: ModelSignal<FormUse>) {
    this.form.submitted = false;
    if (use() === 'create') {
      this.form.reset();
    } else if (use() === 'edit') {
      this.form.reset();
    }
  }
}

export class BaseDetail<
T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>,
Z extends ServiceHelper<T, U, V>
> {
  service: Z;

  constructor(
    serviceToken: new (...args: any[]) => Z,
  ) {
    this.service = inject(serviceToken);
  }

}

export class BaseCatalog<
  T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>,
  Z extends ServiceHelper<T, U, V>
> {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected validation = inject(ValidationService);
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(DevService);

  service: Z;
  form: V;

  pagination = signal<Pagination | null>(null);
  list = signal<T[]>([]);
  toggle = signal(false);
  fromWrapper = signal(false);

  ngUnsubscribe = new Subject<void>();

  constructor(
    serviceToken: new (...args: any[]) => Z,
    formInstance: new (init?: Partial<V>) => V,
  ) {
    this.service = inject(serviceToken);
    this.form = new formInstance();
  }

  onSubmit(key: string | null) {
    this.service.submitForm(key, this.form.params as any);
  }
}

export class BaseRouteCatalog<
  T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>,
  Z extends ServiceHelper<T, U, V>
> {
  router = inject(Router);
  validation = inject(ValidationService);
  service: Z;

  item = signal(null);
  params = signal<U>(new EntityParams<U>(this.router.url) as U);
  section = signal<Sections>('admin');
  label = signal<string | null>(null);
  key = signal<string>(this.router.url);
  view = signal<View>('page');
  mode = signal<CatalogMode>('view');

  constructor(
    serviceToken: new (...args: any[]) => Z,
    section: Sections,
  ) {
    this.service = inject(serviceToken);
    this.section.set(section);
    this.label.set(this.service.dictionary.title);
  }
}

export class BaseRouteDetail<T extends Entity> {
  router = inject(Router);
  route = inject(ActivatedRoute);

  item = signal<T | null>(null);
  id = signal<number | null>(null);
  use = signal<FormUse>('detail');
  view = signal<View>('page');
  key = signal<string | null>(null);
  label = signal<string | null>(null);
  title = signal<string | null>(null);
  section = signal<Sections>('admin');

  constructor(section: Sections, use: FormUse) {
    this.use.set(use);
    this.section.set(section);

    if (use === 'create') {
      this.label.set('Crear');
    }
  }
}

export function createItemResolver<T>(
  serviceClass: Type<{ getById: (id: number) => Observable<T> }>
): ResolveFn<T | null> {
  return (route, state) => {
    const service = inject(serviceClass);
    const id = +route.paramMap.get('id')!;
    return service.getById(id);
  };
}
