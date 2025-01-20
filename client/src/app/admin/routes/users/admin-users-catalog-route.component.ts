import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { User } from "src/app/_models/users/user";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UserParams } from "src/app/_models/users/userParams";
import { UsersService } from "src/app/users/users.config";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[adminUsersCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div usersCatalog [(item)]="item" [(isCompact)]="compact.isCompact" [(key)]="key" [(mode)]="mode"
           [(params)]="params" [(view)]="view"></div>
    </div>
  `,
  standalone: false,
})
export class AdminUsersCatalogRouteComponent extends BaseRouteCatalog<User, UserParams, UserFiltersForm, UsersService> {
  constructor() {
    super(UsersService, 'users');
    this.params().fromSection = SiteSection.ADMIN
  }
}
