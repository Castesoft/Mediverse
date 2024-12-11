import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, ModelSignal, model, input, effect } from "@angular/core";
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

@Component({
  selector: '[usersCatalog]',
  template: ``,
  templateUrl: './users-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    UsersTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class UsersCatalogComponent
  extends BaseCatalog<User, UserParams, UserFiltersForm, UsersService>
  implements OnInit, OnDestroy, CatalogInputSignals<User, UserParams>
{
  item: ModelSignal<User | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<UserParams> = model.required();


  constructor() {
    super(UsersService, UserFiltersForm);

    effect(() => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active())
      ;

      this.service.createEntry(this.key(), this.params(), this.mode());

      this.service.cache$.subscribe({
        next: cache => {
          this.service.loadPagedList(this.key(), this.params()).subscribe();
        }
      });
    });
  }

  ngOnInit(): void {
    // this.service.param$(this.key(), this.mode()).subscribe({ next: params => this.params = params });
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
