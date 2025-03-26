import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Entity } from 'src/app/_models/base/entity';

interface CompositeKey {
  warehouseId?: number;
  productId?: number;

  [key: string]: any;
}

/**
 * Generic selection service that manages both single and multiple selections.
 *
 * This service maintains selection state while preserving entity immutability.
 * It uses an efficient key generation strategy to uniquely identify entities.
 */
@Injectable({
  providedIn: 'root',
})
export class SelectionService<T extends Entity> {
  private readonly singleSelections = new BehaviorSubject<Map<string, T | null>>(new Map());
  private readonly multipleSelections = new BehaviorSubject<Map<string, T[]>>(new Map());
  private readonly entityKeyCache = new Map<number, string>();

  readonly singleSelections$ = this.singleSelections.asObservable();
  readonly multipleSelections$ = this.multipleSelections.asObservable();

  /**
   * Returns a unique key for an entity.
   * Uses ID when available, falls back to composite keys for special cases.
   * @param entity The entity to generate a key for
   * @returns A string key that uniquely identifies the entity
   */
  private getEntityKey(entity: T): string {
    if (entity.id && entity.id !== 0 && this.entityKeyCache.has(entity.id)) {
      return this.entityKeyCache.get(entity.id)!;
    }

    let key: string;

    if (entity.id && entity.id !== 0) {
      key = entity.id.toString();
      this.entityKeyCache.set(entity.id, key);
      return key;
    }

    const compositeEntity = entity as unknown as CompositeKey;

    if (
      compositeEntity.warehouseId !== undefined &&
      compositeEntity.productId !== undefined
    ) {
      return `${compositeEntity.warehouseId}-${compositeEntity.productId}`;
    }

    const identifier = new Map<string, any>();

    if (entity.code) identifier.set('code', entity.code);
    if (entity.codeNumber) identifier.set('codeNumber', entity.codeNumber);
    if (entity.name) identifier.set('name', entity.name);

    if (identifier.size > 0) {
      return Array.from(identifier.entries())
        .sort(([ keyA ], [ keyB ]) => keyA.localeCompare(keyB))
        .map(([ k, v ]) => `${k}:${v}`)
        .join('|');
    }

    console.warn(
      'Using JSON.stringify for entity key - consider adding a proper ID or identifier',
      entity
    );
    return JSON.stringify(entity);
  }

  /**
   * Gets an observable of the current selection for a key
   * @param key The selection context key
   * @returns Observable of the selected entity or null
   */
  getSelection$(key: string | null): Observable<T | null> {
    this.validateKey(key);
    return this.singleSelections$.pipe(
      map((selections) => selections.get(key!) || null)
    );
  }

  /**
   * Gets an observable of multiple selections for a key
   * @param key The selection context key
   * @returns Observable of selected entities array
   */
  getMultipleSelections$(key: string | null): Observable<T[]> {
    this.validateKey(key);
    return this.multipleSelections$.pipe(
      map((selections) => selections.get(key!) || [])
    );
  }

  /**
   * Gets the current selection value synchronously
   * @param key The selection context key
   * @returns The selected entity or null
   */
  getCurrentSelection(key: string | null): T | null {
    this.validateKey(key);
    return this.singleSelections.value.get(key!) || null;
  }

  /**
   * Gets multiple selections synchronously
   * @param key The selection context key
   * @returns Array of selected entities
   */
  getMultipleSelections(key: string | null): T[] {
    this.validateKey(key);
    return this.multipleSelections.value.get(key!) || [];
  }

  /**
   * Checks if there's a selection for the given key
   * @param key The selection context key
   * @returns Whether a selection exists
   */
  hasSelection(key: string | null): boolean {
    this.validateKey(key);
    return (
      this.singleSelections.value.has(key!) &&
      this.singleSelections.value.get(key!) !== null
    );
  }

  /**
   * Sets (or replaces) the single selection for the given key.
   * Creates a copy of the selection with isSelected set appropriately.
   * @param key The selection context key
   * @param value The entity to select or null to clear
   */
  setSelection(key: string | null, value: T | null): void {
    this.validateKey(key);

    const current = this.singleSelections.value.get(key!);

    const newSelections = new Map(this.singleSelections.value);

    if (value) {
      const selectedEntity = this.createSelectionCopy(value, true);
      newSelections.set(key!, selectedEntity);
    } else {
      newSelections.set(key!, null);
    }

    this.singleSelections.next(newSelections);
  }

