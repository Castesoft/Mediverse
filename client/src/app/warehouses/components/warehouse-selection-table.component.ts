import { Component, model, ModelSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TableHeaderComponent } from "src/app/_shared/template/components/tables/table-header.component";
import { Column } from "src/app/_models/base/column";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: 'div[warehouseSelectionTable]',
  templateUrl: './warehouse-selection-table.component.html',
  imports: [
    FormsModule,
    TableHeaderComponent
  ]
})
export class WarehouseSelectionTableComponent {
  protected readonly FormUse: typeof FormUse = FormUse;

  use: ModelSignal<FormUse> = model.required();
  availableWarehouses: ModelSignal<any[]> = model.required();
  selectedWarehouseIds: ModelSignal<number[]> = model.required();

  selectionChanged: OutputEmitterRef<number[]> = output();
  save: OutputEmitterRef<number[]> = output();

  columns: Column[] = [
    new Column('name', 'Nombre'),
    new Column('address', 'Descripción'),
    new Column('', '')
  ];

  changed: boolean = false;

  isSelected(id: number): boolean {
    return this.selectedWarehouseIds().includes(id);
  }

  toggleSelection(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const selectedIds: number[] = this.selectedWarehouseIds();
    if (checkbox.checked) {
      if (!selectedIds.includes(id)) {
        this.selectedWarehouseIds.set([ ...selectedIds, id ]);
      }
    } else {
      this.selectedWarehouseIds.set(selectedIds.filter((item: number) => item !== id));
    }
    this.changed = true;
    this.selectionChanged.emit(this.selectedWarehouseIds());
  }

  saveChanges(): void {
    this.save.emit(this.selectedWarehouseIds());
    this.changed = false;
  }
}
