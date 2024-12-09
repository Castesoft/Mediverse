import { ModelSignal } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { View, CatalogMode } from "src/app/_models/base/types";


/**
 * Interface representing the signals for table input components.
 *
 * @template T - The type of the item, which extends either `Entity` or `object`.
 * @template U - The type of the parameters, which extends `EntityParams<U>`.
 *
 * @property {ModelSignal<T | null>} item - Signal representing the item, which can be of type `T` or `null`.
 * @property {ModelSignal<View>} view - Signal representing the view.
 * @property {ModelSignal<string | null>} key - Signal representing the key, which can be a `string` or `null`.
 * @property {ModelSignal<boolean>} isCompact - Signal indicating whether the table is in compact mode.
 * @property {ModelSignal<CatalogMode>} mode - Signal representing the catalog mode.
 * @property {ModelSignal<U>} params - Signal representing the parameters of type `U`.
 */
export default interface TableInputSignals<T extends Entity | object, U extends EntityParams<U>> {
  item: ModelSignal<T | null>;
  view: ModelSignal<View>;
  key: ModelSignal<string | null>;
  isCompact: ModelSignal<boolean>;
  mode: ModelSignal<CatalogMode>;
  params: ModelSignal<U>;
  data: ModelSignal<T[]>;
}
