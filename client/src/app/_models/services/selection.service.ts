import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Entity } from 'src/app/_models/base/entity';

/**
 * Generic selection service that manages both single and multiple selections.
 *
 * This version uses a helper method getEntityKey() to compare entities. If an entity's
 * id is 0 (or falsy), it uses a composite key (for example, warehouseId-productId) as the unique key.
 */
@Injectable({
  providedIn: 'root'
})
export class SelectionService<T extends Entity> {
  // Single selections: key → one entity or null.
  private readonly singleSelections = new BehaviorSubject<Record<string, T | null>>({});
  // Multiple selections: key → array of entities.
  private readonly multipleSelections = new BehaviorSubject<Record<string, T[]>>({});

  // Observables so that other parts of the app can subscribe.
  readonly singleSelections$ = this.singleSelections.asObservable();
  readonly multipleSelections$ = this.multipleSelections.asObservable();

  // Helper: Returns a unique key for an entity.
  // If the entity's id is truthy (and not zero) it uses that
  private getEntityKey(entity: T): string {
    if (entity.id && entity.id !== 0) {
      return entity.id.toString();
    }

    // If the entity is a WarehouseProduct, then use warehouseId and productId.
    const asAny = entity as any;
    if (asAny.warehouseId !== undefined && asAny.productId !== undefined) {
      return `${asAny.warehouseId}-${asAny.productId}`;
    }

    return JSON.stringify(entity);
  }

  getSelection$(key: string | null): Observable<T | null> {
    this.validateKey(key);
    return this.singleSelections$.pipe(
      map(selections => selections[key!] || null)
    );
  }

  getMultipleSelections$(key: string | null): Observable<T[]> {
    this.validateKey(key);
    return this.multipleSelections$.pipe(
      map(selections => selections[key!] || [])
    );
  }

  getCurrentSelection(key: string | null): T | null {
    this.validateKey(key);
    return this.singleSelections.value[key!] || null;
  }

  getCurrentMultipleSelections(key: string | null): T[] {
    this.validateKey(key);
    return this.multipleSelections.value[key!] || [];
  }

  hasSelection(key: string | null): boolean {
    this.validateKey(key);
    return !!this.singleSelections.value[key!];
  }

  /**
   * Sets (or replaces) the single selection for the given key.
   * If replacing an existing selection, the previous one is deselected.
   */
  setSelection(key: string | null, value: T | null): void {
    this.validateKey(key);
    const current = this.singleSelections.value[key!];

    if (current && (!value || this.getEntityKey(current) !== this.getEntityKey(value))) {
      current.isSelected = false;
    }
    if (value) {
      value.isSelected = true;
    }
    this.singleSelections.next({
      ...this.singleSelections.value,
      [key!]: value
    });
  }

  /**
   * Sets the multiple selections for the given key.
   * Entities not present in the new list are deselected; those in the list are marked as selected.
   */
  setMultipleSelections(key: string | null, values: T[]): void {
    this.validateKey(key);

    const previous = this.multipleSelections.value[key!] || [];

    previous.forEach(item => {
      if (!values.some(v => this.getEntityKey(v) === this.getEntityKey(item))) {
        item.isSelected = false;
      }
    });

    values.forEach(item => {
      item.isSelected = true;
    });

    this.multipleSelections.next({
      ...this.multipleSelections.value,
      [key!]: values
    });
  }

  /**
   * Toggles a single item in the multiple selections for the given key.
   * It compares entities using the getEntityKey helper.
   */
  toggleSelection(key: string | null, value: T): void {
    this.validateKey(key);
    if (!value) return;

    const currentSelections = this.multipleSelections.value[key!] || [];
    const index = currentSelections.findIndex(item => this.getEntityKey(item) === this.getEntityKey(value));

    if (index !== -1) {
      currentSelections[index].isSelected = false;
      const newSelections = currentSelections.filter(item => this.getEntityKey(item) !== this.getEntityKey(value));
      this.setMultipleSelections(key, newSelections);
    } else {
      value.isSelected = true;
      this.setMultipleSelections(key, [ ...currentSelections, value ]);
    }
  }

  /**
   * Toggles an array of items in the multiple selections for the given key.
   * For each item provided, if it is already selected (by key) it is deselected; otherwise, it is selected.
   */
  toggleMultipleSelectArray(key: string | null, values: T[]): void {
    this.validateKey(key);
    if (!values || values.length === 0) return;

    const currentSelections = this.multipleSelections.value[key!] || [];
    let newSelections = [ ...currentSelections ];

    values.forEach(value => {
      const idx = newSelections.findIndex(item => this.getEntityKey(item) === this.getEntityKey(value));
      if (idx !== -1) {
        newSelections[idx].isSelected = false;
        newSelections = newSelections.filter(item => this.getEntityKey(item) !== this.getEntityKey(value));
      } else {
        value.isSelected = true;
        newSelections = [ ...newSelections, value ];
      }
    });

    this.setMultipleSelections(key, newSelections);
  }

  /**
   * Toggles the selection of all items (for select-all behavior).
   * If every item (by key) is selected, they are all deselected; otherwise, all are selected.
   */
  toggleAllSelections(key: string | null, allItems: T[]): void {
    this.validateKey(key);
    const currentSelections = this.multipleSelections.value[key!] || [];
    const allSelected = allItems.every(item => currentSelections.some(sel => this.getEntityKey(sel) === this.getEntityKey(item)));

    if (allSelected) {
      allItems.forEach(item => item.isSelected = false);
      this.setMultipleSelections(key, []);
    } else {
      allItems.forEach(item => item.isSelected = true);
      this.setMultipleSelections(key, [ ...allItems ]);
    }
  }

  /**
   * Clears both the single and multiple selections for the given key.
   * All affected entities have their isSelected flag set to false.
   */
  clearSelections(key: string | null): void {
    this.validateKey(key);
    const currentSingle = this.singleSelections.value[key!];

    if (currentSingle) {
      currentSingle.isSelected = false;
    }

    const currentMultiple = this.multipleSelections.value[key!] || [];
    currentMultiple.forEach(item => item.isSelected = false);

    this.singleSelections.next({
      ...this.singleSelections.value,
      [key!]: null
    });

    this.multipleSelections.next({
      ...this.multipleSelections.value,
      [key!]: []
    });
  }

  private validateKey(key: string | null): void {
    if (!key) {
      throw new Error("Selection key cannot be null or empty");
    }
  }
}
