import { Component, effect, inject, input, InputSignal, model, ModelSignal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductForm } from "src/app/_models/products/productForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { confirmActionModal, View } from "src/app/_models/base/types";
import { ProductsService } from "src/app/products/products.config";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import { firstValueFrom, Observable } from "rxjs";
import { ImageHandlerService } from "src/app/_services/image-handler.service";
import { ImageSelectorComponent } from "src/app/_shared/components/image-selector.component";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { Photo } from "src/app/_models/forms/example/_models/photo";
import { ImageThumbnailSelectorComponent } from "src/app/_shared/components/image-thumbnail-selector.component";
import { WarehousesService } from "src/app/warehouses/warehouses.config";
import { WarehouseSelectionTableComponent } from "src/app/warehouses/components/warehouse-selection-table.component";

@Component({
  selector: "[productForm]",
  templateUrl: './product-form.component.html',
  styleUrls: [ './product-form.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    TooltipDirective,
    ImageSelectorComponent,
    ImageThumbnailSelectorComponent,
    WarehouseSelectionTableComponent
  ]
})
export class ProductFormComponent extends BaseForm<Product, ProductParams, ProductFiltersForm, ProductForm, ProductsService> implements OnInit, FormInputSignals<Product> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  readonly imageHandler: ImageHandlerService = inject(ImageHandlerService);
  private warehousesService: WarehousesService = inject(WarehousesService);
  private confirmService: ConfirmService = inject(ConfirmService);

  item: ModelSignal<Product | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  availableWarehouses: any[] = [];
  selectedWarehouseIds: number[] = [];
  warehousesChanged: boolean = false;

  constructor() {
    super(ProductsService, ProductForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) {
        this.form.patchValue(this.item() as any);
      }
    });
  }

  ngOnInit(): void {
    this.subscribeToFormValueChanges();
    this.initializeImages();
    this.loadAvailableWarehouses();

    if (this.item() && this.item()!.warehouseProducts) {
      this.selectedWarehouseIds = this.item()!.warehouseProducts?.map((wp: any) => wp.warehouseId) || [];
    }
  }

  private initializeImages(): void {
    const initialPhotos: Photo[] = this.item()?.photos?.map((p: Photo) => ({
      id: p.id,
      url: p.url,
      isMain: p.isMain
    })) || [];
    this.imageHandler.initialize(initialPhotos);
  }

  hasRealImages(): boolean {
    return this.imageHandler.getImages().some((img: Photo) => !!img.url || !!img.file);
  }

  private subscribeToFormValueChanges(): void {
    this.form.valueChanges.subscribe((_) => {
      const discountTypeControl: FormControl2<string | null> = this.form.controls.discountType;
      const discountControl: FormControl2<number | null> = this.form.controls.discount;

      switch (discountTypeControl.getRawValue()) {
        case "1": {
          discountControl.label = "Descuento";
          discountControl.inputGroupAppend = "";
          break;
        }
        case "2": {
          discountControl.label = "Descuento (%)";
          discountControl.inputGroupAppend = "%";
          break;
        }
        case "3": {
          discountControl.label = "Descuento ($)";
          discountControl.inputGroupAppend = "$";
          break;
        }
      }
    });
  }

  loadAvailableWarehouses(): void {
    this.warehousesService.getOptions().subscribe((options: any[]) => {
      this.availableWarehouses = options;
    });
  }

  onWarehouseSelectionChanged(newSelection: number[]): void {
    this.selectedWarehouseIds = newSelection;
    this.warehousesChanged = true;
  }

  saveWarehouseChanges(): void {
    if (!this.item() || !this.item()!.id) return;

    const updateDto = {
      ProductId: this.item()!.id,
      WarehouseIds: this.selectedWarehouseIds
    };

    this.service.updateWarehouses(updateDto, this.item()!.id!).subscribe({
      next: (product) => {
        this.toastr.success('Updated product warehouses successfully.');
        this.warehousesChanged = false;
        this.item()!.warehouseProducts = product.warehouseProducts;
      },
      error: (err) => {
        console.error('Error updating product warehouses', err);
        this.toastr.error('Error updating product warehouses.');
      }
    });
  }

  override async onSubmit(): Promise<void> {
    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirmActionModal));
    if (!authorized) return;

    const formData = new FormData();
    formData.append('mainImageIndex', this.imageHandler.getMainImageIndex().toString());

    const removedIds: string[] = this.imageHandler.getRemovedIds();
    removedIds.forEach((id: string) => formData.append('removedImageIds', id));

    this.imageHandler.getImages()
      .filter((image: Photo) => image.file)
      .forEach((image: Photo) => formData.append('files', image.file!));

    const productData: any = this.form.getRawValue();
    Object.keys(productData).forEach((key: string) => {
      const value: any = productData[key as keyof typeof productData];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const isNew: boolean = !this.item()?.id;
    const observable: Observable<Product> = isNew
      ? this.service.create(this.form, this.view(), { use: this.use(), value: formData, })
      : this.service.update(this.form, this.view(), {
        use: this.use(),
        value: formData,
        id: this.form.controls.id.value ?? undefined,
      });

    observable.subscribe({
      next: (product) => {
        console.log(isNew ? 'Created:' : 'Updated:', product);
        this.toastr.success(`Producto ${isNew ? 'creado' : 'actualizado'} exitosamente`);
      },
      error: (err) => {
        console.error(`Error ${isNew ? 'creating' : 'updating'} product:`, err);
        this.toastr.error(`Error ${isNew ? 'creando' : 'actualizando'} el producto`);
      }
    });
  }
}
