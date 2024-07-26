import { Component, inject, input, model, OnInit, output } from "@angular/core";
import { ProductsService } from "src/app/_services/products.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { Column } from "src/app/_models/types";
import { FormsModule } from "@angular/forms";
import { PrescriptionItem } from "src/app/_models/prescription";
import { ProductSelectTypeaheadComponent } from 'src/app/_shared/components/product-select-typeahead.component';
import { createId } from '@paralleldrive/cuid2';
@Component({
  selector: '[prescriptionProductsTable]',
  templateUrl: './prescription-products-table.component.html',
  styleUrls: ['./prescription-products-table.component.scss'],
  standalone: true,
  imports: [
    FaIconComponent,
    TableHeaderComponent,
    FormsModule,
    ProductSelectTypeaheadComponent
  ]
})
export class PrescriptionProductsTableComponent implements OnInit {
  private productsService = inject(ProductsService);
  icons = inject(IconsService);

  data = model.required<PrescriptionItem[]>();
  key = input.required<string>();
  mode = input.required<'view' | 'edit'>();
  onProductSelected = output<PrescriptionItem>();
  onProductDeleted = output<PrescriptionItem>();

  product = null;
  selectedProductKey = createId();

  columns: Column[] = [
    { label: 'Nombre', name: 'name' },
    { label: 'Descripción', name: 'description' },
    { label: 'Dosis', name: 'dose' },
    { label: 'Instrucciones', name: 'instructions' },
    { label: 'Cantidad', name: 'quantity' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.subscribeToSelectedProduct();
  }

  private subscribeToSelectedProduct = () => {
    this.productsService.selected$(this.selectedProductKey)
    .subscribe({
      next: (product) => {
        if (product) {
          this.product = null;
          this.onProductSelected.emit({
            ...product,
            dosage: product.quantity.toString(),
            instructions: "",
            itemId: product.id,
            notes: "",
            quantity: 0
          });
        }
      }
    });
  }

  handleAmountChange = (item: PrescriptionItem, quantity: number) => {
    if (item.quantity + quantity < 0) { return; }
    item.quantity += quantity;
  }

  handleDeleteProduct(item: PrescriptionItem) {
    this.onProductDeleted.emit(item);
  }

  openProductSelectModal = () => {
    this.productsService.showCatalogModal(new MouseEvent('click'), this.key(), "multiselect");
  }
}
