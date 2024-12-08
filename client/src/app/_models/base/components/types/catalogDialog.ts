import { Entity } from 'src/app/_models/base/entity';
import { EntityParams } from 'src/app/_models/base/entityParams';
import { CatalogMode, View } from 'src/app/_models/base/types';


/**
 * Represents a dialog in a catalog with specific configurations and data.
 *
 * @template T - The type of the item in the dialog, which extends either `Entity` or `object`.
 * @template U - The type of the parameters for the dialog, which extends either `EntityParams<U>` or `object`.
 *
 * @property {string} key - A unique identifier for the dialog.
 * @property {boolean} isCompact - Indicates whether the dialog is in a compact mode.
 * @property {CatalogMode} mode - The mode of the catalog.
 * @property {View} view - The view configuration for the dialog.
 * @property {string} title - The title of the dialog.
 * @property {T | null} item - The item being displayed or edited in the dialog.
 * @property {U} params - The parameters associated with the dialog.
 */
type CatalogDialog<T extends Entity | object, U extends EntityParams<U> | object> = {
  key: string;
  isCompact: boolean;
  mode: CatalogMode;
  view: View;
  title: string;
  item: T | null;
  params: U;
};

export default CatalogDialog;
