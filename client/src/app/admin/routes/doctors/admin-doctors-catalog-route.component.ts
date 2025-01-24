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
      @if (!isLoading) {
        <div usersCatalog [(item)]="item" [(isCompact)]="compact.isCompact" [(key)]="key" [(mode)]="mode"
             [(params)]="params" [(view)]="view"></div>
      }
    </div>
  `,
  standalone: false,
})
export class AdminDoctorsCatalogRouteComponent extends BaseRouteCatalog<User, UserParams, UserFiltersForm, UsersService> implements OnInit {
  roles: RolesService = inject(RolesService);
  isLoading: boolean = true;

  constructor() {
    super(UsersService, 'users');
  }

  ngOnInit(): void {
    this.roles.getOptions().subscribe({
      next: (options) => {
        this.params.update((pastValue: any) => ({
          ...pastValue,
          roles: options.filter((option: SelectOption) => option.code.toLowerCase() === 'doctor'),
          fromSection: SiteSection.ADMIN,
        }));
        this.isLoading = false;
      }
    });
  }
}
