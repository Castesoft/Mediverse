
/**
 * Represents an item with an identifier and selection status.
 *
 * @remarks
 * This class is used to manage items that can be selected or deselected.
 */
export class Item {
  id: number;
  isSelected = false;

  constructor(id: number) {
    this.id = id;
  }
}
