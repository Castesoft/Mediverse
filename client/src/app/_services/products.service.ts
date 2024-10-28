import { Injectable } from "@angular/core";
import { BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { FormGroup2 } from "src/app/_forms/form2";
import { Product, ProductParams } from "src/app/_models/product";
import { CatalogMode, Column, FormUse, NamingSubject, View } from "src/app/_models/types";
import { ServiceHelper } from "src/app/_services/serviceHelper";
import { ProductDetailModalComponent, ProductsCatalogModalComponent, ProductsFilterModalComponent } from "src/app/products/modals";

@Injectable({
  providedIn: "root",
})
export class ProductsService extends ServiceHelper<Product, ProductParams, FormGroup2<ProductParams>> {
  constructor() {
    super(ProductParams, 'products', new NamingSubject(
      'masculine',
      'producto',
      'productos',
      'Productos',
      'products',
      ['home', 'products']
    ), [
      new Column('id', 'ID'),
      new Column('name', 'Nombre'),
      new Column('description', 'Descripción'),
      new Column('price', 'Precio'),
      new Column('quantity', 'Cantidad'),
      new Column('unit', 'Unidad'),
      new Column('discount', 'Descuento'),
      new Column('dosage', 'Dosis'),
      new Column('lotNumber', 'Número de lote'),
      new Column('manufacturer', 'Fabricante'),
      new Column('photoUrl', 'URL de la foto'),
      new Column('isInternal', 'Interno'),
      new Column('createdAt', 'Creado'),
      new Column('enabled', 'Habilitado'),
      new Column('visible', 'Visible'),
    ])
  }

  private detailModalRef: BsModalRef<ProductDetailModalComponent> = new BsModalRef<ProductDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private filterModalRef: BsModalRef<ProductsFilterModalComponent> = new BsModalRef<ProductsFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<ProductsCatalogModalComponent> = new BsModalRef<ProductsCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, view: View): void => {
    this.matDialog.open(ProductsCatalogModalComponent, {
      data: { key: key, mode: mode, view: view }
    });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.matDialog.open(ProductsFilterModalComponent, {
      data: { key: key, title: title }
    });
  };

  clickLink = (item: Product | null = null, key: string | null = null,
    use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.matDialog.open(ProductDetailModalComponent, {
      data: { item: item, key: key, use: use, view: 'modal'}
    });
  } else {
    this.bsModalService.hide();
    switch (use) {
      case "create":
        this.router.navigate([this.dictionary.createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  };
}
