import { ModelSignal } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { View, CatalogMode } from "src/app/_models/base/types";


/**
 * Interface representing the input signals for a catalog component.
 *
 * @template T - The type of the item, which extends either `Entity` or `object`.
 * @template U - The type of the parameters, which extends `EntityParams<U>`.
 *
 * @property {ModelSignal<T | null>} item - Signal representing the catalog item, which can be of type `T` or `null`.
 * @property {ModelSignal<View>} view - Signal representing the view state of the catalog.
 * @property {ModelSignal<string | null>} key - Signal representing a key associated with the catalog item, which can be a `string` or `null`.
 * @property {ModelSignal<boolean>} isCompact - Signal indicating whether the catalog is in compact mode.
 * @property {ModelSignal<CatalogMode>} mode - Signal representing the current mode of the catalog.
 * @property {ModelSignal<U>} params - Signal representing the parameters associated with the catalog item.
 */
export default interface CatalogInputSignals<T extends Entity | object, U extends EntityParams<U>> {
  item: ModelSignal<T | null>;
  view: ModelSignal<View>;
  key: ModelSignal<string | null>;
  isCompact: ModelSignal<boolean>;
  mode: ModelSignal<CatalogMode>;
  params: ModelSignal<U>;
}
