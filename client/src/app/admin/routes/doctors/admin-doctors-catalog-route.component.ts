import { Component, inject, OnInit } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { User } from "src/app/_models/users/user";
import { UserParams } from "src/app/_models/users/userParams";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UsersService } from "src/app/users/users.config";
import { RolesService } from "src/app/roles/roles.config";
import { SelectOption } from "src/app/_models/base/selectOption";

@Component({
  selector: 'div[adminDoctorsCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div usersCatalog [(item)]="item" [(isCompact)]="compact.isCompact" [(key)]="key" [(mode)]="mode"
           [(params)]="params" [(view)]="view"></div>
    </div>
  `,
  standalone: false,
})
export class AdminDoctorsCatalogRouteComponent extends BaseRouteCatalog<User, UserParams, UserFiltersForm, UsersService> implements OnInit {
  roles: RolesService = inject(RolesService);

  constructor() {
    super(UsersService, 'users');
    this.params().fromSection = SiteSection.ADMIN
  }

  ngOnInit(): void {
    this.roles.getOptions().subscribe(
      {
        next: (options) => {
          this.params().roles = options.filter((option: SelectOption) => option.code === 'doctor')
        }
      });
  }
}
