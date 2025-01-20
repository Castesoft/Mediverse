import { inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { View, CatalogMode } from "src/app/_models/base/types";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Sections } from "src/app/_models/sections/sectionTypes";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { ValidationService } from "src/app/_services/validation.service";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";


/**
 * BaseRouteCatalog is a generic class that provides a base implementation for managing route catalogs.
 * It includes dependency injection for various services and signals for managing state.
 *
 * @template T - The type of the entity.
 * @template U - The type of the entity parameters.
 * @template V - The type of the form group.
 * @template Z - The type of the service helper.
 *
 * @property {Router} router - Injected Angular Router service.
 * @property {ValidationService} validation - Injected validation service.
 * @property {CompactTableService} compact - Injected compact table service.
 * @property {Z} service - The service helper instance.
 * @property {Signal<T | null>} item - Signal for the current item.
 * @property {Signal<U>} params - Signal for the entity parameters.
 * @property {Signal<Sections>} section - Signal for the current section.
 * @property {Signal<string | null>} label - Signal for the label.
 * @property {Signal<string>} key - Signal for the current route URL.
 * @property {Signal<View>} view - Signal for the current view.
 * @property {Signal<CatalogMode>} mode - Signal for the current catalog mode.
 *
 * @constructor
 * @param {new (...args: any[]) => Z} serviceToken - The constructor for the service helper.
 * @param {Sections} section - The initial section.
 */
export default class BaseRouteCatalog<
  T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>,
  Z extends ServiceHelper<T, U, V>
> {
  router = inject(Router);
  validation = inject(ValidationService);
  compact = inject(CompactTableService);
  service: Z;

  item = signal<T | null>(null);
  params = signal<U>(new EntityParams<U>(this.router.url) as U);
  section = signal<Sections>('admin');
  label = signal<string | null>(null);
  key = signal<string>(this.router.url);
  view = signal<View>('page');
  mode = signal<CatalogMode>('view');

  constructor(
    serviceToken: new (...args: any[]) => Z,
    section: Sections,
    options?: { key?: string; view?: View; mode?: CatalogMode; item?: T; label?: string; }
  ) {
    this.service = inject(serviceToken);
    this.section.set(section);
    this.label.set(this.service.dictionary.title);

    if (options !== undefined) {
      if (options.key !== undefined) {
        this.key.set(options.key);
        this.params.set(new EntityParams<U>(options.key) as U);
      }
      if (options.view !== undefined) this.view.set(options.view);
      if (options.mode !== undefined) this.mode.set(options.mode);
      if (options.item !== undefined) this.item.set(options.item);
      if (options.label !== undefined) this.label.set(options.label);
    }
  }
}
