import { CommonModule } from "@angular/common";
import { Component, OnInit, ModelSignal, model, effect, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { View } from "src/app/_models/base/types";
import { FormGroupActions } from "src/app/_models/forms/formComponentInterfaces";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse, FormInfo } from "src/app/_models/forms/formTypes";
import { AddressesService } from "src/app/_services/addresses.service";

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
  imports: [ CommonModule, RouterModule, ControlsModule, Forms2Module, ]
})
export class AddressFormComponent {
  
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
  view = model.required<View>();
  item = model.required<Address | null>();
  key = model.required<string>();
}
