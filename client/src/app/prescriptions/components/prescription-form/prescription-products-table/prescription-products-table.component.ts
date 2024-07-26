import { Component, inject, input, model, OnInit } from "@angular/core";
import { ProductsService } from "src/app/_services/products.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { Column } from "src/app/_models/types";
import { FormsModule } from "@angular/forms";
import { PrescriptionItem } from "src/app/_models/prescription";
@Component({
  selector: '[prescriptionProductsTable]',
  templateUrl: './prescription-products-table.component.html',
  styleUrls: ['./prescription-products-table.component.scss'],
  standalone: true,
  imports: [
    FaIconComponent,
    TableHeaderComponent,
    FormsModule
  ]
})
export class PrescriptionProductsTableComponent implements OnInit {
  private productsService = inject(ProductsService);
  icons = inject(IconsService);

  data = model.required<PrescriptionItem[]>();
  key = input.required<string>();
  mode = input.required<'view' | 'edit'>();

  columns: Column[] = [
    { label: 'Nombre', name: 'name' },
    { label: 'Descripción', name: 'description' },
    { label: 'Dosis', name: 'dose' },
    { label: 'Instrucciones', name: 'instructions' },
    { label: 'Cantidad', name: 'quantity' },
  ];

  constructor() { }

  ngOnInit(): void {}

  handleAmountChange = (item: PrescriptionItem, quantity: number) => {
    if (item.quantity + quantity < 0) { return; }
    item.quantity += quantity;
  }

  openProductSelectModal = () => {
    this.productsService.showCatalogModal(new MouseEvent('click'), this.key(), "multiselect");
  }
}
