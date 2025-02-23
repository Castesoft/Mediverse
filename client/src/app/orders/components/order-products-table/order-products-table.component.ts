import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { DecimalPipe } from "@angular/common";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { Order } from "src/app/_models/orders/order";

@Component({
  selector: 'div[orderProductsTable]',
  templateUrl: './order-products-table.component.html',
  styleUrl: './order-products-table.component.scss',
  imports: [
    DecimalPipe,
    SymbolCellComponent
  ],
})
export class OrderProductsTableComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;

  order: InputSignal<Order> = input.required();
  showPayButton: InputSignal<boolean> = input(true);

  onPay: OutputEmitterRef<void> = output();

  onPayClicked(): void {
    this.onPay.emit();
  }
}
