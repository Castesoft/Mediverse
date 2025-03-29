import { Component, inject, model, ModelSignal } from "@angular/core";
import { CatalogMode, View, } from "src/app/_models/base/types";
import { User } from "src/app/_models/users/user";
import { UserParams } from "src/app/_models/users/userParams";
import { UsersTableComponent } from "src/app/users/components/users-table.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { UsersService } from "src/app/users/users.config";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { FilterConfiguration } from "../../_models/base/filter-types";

@Component({
  selector: '[usersCatalog]',
  templateUrl: './users-catalog.component.html',
  imports: [
    UsersTableComponent,
    GenericCatalogComponent,
    ControlsRow3Component,
    ControlsWrapper3Component,
    FormsModule
  ],
})
export class UsersCatalogComponent {
  item: ModelSignal<User | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<UserParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: UsersService = inject(UsersService);
  form: ModelSignal<UserFiltersForm> = model(new UserFiltersForm());
}
