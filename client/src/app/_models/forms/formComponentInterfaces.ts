import { InputSignal, ModelSignal } from "@angular/core";
import { Form } from "./deprecated/form";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { View } from "../base/types";
import { CatalogMode } from "../base/types";
import { FormUse } from "./formTypes";

export interface FormActions<T extends Entity, V extends Form<T>> {
  item: ModelSignal<T | undefined>;
  use: InputSignal<FormUse>;
  view: InputSignal<View>;
  key: InputSignal<string>;

  form: V;

  onSubmit(): void;

  onCancel(): void;

  fillForm(): void;

  create(): void;

  update(item: T): void;
}

/**
 * Interface representing a filter form with various properties and methods.
 *
 * @template T - The type of the item, which extends either Entity or object.
 */
export interface IFilterForm<T extends Entity | object> {
  /**
   * The item associated with the form.
   */
  item: ModelSignal<T | null>;

  /**
   * The usage context of the form.
   */
  use: ModelSignal<FormUse>;

  /**
   * The view context of the form.
   */
  view: ModelSignal<View>;

  /**
   * The key associated with the form.
   */
  key: ModelSignal<string>;

  /**
   * The role associated with the form.
   */
  role: ModelSignal<string>;

  /**
   * The unique identifier of the form.
   */
  formId: ModelSignal<string>;

  /**
   * The mode of the catalog associated with the form.
   */
  mode: ModelSignal<CatalogMode>;

  /**
   * A boolean signal to toggle the form state.
   */
  toggle: ModelSignal<boolean>;

  /**
   * Method to handle form submission.
   */
  onSubmit(): void;

  /**
   * Method to handle form cancellation.
   */
  onCancel(): void;
}

export interface FilterFormGroupActions<T extends Entity | object, U extends EntityParams<U>, V extends FormGroup2<U>> {
  item: ModelSignal<T | null>;
  use: ModelSignal<FormUse>;
  view: ModelSignal<View>;
  key: ModelSignal<string>;
  mode: ModelSignal<CatalogMode>;

  params?: U;
  form: V;

  onSubmit(): void;

  onCancel(): void;
}

export interface FilterFormActions<T extends Entity, U extends EntityParams<U>, V extends Form<U>> {
  item: ModelSignal<T | null>;
  use: InputSignal<FormUse>;
  view: InputSignal<View>;
  key: InputSignal<string>;
  mode: InputSignal<CatalogMode>;

  params?: U;
  form: V;

  onSubmit(): void;

  onCancel(): void;
}

/**
 * Interface representing actions that can be performed on a form group.
 *
 * @template T - The type of the entity.
 * @template V - The type of the form group.
 */
export interface FormGroupActions<T extends Entity, V extends FormGroup2<T>> {
  /**
   * The item being managed by the form group.
   */
  item: ModelSignal<T | null>;

  /**
   * The signal representing the use of the model.
   */
  use: ModelSignal<FormUse>;

  /**
   * The signal representing the view of the form.
   */
  view: ModelSignal<View>;

  /**
   * The signal representing the key of the form.
   */
  key: ModelSignal<string>;

  /**
   * The form group instance.
   */
  form: V;

  /**
   * Method to be called when the form is submitted.
   */
  onSubmit(): void;

  /**
   * Method to be called when the form submission is cancelled.
   */
  onCancel(): void;

  /**
   * Method to create a new item.
   */
  create(): void;

  /**
   * Method to update an existing item.
   *
   * @param item - The item to be updated.
   */
  update(item: T): void;
}

export interface FormInputSignals<T extends Entity> {
  item: ModelSignal<T | null>;
  use: ModelSignal<FormUse>;
  view: ModelSignal<View>;
  key: ModelSignal<string | null>;
}

export interface CatalogInputSignals<T extends Entity | object, U extends EntityParams<U>> {
  item: ModelSignal<T | null>;
  view: ModelSignal<View>;
  key: ModelSignal<string | null>;
  isCompact: ModelSignal<boolean>;
  mode: ModelSignal<CatalogMode>;
  params: ModelSignal<U>;
}

export interface DetailInputSignals<T extends Entity | object> {
  use: ModelSignal<FormUse>;
  view: ModelSignal<View>;
  item: ModelSignal<T | null>;
  key: ModelSignal<string | null>;
  title: ModelSignal<string | null>;
}
