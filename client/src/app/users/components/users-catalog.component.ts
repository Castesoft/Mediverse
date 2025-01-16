import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { User } from "src/app/_models/users/user";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UserParams } from "src/app/_models/users/userParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { UsersTableComponent } from "src/app/users/components/users-table.component";
import { UsersService } from "src/app/users/users.config";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: '[usersCatalog]',
  templateUrl: './users-catalog.component.html',
  standalone: true,
  imports: [
    FontAwesomeModule,
    UsersTableComponent,
    CommonModule,
    RouterModule,
    ControlsModule,
    TablesModule,
    CdkModule,
    MaterialModule,
    Forms2Module,
  ],
})
export class UsersCatalogComponent extends BaseCatalog<User, UserParams, UserFiltersForm, UsersService> implements OnInit, OnDestroy, CatalogInputSignals<User, UserParams> {
  item: ModelSignal<User | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<UserParams> = model.required();

  constructor() {
    super(UsersService, UserFiltersForm);

    effect((): void => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active());
    });
  }

  ngOnInit(): void {
    this.service.loadPagedList(this.key(), this.params()).subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected readonly FormUse = FormUse;
}
