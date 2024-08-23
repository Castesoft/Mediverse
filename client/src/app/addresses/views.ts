import { Component, effect, inject, input, InputSignal, model, OnInit } from "@angular/core";
import { BadRequest, FormUse, View } from "src/app/_models/types";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Control, FormActions, FormComponent } from "src/app/_forms/form";
import { Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Address, AddressForm, AddressesService } from "src/app/addresses/addresses.config";
import { CommonModule } from "@angular/common";
import { omitKeys } from "src/app/_utils/util";

@Component({
  selector: "[addressForm]",
  template: `
  <form [formGroup]="form.group" [id]="form.id" (ngSubmit)="onSubmit()">
  <div container [type]="'card'">
    @if (form.error) {
      <div errorsAlert [error]="form.error"></div>
    }
    <div formBuilder [controls]="form.getControls(['street'])" [rows]="1"></div>
    <div formBuilder [controls]="form.getControls(['exteriorNumber', 'interiorNumber', 'zipcode'])" [rows]="3"></div>
    <div formBuilder [controls]="form.getControls(['neighborhood', 'city'])" [rows]="2"></div>
    <div formBuilder [controls]="form.getControls(['state', 'country'])" [rows]="2"></div>
    <div formBuilder [controls]="form.getControls(['isMain'])" [rows]="2"></div>
    <div formBuilder [controls]="form.getControls(['name'])" [rows]="1"></div>
    <div formBuilder [controls]="form.getControls(['description'])" [rows]="1"></div>
  </div>

  @if(use() !== 'detail') {
    <div container [type]="'inline'">
      <div detailFooter [use]="use()" [view]="view()" [id]="item() ? item()!.id : undefined" [dictionary]="service.dictionary['Clinic']" [formId]="form.id"></div>
    </div>
  }
</form>

  `,
  standalone: true,
  imports: [ CommonModule, RouterModule, ControlsModule, ]
})
export class AddressFormComponent extends FormComponent<AddressesService> implements OnInit, FormActions<Address, AddressForm> {
  item: InputSignal<Address | undefined> = input.required();
  use: InputSignal<FormUse> = input.required();
  view: InputSignal<View> = input.required();
  key: InputSignal<string> = input.required();

  form: AddressForm;

  constructor() {
    super(AddressesService);

    this.form = new AddressForm({
      city: new Control("text", "Ciudad", "city", { validators: [ Validators.required] }),
      country: new Control("text", "País", "country", { validators: [ Validators.required] }),
      exteriorNumber: new Control("text", "Número exterior", "exteriorNumber", { validators: [ Validators.required] }),
      isMain: new Control("check", "Principal", "isMain"),
      nursesCount: new Control("number", "Número de enfermeras", "nursesCount", { validators: [ Validators.required] }),
      state: new Control("text", "Estado", "state", { validators: [ Validators.required] }),
      street: new Control("text", "Calle", "street", { validators: [ Validators.required] }),
      zipcode: new Control("text", "Código postal", "zipcode", { validators: [ Validators.required] }),
      interiorNumber: new Control("text", "Número interior", "interiorNumber"),
      latitude: new Control("text", "Latitud", "latitude"),
      longitude: new Control("text", "Longitud", "longitude"),
      neighborhood: new Control("text", "Colonia", "neighborhood"),
      photoUrl: new Control("text", "URL de la foto", "photoUrl"),
      type: new Control("text", "Tipo", "type"),

      description: new Control("textarea", "Descripción", "description"),
      id: new Control("number", "Célula", "id", { disabled: true }),
      createdAt: new Control("date", "Fecha de creación", "dateCreated", { disabled: true, hidden: true }),
      name: new Control("text", "Nombre", "name", { validators: [ Validators.required] }),
      enabled: new Control("text", "Habilitado", "enabled", { hidden: true }),
      visible: new Control("text", "Visible", "visible", { hidden: true }),
      isSelected: new Control("text", "Seleccionado", "isSelected"),
    }, { orientation: 'block', style: 'solid'});

    effect(() => {
      this.form.setUse(this.use());

      const value = this.item();

      if (value) {
        this.form.patch(this.use(), {
          ...value
        });
      }
    });
  }

  ngOnInit(): void {
    this.formsService.mode$.subscribe({ next: validation => {
      this.form.setValidation(validation)
    } });
  }

  onSubmit() {
    this.form.onSubmit();
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

  fillForm = () => this.use() === 'create' && this.form.patchWithSample();

  create() {
    if (this.form.submittable) {
      this.service.create(
        omitKeys(this.form.value,
          ['id', 'createdAt', 'enabled', 'visible', 'isSelected',
            'longitude', 'latitude', 'nursesCount', 'photoUrl']
        ), 'clinic'
      ).subscribe({
        next: item => this.form.submitted = false,
        error: (error: BadRequest) => this.form.error = error });
    }
  }

  update() {
    if (this.form.submittable) {
      this.service.update(+this.form.value.id, this.form.value).subscribe({
        next: () => this.form.submitted = false,
        error: (error: BadRequest) => this.form.error = error
      });
    }
  }
}

@Component({
  selector: 'div[addressDetail]',
  template: `
  <div container [type]="'inline'">
    <div detailHeader [(use)]="use" [view]="view()" [dictionary]="service.dictionary['Clinic']" [id]="item() ? item()!.id : undefined" (onDelete)="service.delete$(item()!, 'Clinic')"></div>
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
