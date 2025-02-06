import { Component, inject, input, InputSignal, model, ModelSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseProduct } from 'src/app/_models/warehouseProducts/warehouseProduct';
import { Column } from 'src/app/_models/base/column';
import { TableBodyComponent } from 'src/app/_shared/template/components/tables/table-body.component';
import { TableHeaderComponent } from 'src/app/_shared/template/components/tables/table-header.component';
import { TableMenuCellComponent } from 'src/app/_shared/template/components/tables/table-menu-cell.component';
import { TableMenuComponent } from 'src/app/_shared/components/table-menu.component';
import { createId } from '@paralleldrive/cuid2';
import { WarehouseProductsService } from 'src/app/warehouseProducts/warehouseProducts.config';
import { TableCheckCellComponent } from 'src/app/_shared/template/components/tables/table-check-cell.component';
import { SymbolCellComponent } from 'src/app/_shared/template/components/tables/cells/symbol-cell.component';
import { PhotoShape } from '../../_models/photos/photoTypes';

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[warehouseProductsTable]',
  templateUrl: './warehouse-products-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableBodyComponent,
    TableHeaderComponent,
    TableMenuCellComponent,
    TableMenuComponent,
    TableCheckCellComponent,
    SymbolCellComponent,
  ],
})
export class WarehouseProductsTableComponent {
  protected readonly PhotoShape = PhotoShape;

  warehouseProductsService: WarehouseProductsService = inject(WarehouseProductsService);
  key: string = createId();

  warehouseProducts: InputSignal<WarehouseProduct[]> = input.required();
  editable: InputSignal<boolean> = input(false);

  changesMade: OutputEmitterRef<boolean> = output();

  columns: Column[] = [
    new Column('image', 'Imagen'),
    new Column('product.name', 'Producto'),
    new Column('stock', 'Stock'),
    new Column('reserved', 'Reservado'),
    new Column('damaged', 'Dañado'),
    new Column('onHold', 'En Espera'),
    new Column('reorderLevel', 'Nivel de Reorden'),
    new Column('safetyStock', 'Stock de Seguridad'),
    new Column('lot', 'Lote'),
    new Column('expiration', 'Expiración'),
    new Column('updatedAt', 'Última Actualización'),
  ];

  markChanged(item: WarehouseProduct): void {
    (item as any).hasChanges = true;
    this.changesMade.emit(true);
  }
}
