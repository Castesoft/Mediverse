import { Component, effect, inject, input, InputSignal, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Warehouse } from "src/app/_models/warehouses/warehouse";
import { WarehouseParams } from "src/app/_models/warehouses/warehouseParams";
import { WarehouseFiltersForm } from "src/app/_models/warehouses/warehouseFiltersForm";
import { WarehouseForm } from "src/app/_models/warehouses/warehouseForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { confirmActionModal, View } from "src/app/_models/base/types";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { WarehousesService } from "src/app/warehouses/warehouses.config";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { firstValueFrom, Observable } from "rxjs";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import { AddressesService } from "src/app/addresses/addresses.config";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Address } from "src/app/_models/addresses/address";
import { WarehouseProductsTableComponent } from "src/app/warehouses/components/warehouse-products-table.component";
import { TableWrapperComponent } from "src/app/_shared/template/components/tables/table-wrapper.component";

@Component({
  selector: "[warehouseForm]",
  templateUrl: './warehouse-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    WarehouseProductsTableComponent,
    TableWrapperComponent,
  ]
})
export class WarehouseFormComponent extends BaseForm<Warehouse, WarehouseParams, WarehouseFiltersForm, WarehouseForm, WarehousesService> implements FormInputSignals<Warehouse> {
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly confirmService: ConfirmService = inject(ConfirmService);
  private readonly addressesService: AddressesService = inject(AddressesService);

  item: ModelSignal<Warehouse | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  constructor() {
    super(WarehousesService, WarehouseForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item()) {
        this.form.patchValue(this.item() as any);

        if (this.item()?.address) {
          const address = new Address(this.item()?.address as any);
          const addressSelectOption = new SelectOption({
            name: address.address || '',
            code: address.code || '',
            id: +(address.id ?? 0)
          });
          this.form.controls.address.controls.select.patchValue(addressSelectOption);
        }
      }

      this.initForm();
      this.setOptions();
    });
  }

  private initForm(): void {
    this.form.controls.address.controls.select.label = 'Dirección';
  }

  private setOptions(): void {
    this.addressesService.getOptions().subscribe();
    this.form.controls.address.controls.select.selectOptions = this.addressesService.options();
  }

  async onSubmit(): Promise<void> {
    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirmActionModal));
    if (!authorized) return;

    const isNew: boolean = !this.item()?.id;
    const observable: Observable<Warehouse> = isNew
      ? this.service.create(this.form.getRawValue())
      : this.service.update(this.form.getRawValue(), this.item()!.id!, false);

    observable.subscribe({
      next: (warehouse) => {
        console.log(isNew ? 'Created:' : 'Updated:', warehouse);
        this.toastr.success(`Almacén ${isNew ? 'creado' : 'actualizado'} exitosamente`);
        this.router.navigate([ 'admin', 'almacenes', warehouse.id ]);
      },
      error: (err) => {
        console.error(`Error ${isNew ? 'creating' : 'updating'} warehouse:`, err);
        this.toastr.error(`Error ${isNew ? 'creando' : 'actualizando'} el almacén`);
      }
    });
  }
}
