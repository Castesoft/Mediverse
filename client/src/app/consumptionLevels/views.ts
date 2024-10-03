import { Component, effect, inject, input, InputSignal, model, OnInit } from "@angular/core";
import { BadRequest, FormUse, View } from "src/app/_models/types";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Control, FormActions, FormComponent, FormGroupActions } from "src/app/_forms/form";
import { Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ConsumptionLevelsService, ConsumptionLevel } from "src/app/consumptionLevels/consumptionLevels.config";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";

@Component({
  selector: "[consumptionLevelForm]",
  template: `
  <form [id]="form.id" (ngSubmit)="onSubmit()">
  <div container [type]="'card'">
    @if (form.error) {
      <div errorsAlert [error]="form.error"></div>
    }
    <div formBuilder3 [controls]="[
      form.controls.id,
      form.controls.createdAt,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.code,
      form.controls.name,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.description,
    ]" [cols]="1"></div>
    <div formBuilder3 [controls]="[
      form.controls.enabled,
    ]" [cols]="1"></div>
    <div formBuilder3 [controls]="[
      form.controls.visible,
    ]" [cols]="1"></div>
  </div>

  @if(use() !== 'detail') {
    <div container [type]="'inline'">
      <div detailFooter [use]="use()" [view]="view()" [id]="item() ? item()!.id : undefined" [dictionary]="service.dictionary.ConsumptionLevels" [formId]="form.id"></div>
    </div>
  }
</form>

  `,
  standalone: true,
  imports: [ CommonModule, RouterModule, ControlsModule, FormNewModule, ]
})
export class ConsumptionLevelFormComponent extends FormComponent<ConsumptionLevelsService> implements OnInit, FormGroupActions<ConsumptionLevel, FormGroup2<ConsumptionLevel>> {
  item: InputSignal<ConsumptionLevel | undefined> = input.required();
  use: InputSignal<FormUse> = input.required();
  view: InputSignal<View> = input.required();
  key: InputSignal<string> = input.required();

  // form: ConsumptionLevelForm;

  info: FormInfo<ConsumptionLevel> = {
    code: { label: 'Código', placeholder: 'Código', type: 'text' },
    createdAt: { label: 'Fecha de creación', type: 'date', placeholder: 'Fecha de creación', isDisabled: true, },
    description: { label: 'Descripción', placeholder: 'Descripción', type: 'textarea' },
    enabled: { label: 'Habilitado', type: 'slideToggle', placeholder: 'Habilitado', },
    id: { label: 'Ganadería', placeholder: 'Ganadería', type: 'number', isDisabled: true },
    isSelected: { label: 'Seleccionado', placeholder: 'Seleccionado', type: 'slideToggle' },
    name: { label: 'Nombre', placeholder: 'Nombre', type: 'text' },
    visible: { label: 'Visible', type: 'slideToggle' },
  } as FormInfo<ConsumptionLevel>;

  form: FormGroup2<ConsumptionLevel> = new FormGroup2<ConsumptionLevel>(ConsumptionLevel, new ConsumptionLevel(), this.info, { orientation: 'inline', use: 'create' });

  constructor() {
    super(ConsumptionLevelsService);

    effect(() => {
      const value = this.item();

      if (value) {
        this.form = new FormGroup2<ConsumptionLevel>(ConsumptionLevel, value, this.info, { orientation: 'inline' });

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
    if (this.form.submittable) {
      this.service.create(this.form.getRawValue()).subscribe({
        next: item => this.form.submitted = false,
        error: (error: BadRequest) => this.form.error = error });
    }
  }

  update() {
    if (this.form.submittable) {
      this.service.update(+this.form.getRawValue().id!, this.form.getRawValue()).subscribe({
        next: () => this.form.submitted = false,
        error: (error: BadRequest) => this.form.error = error
      });
    }
  }
}

@Component({
  selector: 'div[consumptionLevelDetail]',
  template: `
  <div container [type]="'inline'">
    <div detailHeader [(use)]="use" [view]="view()" [dictionary]="service.dictionary.ConsumptionLevels" [id]="item() ? item()!.id : undefined" (onDelete)="service.delete$(item()!, 'ConsumptionLevels')"></div>
  </div>
  <div consumptionLevelForm [item]="item()" [key]="key()" [use]="use()" [view]="view()"></div>
  `,
  standalone: true,
  imports: [ConsumptionLevelFormComponent, ControlsModule,],
})
export class ConsumptionLevelDetailComponent {
  service = inject(ConsumptionLevelsService);

  use = model.required<FormUse>();
  view = input.required<View>();
  item = input.required<ConsumptionLevel | undefined>();
  key = input.required<string>();
}
