import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';

@Component({
  host: { class: 'd-flex align-items-center ms-1 ms-lg-2', id: 'quickLinksDropdown'},
  selector: '[quickLinksDropdown]',
  template: `
    <div class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" dropdownToggle tabindex="0"

    >
      <i class="ki-duotone ki-element-plus fs-1">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
        <span class="path4"></span>
        <span class="path5"></span>
      </i>
    </div>
    <div class="dropdown-menu dropdown-menu-right menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px"
         *dropdownMenu>
      <div class="d-flex flex-column flex-center bgi-no-repeat rounded-top px-9 py-10"
           style="background-image:url('media/misc/menu-header-bg.jpg')">
        <h3 class="text-white fw-semibold mb-3">Quick Links</h3>
        <span class="badge bg-primary text-inverse-primary py-2 px-3">25 pending tasks</span>
      </div>
      <div class="row g-0">
        <div class="col-6">
          <a href="apps/projects/budget.html"
             class="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end border-bottom">
            <i class="ki-duotone ki-dollar fs-3x text-primary mb-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            <span class="fs-5 fw-semibold text-gray-800 mb-0">Accounting</span>
            <span class="fs-7 text-gray-500">eCommerce</span>
          </a>
        </div>
        <div class="col-6">
          <a href="apps/projects/settings.html"
             class="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-bottom">
            <i class="ki-duotone ki-sms fs-3x text-primary mb-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <span class="fs-5 fw-semibold text-gray-800 mb-0">Administration</span>
            <span class="fs-7 text-gray-500">Console</span>
          </a>
        </div>
        <div class="col-6">
          <a href="apps/projects/list.html" class="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end">
            <i class="ki-duotone ki-abstract-41 fs-3x text-primary mb-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <span class="fs-5 fw-semibold text-gray-800 mb-0">Projects</span>
            <span class="fs-7 text-gray-500">Pending Tasks</span>
          </a>
        </div>
        <div class="col-6">
          <a href="apps/projects/users.html" class="d-flex flex-column flex-center h-100 p-6 bg-hover-light">
            <i class="ki-duotone ki-briefcase fs-3x text-primary mb-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <span class="fs-5 fw-semibold text-gray-800 mb-0">Customers</span>
            <span class="fs-7 text-gray-500">Latest cases</span>
          </a>
        </div>
      </div>
      <div class="py-2 text-center border-top">
        <a href="pages/user-profile/activity.html" class="btn btn-color-gray-600 btn-active-color-primary">View All
          <i class="ki-duotone ki-arrow-right fs-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i></a>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ RouterModule, BootstrapModule,],
})
export class QuickLinksDropdownComponent {

}
