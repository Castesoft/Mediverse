import { inject, signal } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Entity } from "src/app/_models/base/entity";
import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Sections } from "src/app/_models/sections/sectionTypes";


/**
 * A base class for route details, providing common properties and methods for handling routing and state management.
 *
 * @template T - The type of the entity.
 *
 * @property {Router} router - The router instance for navigation.
 * @property {ActivatedRoute} route - The activated route instance for accessing route parameters.
 * @property {Signal<T | null>} item - A signal holding the current entity item.
 * @property {Signal<number | null>} id - A signal holding the current entity ID.
 * @property {Signal<FormUse>} use - A signal indicating the form usage type (e.g., 'detail', 'create').
 * @property {Signal<View>} view - A signal indicating the view type (e.g., 'page').
 * @property {Signal<string | null>} key - A signal holding a key value.
 * @property {Signal<string | null>} label - A signal holding a label value.
 * @property {Signal<string | null>} title - A signal holding a title value.
 * @property {Signal<Sections>} section - A signal indicating the section type (e.g., 'admin').
 *
 * @constructor
 * @param {Sections} section - The section type to initialize.
 * @param {FormUse} use - The form usage type to initialize.
 */
export default class BaseRouteDetail<T extends Entity> {
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

  constructor(
    section: Sections,
    use: FormUse,
    options?: { id?: number; key?: string; label?: string; title?: string; }
  ) {
    this.use.set(use);
    this.section.set(section);

    if (use === 'create') {
      this.label.set('Crear');
    }

    if (options !== undefined) {
      if (options.id !== undefined) this.id.set(options.id);
      if (options.key !== undefined) this.key.set(options.key);
      if (options.label !== undefined) this.label.set(options.label);
      if (options.title !== undefined) this.title.set(options.title);
    }
  }
}
