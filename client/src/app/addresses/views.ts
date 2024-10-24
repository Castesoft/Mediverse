import { Component, effect, inject, input, InputSignal, model, OnInit } from "@angular/core";
import { FormUse, View } from "src/app/_models/types";
import { ControlsModule } from "src/app/_forms/controls.module";
import { FormComponent, FormGroupActions } from "src/app/_forms/form";
import { RouterModule } from "@angular/router";
import { AddressesService } from "src/app/addresses/addresses.config";
import { CommonModule } from "@angular/common";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";
import { Address } from "src/app/_models/address";

@Component({
  selector: "[addressForm]",
  template: `
  <form [id]="form.id" (ngSubmit)="onSubmit()">
  <div container [type]="'card'">
    @if (form.error) {
      <div errorsAlert [error]="form.error"></div>
    }
    <div formBuilder3 [controls]="[
      form.controls.street,
    ]" [cols]="1"></div>
    <div formBuilder3 [controls]="[
      form.controls.exteriorNumber,
      form.controls.interiorNumber,
      form.controls.zipcode,
    ]" [cols]="3"></div>
    <div formBuilder3 [controls]="[
      form.controls.neighborhood,
      form.controls.city,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.state,
      form.controls.country,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.isMain,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.name,
    ]" [cols]="1"></div>
    <div formBuilder3 [controls]="[
      form.controls.description,
    ]" [cols]="1"></div>
  </div>

  @if(use() !== 'detail') {
    <div container [type]="'inline'">
      <!-- <div detailFooter [use]="use()" [view]="view()" [id]="item() ? item()!.id : undefined" [dictionary]="service.dictionary['Clinic']" [formId]="form.id"></div> -->
    </div>
  }
</form>

  `,
  standalone: true,
  imports: [ CommonModule, RouterModule, ControlsModule, FormNewModule, ]
})
export class AddressFormComponent extends FormComponent<AddressesService> implements OnInit, FormGroupActions<Address, FormGroup2<Address>> {
  item: InputSignal<Address | undefined> = input.required();
  use: InputSignal<FormUse> = input.required();
  view: InputSignal<View> = input.required();
  key: InputSignal<string> = input.required();

  info: FormInfo<Address> = {
    city: { label: 'Ciudad', placeholder: 'Ciudad', type: 'text', },
    country: { label: 'País', placeholder: 'País', type: 'text', },
    createdAt: { label: 'Creado', placeholder: 'Creado', type: 'date', isDisabled: true, },
    description: { label: 'Descripción', placeholder: 'Descripción', type: 'textarea', },
    enabled: { label: 'Habilitado', type: 'slideToggle', placeholder: 'Habilitado', },
    id: { label: 'Dirección', placeholder: 'Dirección', type: 'number', isDisabled: true },
    isSelected: { label: 'Seleccionado', placeholder: 'Seleccionado', type: 'slideToggle' },
    name: { label: 'Nombre', placeholder: 'Nombre', type: 'text' },
    visible: { label: 'Visible', type: 'slideToggle' },
    exteriorNumber: { label: 'Número exterior', placeholder: 'Número exterior', type: 'text' },
    interiorNumber: { label: 'Número interior', placeholder: 'Número interior', type: 'text' },
    isMain: { label: 'Principal', type: 'slideToggle' },
    zipcode: { label: 'Código postal', placeholder: 'Código postal', type: 'text' },
    neighborhood: { label: 'Colonia', placeholder: 'Colonia', type: 'text' },
    state: { label: 'Estado', placeholder: 'Estado', type: 'select', },
    street: { label: 'Calle', placeholder: 'Calle', type: 'text' },
  } as FormInfo<Address>;

  form: FormGroup2<Address> = new FormGroup2<Address>(Address, new Address(), this.info);

  constructor() {
    super(AddressesService);

    effect(() => {
      const value = this.item();

      if (value) {
        this.form = new FormGroup2<Address>(Address, value, this.info, { orientation: 'inline' });

      }

      this.form.setUse(this.use());
    });
  }

  ngOnInit(): void {
    this.formsService.mode$.subscribe({ next: validation => {
      this.form.validation = validation;
    } });
  }

  onSubmit() {
    this.form.submitted = true;
    console.log(this.form);
    switch (this.use()) {
      case 'create':
        this.create();
        break;
      case 'edit':
        this.update();
        break;
    }
  }

  onCancel() {
    this.form.submitted = false;
    if (this.use() === 'create') {
      this.form.reset();
    } else if (this.use() === 'edit') {
      this.form.reset();
    }
  }

  create() {
    // if (this.form.submittable) {
    //   this.service.create(this.form.getRawValue(), 'clinic').subscribe({
    //     next: item => this.form.submitted = false,
    //     error: (error: BadRequest) => this.form.error = error });
    // }
  }

  update() {
    // if (this.form.submittable) {
    //   this.service.update(+this.form.getRawValue().id!, this.form.getRawValue()).subscribe({
    //     next: () => this.form.submitted = false,
    //     error: (error: BadRequest) => this.form.error = error
    //   });
    // }
  }
}

@Component({
  selector: 'div[addressDetail]',
  template: `
  <div container [type]="'inline'">
    <!-- <div detailHeader [(use)]="use" [view]="view()" [dictionary]="service.dictionary['Clinic']" [id]="item() ? item()!.id : undefined" (onDelete)="service.delete$(item()!, 'Clinic')"></div> -->
  </div>
  <div addressForm [item]="item()" [key]="key()" [use]="use()" [view]="view()"></div>
  `,
  standalone: true,
  imports: [AddressFormComponent, ControlsModule,],
})
export class AddressDetailComponent {
  service = inject(AddressesService);

  use = model.required<FormUse>();
  view = input.required<View>();
  item = input.required<Address | undefined>();
  key = input.required<string>();
}
