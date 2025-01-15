import { BehaviorSubject, Observable, map } from "rxjs";
import { Entity } from "src/app/_models/base/entity";
import { Injectable } from "@angular/core";

/**
 * Generic selection service that manages both single and multiple selections
 */
@Injectable({
  providedIn: "root"
})
export class SelectionService<T extends Entity> {
  private readonly singleSelections = new BehaviorSubject<Record<string, T | null>>({});
  private readonly multipleSelections = new BehaviorSubject<Record<string, T[]>>({});
  private readonly multipleSelectionsMap = new Map<string, T[]>();

  // Single selection observables
  readonly singleSelections$ = this.singleSelections.asObservable();

  // Multiple selection observables
  readonly multipleSelections$ = this.multipleSelections.asObservable();

  /**
   * Get selected item for a given key
   */
  getSelection$(key: string | null): Observable<T | null> {
    this.validateKey(key);
    return this.singleSelections$.pipe(
      map(selections => selections[key!] || null)
    );
  }

  /**
   * Get multiple selected items for a given key
   */
  getMultipleSelections$(key: string | null): Observable<T[]> {
    this.validateKey(key);
    return this.multipleSelections$.pipe(
      map(selections => selections[key!] || [])
    );
  }

  /**
   * Get current selection synchronously
   */
  getCurrentSelection(key: string | null): T | null {
    this.validateKey(key);
    return this.singleSelections.value[key!] || null;
  }

  /**
   * Get current multiple selections synchronously
   */
  getCurrentMultipleSelections(key: string | null): T[] {
    this.validateKey(key);
    return this.multipleSelections.value[key!] || [];
  }

  /**
   * Check if there is a selection for the given key
   */
  hasSelection(key: string | null): boolean {
    this.validateKey(key);
    return this.singleSelections.value[key!] !== null &&
      this.singleSelections.value[key!] !== undefined;
  }

  /**
   * Set single selection
   */
  setSelection(key: string | null, value: T | null): void {
    this.validateKey(key);
    const currentValue = this.singleSelections.value[key!];

    if (currentValue === value) return;

    if (currentValue) {
      currentValue.isSelected = false;
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
   * Set multiple selections
   */
  setMultipleSelections(key: string | null, values: T[]): void {
    this.validateKey(key);
    const currentSelections = this.multipleSelectionsMap.get(key!) || [];

    currentSelections.forEach(item => item.isSelected = false);

    values.forEach(item => item.isSelected = true);

    this.multipleSelectionsMap.set(key!, values);
    this.multipleSelections.next({
      ...this.multipleSelections.value,
      [key!]: values
    });
  }

  /**
   * Toggle item in multiple selections
   */
  toggleSelection(key: string | null, value: T): void {
    this.validateKey(key);
    if (!value) return;

    const currentSelections = this.multipleSelectionsMap.get(key!) || [];
    const index = currentSelections.findIndex(item => item.id === value.id);

    console.log(value);

    if (index > -1) {
      value.isSelected = false;
      this.setMultipleSelections(
        key,
        currentSelections.filter(item => item.id !== value.id)
      );
    } else {
      value.isSelected = true;
      this.setMultipleSelections(key, [ ...currentSelections, value ]);
    }
  }

  /**
   * Clear all selections for a given key
   */
  clearSelections(key: string | null): void {
    this.validateKey(key);
    const currentSingleSelection = this.singleSelections.value[key!];
    if (currentSingleSelection) {
      currentSingleSelection.isSelected = false;
    }

    const currentMultipleSelections = this.multipleSelectionsMap.get(key!) || [];
    currentMultipleSelections.forEach(item => item.isSelected = false);

    this.setSelection(key, null);
    this.setMultipleSelections(key, []);
  }

  toggleMultipleSelectArray(key: string | null, values: T[]): void {
    this.validateKey(key);
    if (!values || values.length === 0) return;

    const currentSelections = this.multipleSelectionsMap.get(key!) || [];
    const updatedSelections = [ ...currentSelections ];

    values.forEach(value => {
      const index = updatedSelections.findIndex(item => item.id === value.id);

      if (index > -1) {
        value.isSelected = false;
        updatedSelections.splice(index, 1);
      } else {
        value.isSelected = true;
        updatedSelections.push(value);
      }
    });

    this.setMultipleSelections(key, updatedSelections);
  }

  private validateKey(key: string | null): void {
    if (!key) {
      throw new Error("Selection key cannot be null or empty");
    }
  }
}
