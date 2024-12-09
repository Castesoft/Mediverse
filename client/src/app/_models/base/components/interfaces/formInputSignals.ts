import { ModelSignal } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";
import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";


/**
 * Interface representing the signals for form input components.
 *
 * @template T - The type of the entity.
 *
 * @property {ModelSignal<T | null>} item - Signal representing the item associated with the form input.
 * @property {ModelSignal<FormUse>} use - Signal representing the usage context of the form input.
 * @property {ModelSignal<View>} view - Signal representing the view context of the form input.
 * @property {ModelSignal<string | null>} key - Signal representing a unique key for the form input.
 */
export default interface FormInputSignals<T extends Entity> {
  item: ModelSignal<T | null>;
  use: ModelSignal<FormUse>;
  view: ModelSignal<View>;
  key: ModelSignal<string | null>;
}