  /**
   * Sets the multiple selections for the given key.
   * Copies entities with appropriate isSelected state.
   * @param key The selection context key
   * @param values The entities to select
   */
  setMultipleSelections(key: string | null, values: T[]): void {
    this.validateKey(key);

    const selectedEntities = values.map((entity) =>
      this.createSelectionCopy(entity, true)
    );

    const newSelections = new Map(this.multipleSelections.value);
    newSelections.set(key!, selectedEntities);

    this.multipleSelections.next(newSelections);
  }

  /**
   * Toggles a single item in the multiple selections for the given key.
   * @param key The selection context key
   * @param value The entity to toggle
   */
  toggleSelection(key: string | null, value: T): void {
    this.validateKey(key);
    if (!value) return;

    const currentSelections = this.multipleSelections.value.get(key!) || [];
    const entityKey = this.getEntityKey(value);

    const isSelected = currentSelections.some(
      (item) => this.getEntityKey(item) === entityKey
    );

    if (isSelected) {
      const newSelections = currentSelections.filter(
        (item) => this.getEntityKey(item) !== entityKey
      );
      this.setMultipleSelections(key, newSelections);
    } else {
      const newSelections = [ ...currentSelections, value ];
      this.setMultipleSelections(key, newSelections);
    }
  }

  /**
   * Toggles multiple items in the selection at once
   * @param key The selection context key
   * @param values The entities to toggle
   */
  toggleMultipleSelectArray(key: string | null, values: T[]): void {
    this.validateKey(key);
    if (!values || values.length === 0) return;

    const currentSelections = this.multipleSelections.value.get(key!) || [];
    let result = [ ...currentSelections ];

    values.forEach((value) => {
      const entityKey = this.getEntityKey(value);

      const index = result.findIndex(
        (item) => this.getEntityKey(item) === entityKey
      );

      if (index !== -1) {
        result = result.filter((_, i) => i !== index);
      } else {
        result.push(this.createSelectionCopy(value, true));
      }
    });

    const newSelections = new Map(this.multipleSelections.value);
    newSelections.set(key!, result);
    this.multipleSelections.next(newSelections);
  }

  /**
   * Toggles all items (select all/deselect all)
   * @param key The selection context key
   * @param allItems All available items
   */
  toggleAllSelections(key: string | null, allItems: T[]): void {
    this.validateKey(key);

    const currentSelections = this.multipleSelections.value.get(key!) || [];

    const allSelected =
      allItems.length > 0 &&
      allItems.every((item) =>
        currentSelections.some(
          (sel) => this.getEntityKey(sel) === this.getEntityKey(item)
        )
      );

    if (allSelected) {
      const newSelections = new Map(this.multipleSelections.value);
      newSelections.set(key!, []);
      this.multipleSelections.next(newSelections);
    } else {
      this.setMultipleSelections(key, allItems);
    }
  }

  /**
   * Clears all selections for a key
   * @param key The selection context key
   */
  clearSelections(key: string | null): void {
    this.validateKey(key);

    const newSingleSelections = new Map(this.singleSelections.value);
    newSingleSelections.set(key!, null);
    this.singleSelections.next(newSingleSelections);

    const newMultipleSelections = new Map(this.multipleSelections.value);
    newMultipleSelections.set(key!, []);
    this.multipleSelections.next(newMultipleSelections);
  }

  /**
   * Creates a copy of an entity with the selection state set
   * @param entity The entity to copy
   * @param isSelected The selection state to set
   * @returns A new entity copy
   */
  private createSelectionCopy(entity: T, isSelected: boolean): T {
    return { ...entity, isSelected };
  }

  /**
   * Validates that a key is not null or empty
   * @param key The key to validate
   * @throws Error if key is invalid
   */
  private validateKey(key: string | null): void {
    if (!key) {
      throw new Error('Selection key cannot be null or empty');
    }
  }
}
