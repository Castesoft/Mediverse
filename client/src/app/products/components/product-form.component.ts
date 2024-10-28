import { Component, OnInit, input, effect, InputSignal, ModelSignal, model } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Product, ProductForm } from "src/app/_models/product";
import { BadRequest, FormUse, View } from "src/app/_models/types";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { JsonPipe } from "@angular/common";
import { ControlsModule } from "src/app/_forms/controls.module";
import { ProductsService } from "src/app/_services/products.service";
import { FormComponent, FormGroupActions } from "src/app/_forms/form";
import { FormGroup2 } from "src/app/_forms/form2";

@Component({
  host: { class: 'pb-3', },
  selector: 'div[productForm]',
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, AlertModule, RouterModule, JsonPipe, ControlsModule, ],
})
export class ProductFormComponent extends FormComponent<ProductsService> implements OnInit, FormGroupActions<Product, FormGroup2<Product>> {
  item: ModelSignal<Product | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string> = model.required();

  form = new ProductForm();

  constructor() {
    super(ProductsService);

    effect(() => {
      const value = this.item();

      if (value) {
        this.form.patchValue(value as any);
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
      this.service.create(this.form, this.view()).subscribe({
        next: response => {
          this.form.onSuccess(response);
          this.use.set('detail');
        },
        error: (error: BadRequest) => this.form.error = error
      });
    }
  }

  update() {
    if (this.form.submittable) {
      this.service.update(this.form, this.view()).subscribe({
        next: response => {
          this.form.onSuccess(response);
          this.use.set('detail');
        },
        error: (error: BadRequest) => this.form.error = error
      });
    }
  }
}
