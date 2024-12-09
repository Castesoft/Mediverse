import { ModelSignal } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";
import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";


/**
 * Interface representing the signals used for detailed input components.
 *
 * @template T - The type of the item, which extends either `Entity` or `object`.
 *
 * @property {ModelSignal<FormUse>} use - Signal for the form usage state.
 * @property {ModelSignal<View>} view - Signal for the view state.
 * @property {ModelSignal<T | null>} item - Signal for the item being detailed, which can be of type `T` or `null`.
 * @property {ModelSignal<string | null>} key - Signal for the key associated with the item, which can be a string or `null`.
 * @property {ModelSignal<string | null>} title - Signal for the title associated with the item, which can be a string or `null`.
 */
export default interface DetailInputSignals<T extends Entity | object> {
  use: ModelSignal<FormUse>;
  view: ModelSignal<View>;
  item: ModelSignal<T | null>;
  key: ModelSignal<string | null>;
  title: ModelSignal<string | null>;
}
