import { Entity } from 'src/app/_models/base/entity';
import { View } from 'src/app/_models/base/types';
import { FormUse } from 'src/app/_models/forms/formTypes';


/**
 * Represents a detail dialog configuration for a specific entity or object type.
 *
 * @template T - The type of the entity or object that the dialog will display.
 * @property {FormUse} use - The form usage context for the dialog.
 * @property {View} view - The view configuration for the dialog.
 * @property {T | null} item - The entity or object to be displayed in the dialog, or null if not applicable.
 * @property {string | null} key - The unique key identifier for the dialog, or null if not applicable.
 * @property {string} title - The title of the dialog.
 */
type DetailDialog<T extends Entity | object> = {
  use: FormUse;
  view: View;
  item: T | null;
  key: string | null;
  title: string;
};

export default DetailDialog;
