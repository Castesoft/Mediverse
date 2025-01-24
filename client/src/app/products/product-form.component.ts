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
import { View } from "src/app/_models/base/types";
import { ProductsService } from "src/app/products/products.config";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import { Modal } from "src/app/_models/modal";
import { firstValueFrom } from "rxjs";
import { Photo } from "src/app/_models/forms/example/_models/photo";

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
    SymbolCellComponent,
    TooltipDirective,
  ]
})
export class ProductFormComponent extends BaseForm<Product, ProductParams, ProductFiltersForm, ProductForm, ProductsService> implements OnInit, FormInputSignals<Product> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private confirmService: ConfirmService = inject(ConfirmService);

  item: ModelSignal<Product | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  images: Photo[] = [];
  mainImageIndex: number = 0;

  constructor() {
    super(ProductsService, ProductForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) this.form.patchValue(this.item() as any);
    });
  }

  ngOnInit(): void {
    this.subscribeToFormValueChanges();
    this.initializeImages();
  }

  private initializeImages(): void {
    this.images = [];
    if (this.item()?.photos?.length) {
      let mainIndex = 0;
      this.item()!.photos?.forEach((photo, index) => {
        this.images.push({
          file: null,
          url: photo.url,
          id: photo.id,
          isMain: photo.isMain
        });

        if (this.item()!.photos?.length === 1) {
          this.images[0].isMain = true;
        }

        if (photo.isMain) {
          mainIndex = index;
        }
      });
      this.mainImageIndex = mainIndex;
    } else {
      this.images.push(new Photo({ isMain: true }));
      this.mainImageIndex = 0;
    }
  }

  hasRealImages(): boolean {
    return this.images.some((img: Photo) => !!img.url || !!img.file);
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

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      this.handleFiles(files);
    }
  }

  private handleFiles(files: File[]): void {
    if (this.images.length === 1 && !this.images[0].url && !this.images[0].file) {
      this.images = [];
    }

    if (files.length + this.images.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo ${file.name} excede el tamaño máximo de 5MB`);
        return;
      }

      this.images.push({
        id: null,
        url: URL.createObjectURL(file),
        file: file,
        isMain: this.images.length === 0
      });
    });

    this.updateMainImage();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.handleFiles(files);
    }
  }

  removeImage(index: number): void {
    const image: Photo = this.images[index];
    const wasMain: boolean = image.isMain;

    if (image.id) {
      image.url = null;
    } else {
      this.images.splice(index, 1);
    }

    if (wasMain) {
      this.updateMainImage();
    } else {
      if (index < this.mainImageIndex) {
        this.mainImageIndex--;
      }
    }
  }

  setMainImage(index: number): void {
    if (index < 0 || index >= this.images.length) return;

    this.images.forEach((img, i) => img.isMain = i === index);
    this.mainImageIndex = index;
  }

  private updateMainImage(): void {
    const validImages: Photo[] = this.images.filter((img: Photo) => img.url || img.file);

    if (validImages.length === 0) {
      this.mainImageIndex = -1;
      return;
    }

    const hasMain: boolean = validImages.some((img: Photo) => img.isMain);
    if (!hasMain) {
      const newIndex: number = this.images.indexOf(validImages[0]);
      this.setMainImage(newIndex);
    }
  }

  async onSubmit(): Promise<void> {
    const confirm: Modal = {
      title: "Confirmar",
      message: "¿Está seguro de que desea guardar los cambios?",
      btnOkText: "Guardar",
      btnCancelText: "Cancelar",
      result: false,
    };

    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirm));
    if (!authorized) return;

    const formData = new FormData();
    formData.append('mainImageIndex', this.mainImageIndex.toString());

    const removedIds = this.images
      .filter(img => img.id && !img.url)
      .map(img => img.id!.toString());

    removedIds.forEach(id => formData.append('removedImageIds', id));

    this.images
      .filter(image => image.file)
      .forEach((image) => {
        formData.append('files', image.file!);
      });

    const productData = this.form.getRawValue();
    Object.keys(productData).forEach(key => {
      const value = productData[key as keyof typeof productData];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const isNew: boolean = !this.item() || !this.item()?.id;
    if (isNew) {
      this.service.create(formData).subscribe({
        next: (product) => {
          console.log('Product created:', product);
        },
        error: (err) => {
          console.error('Error creating product:', err);
        }
      });
    } else {
      this.service.update(formData, this.item()?.id!).subscribe({
        next: (product) => {
          console.log('Product updated:', product);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
  }
}
