import { Component, input, viewChild } from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { UserFormComponent } from "src/app/users/components/user-form.component";

@Component({
  selector: 'div[userNewView]',
  template: `
  <div userForm [use]="use()" [id]="null" [view]="view()" [role]="role()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ UserFormComponent, ModalWrapperModule, ],
})
export class UserNewComponent {
  use = input.required<FormUse>();
  view = input.required<View>();
  role = input.required<Role>();

  formComponent = viewChild.required(UserFormComponent);

  onFillForm = () => this.formComponent().fillForm();
}

@Component({
  selector: 'div[userDetailView]',
  template: `
    <div class="d-flex flex-column flex-lg-row">
      <div class="flex-column flex-lg-row-auto w-lg-250px w-xl-350px mb-10">
        <div class="card mb-5 mb-xl-8">
          <div class="card-body">
            <div class="d-flex flex-center flex-column py-5">
              <div class="symbol symbol-100px symbol-circle mb-7">
                <img src="assets/media/avatars/300-6.jpg" alt="image">
              </div>
              <a href="#" class="fs-3 text-gray-800 text-hover-primary fw-bold mb-3">Emma Smith</a>
              <div class="mb-9">
                <div class="badge badge-lg badge-light-primary d-inline">Administrator</div>
              </div>
              <div class="fw-bold mb-3">Assigned Tickets
                <span class="ms-2" ddata-bs-toggle="popover" data-bs-trigger="hover" data-bs-html="true"
                      data-bs-content="Number of support tickets assigned, closed and pending this week.">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class="ki-duotone ki-information fs-7">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="path1"></span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="path2"></span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="path3"></span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</i>
\t\t\t\t\t\t\t\t\t\t\t\t\t</span></div>
              <div class="d-flex flex-wrap flex-center">
                <div class="border border-gray-300 border-dashed rounded py-3 px-3 mb-3">
                  <div class="fs-4 fw-bold text-gray-700">
                    <span class="w-75px">243</span>
                    <i class="ki-duotone ki-arrow-up fs-3 text-success">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                  <div class="fw-semibold text-muted">Total</div>
                </div>
                <div class="border border-gray-300 border-dashed rounded py-3 px-3 mx-4 mb-3">
                  <div class="fs-4 fw-bold text-gray-700">
                    <span class="w-50px">56</span>
                    <i class="ki-duotone ki-arrow-down fs-3 text-danger">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                  <div class="fw-semibold text-muted">Solved</div>
                </div>
                <div class="border border-gray-300 border-dashed rounded py-3 px-3 mb-3">
                  <div class="fs-4 fw-bold text-gray-700">
                    <span class="w-50px">188</span>
                    <i class="ki-duotone ki-arrow-up fs-3 text-success">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                  <div class="fw-semibold text-muted">Open</div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-stack fs-4 py-3">
              <div class="fw-bold rotate collapsible" data-bs-toggle="collapse" href="#kt_user_view_details"
                   role="button"
                   aria-expanded="false" aria-controls="kt_user_view_details">Details
                <span class="ms-2 rotate-180">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class="ki-duotone ki-down fs-3"></i>
\t\t\t\t\t\t\t\t\t\t\t\t\t</span></div>
              <span data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-original-title="Edit customer details"
                    data-kt-initialized="1">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="btn btn-sm btn-light-primary" data-bs-toggle="modal"
                               data-bs-target="#kt_modal_update_details">Edit</a>
\t\t\t\t\t\t\t\t\t\t\t\t\t</span>
            </div>
            <div class="separator"></div>
            <div id="kt_user_view_details" class="collapse show">
              <div class="pb-5 fs-6">
                <div class="fw-bold mt-5">Account ID</div>
                <div class="text-gray-600">ID-45453423</div>
                <div class="fw-bold mt-5">Email</div>
                <div class="text-gray-600">
                  <a href="#" class="text-gray-600 text-hover-primary">infokeenthemes.com</a>
                </div>
                <div class="fw-bold mt-5">Address</div>
                <div class="text-gray-600">101 Collin Street,
                  <br>Melbourne 3000 VIC
                  <br>Australia
                </div>
                <div class="fw-bold mt-5">Language</div>
                <div class="text-gray-600">English</div>
                <div class="fw-bold mt-5">Last Login</div>
                <div class="text-gray-600">21 Feb 2024, 2:40 pm</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-5 mb-xl-8">
          <div class="card-header border-0">
            <div class="card-title">
              <h3 class="fw-bold m-0">Connected Accounts</h3>
            </div>
          </div>
          <div class="card-body pt-2">
            <div class="notice d-flex bg-light-primary rounded border-primary border border-dashed mb-9 p-6">
              <i class="ki-duotone ki-design-1 fs-2tx text-primary me-4"></i>
              <div class="d-flex flex-stack flex-grow-1">
                <div class="fw-semibold">
                  <div class="fs-6 text-gray-700">By connecting an account, you hereby agree to our
                    <a href="#" class="me-1">privacy policy</a>and
                    <a href="#">terms of use</a>.
                  </div>
                </div>
              </div>
            </div>
            <div class="py-2">
              <div class="d-flex flex-stack">
                <div class="d-flex">
                  <img src="assets/media/svg/brand-logos/google-icon.svg" class="w-30px me-6" alt="">
                  <div class="d-flex flex-column">
                    <a href="#" class="fs-5 text-gray-900 text-hover-primary fw-bold">Google</a>
                    <div class="fs-6 fw-semibold text-muted">Plan properly your workflow</div>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                    <input class="form-check-input" name="google" type="checkbox" value="1"
                           id="kt_modal_connected_accounts_google" checked="checked">
                    <span class="form-check-label fw-semibold text-muted"
                          for="kt_modal_connected_accounts_google"></span>
                  </label>
                </div>
              </div>
              <div class="separator separator-dashed my-5"></div>
              <div class="d-flex flex-stack">
                <div class="d-flex">
                  <img src="assets/media/svg/brand-logos/github.svg" class="w-30px me-6" alt="">
                  <div class="d-flex flex-column">
                    <a href="#" class="fs-5 text-gray-900 text-hover-primary fw-bold">Github</a>
                    <div class="fs-6 fw-semibold text-muted">Keep eye on on your Repositories</div>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                    <input class="form-check-input" name="github" type="checkbox" value="1"
                           id="kt_modal_connected_accounts_github" checked="checked">
                    <span class="form-check-label fw-semibold text-muted"
                          for="kt_modal_connected_accounts_github"></span>
                  </label>
                </div>
              </div>
              <div class="separator separator-dashed my-5"></div>
              <div class="d-flex flex-stack">
                <div class="d-flex">
                  <img src="assets/media/svg/brand-logos/slack-icon.svg" class="w-30px me-6" alt="">
                  <div class="d-flex flex-column">
                    <a href="#" class="fs-5 text-gray-900 text-hover-primary fw-bold">Slack</a>
                    <div class="fs-6 fw-semibold text-muted">Integrate Projects Discussions</div>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                    <input class="form-check-input" name="slack" type="checkbox" value="1"
                           id="kt_modal_connected_accounts_slack">
                    <span class="form-check-label fw-semibold text-muted"
                          for="kt_modal_connected_accounts_slack"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer border-0 d-flex justify-content-center pt-0">
            <button class="btn btn-sm btn-light-primary">Save Changes</button>
          </div>
        </div>
      </div>
      <div class="flex-lg-row-fluid ms-lg-15">
        <ul class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8"
            role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link text-active-primary pb-4 active" data-bs-toggle="tab" href="#kt_user_view_overview_tab"
               aria-selected="true" role="tab">Overview</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link text-active-primary pb-4" data-kt-countup-tabs="true" data-bs-toggle="tab"
               href="#kt_user_view_overview_security" data-kt-initialized="1" aria-selected="false" tabindex="-1"
               role="tab">Security</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link text-active-primary pb-4" data-bs-toggle="tab"
               href="#kt_user_view_overview_events_and_logs_tab" aria-selected="false" tabindex="-1" role="tab">Events
              &amp;
              Logs</a>
          </li>
          <li class="nav-item ms-auto">
            <a href="#" class="btn btn-primary ps-7" data-kt-menu-trigger="click" data-kt-menu-attach="parent"
               data-kt-menu-placement="bottom-end">Actions
              <i class="ki-duotone ki-down fs-2 me-0"></i></a>
            <div
              class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold py-4 w-250px fs-6"
              data-kt-menu="true" style="">
              <div class="menu-item px-5">
                <div class="menu-content text-muted pb-2 px-5 fs-7 text-uppercase">Payments</div>
              </div>
              <div class="menu-item px-5">
                <a href="#" class="menu-link px-5">Create invoice</a>
              </div>
              <div class="menu-item px-5">
                <a href="#" class="menu-link flex-stack px-5">Create payments
                  <span class="ms-2" data-bs-toggle="tooltip"
                        aria-label="Specify a target name for future usage and reference"
                        data-bs-original-title="Specify a target name for future usage and reference"
                        data-kt-initialized="1">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class="ki-duotone ki-information fs-7">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="path1"></span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="path2"></span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="path3"></span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</i>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span></a>
              </div>
              <div class="menu-item px-5" data-kt-menu-trigger="hover" data-kt-menu-placement="left-start">
                <a href="#" class="menu-link px-5">
                  <span class="menu-title">Subscription</span>
                  <span class="menu-arrow"></span>
                </a>
                <div class="menu-sub menu-sub-dropdown w-175px py-4" style="">
                  <div class="menu-item px-3">
                    <a href="#" class="menu-link px-5">Apps</a>
                  </div>
                  <div class="menu-item px-3">
                    <a href="#" class="menu-link px-5">Billing</a>
                  </div>
                  <div class="menu-item px-3">
                    <a href="#" class="menu-link px-5">Statements</a>
                  </div>
                  <div class="separator my-2"></div>
                  <div class="menu-item px-3">
                    <div class="menu-content px-3">
                      <label class="form-check form-switch form-check-custom form-check-solid">
                        <input class="form-check-input w-30px h-20px" type="checkbox" value="" name="notifications"
                               checked="checked" id="kt_user_menu_notifications">
                        <span class="form-check-label text-muted fs-6"
                              for="kt_user_menu_notifications">Notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="separator my-3"></div>
              <div class="menu-item px-5">
                <div class="menu-content text-muted pb-2 px-5 fs-7 text-uppercase">Account</div>
              </div>
              <div class="menu-item px-5">
                <a href="#" class="menu-link px-5">Reports</a>
              </div>
              <div class="menu-item px-5 my-1">
                <a href="#" class="menu-link px-5">Account Settings</a>
              </div>
              <div class="menu-item px-5">
                <a href="#" class="menu-link text-danger px-5">Delete customer</a>
              </div>
            </div>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="kt_user_view_overview_tab" role="tabpanel">
            <div class="card card-flush mb-6 mb-xl-9">
              <div class="card-header mt-6">
                <div class="card-title flex-column">
                  <h2 class="mb-1">User's Schedule</h2>
                  <div class="fs-6 fw-semibold text-muted">2 upcoming meetings</div>
                </div>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-light-primary btn-sm" data-bs-toggle="modal"
                          data-bs-target="#kt_modal_add_schedule">
                    <i class="ki-duotone ki-brush fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>Add Schedule
                  </button>
                </div>
              </div>
              <div class="card-body p-9 pt-4">
                <ul class="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2" role="tablist">
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_0" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Su</span>
                      <span class="fs-6 fw-bolder">21</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary active"
                      data-bs-toggle="tab" href="#kt_schedule_day_1" aria-selected="true" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Mo</span>
                      <span class="fs-6 fw-bolder">22</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_2" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Tu</span>
                      <span class="fs-6 fw-bolder">23</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_3" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">We</span>
                      <span class="fs-6 fw-bolder">24</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_4" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Th</span>
                      <span class="fs-6 fw-bolder">25</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_5" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Fr</span>
                      <span class="fs-6 fw-bolder">26</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_6" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Sa</span>
                      <span class="fs-6 fw-bolder">27</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_7" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Su</span>
                      <span class="fs-6 fw-bolder">28</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_8" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Mo</span>
                      <span class="fs-6 fw-bolder">29</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_9" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">Tu</span>
                      <span class="fs-6 fw-bolder">30</span>
                    </a>
                  </li>
                  <li class="nav-item me-1" role="presentation">
                    <a
                      class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-40px me-2 py-4 btn-active-primary"
                      data-bs-toggle="tab" href="#kt_schedule_day_10" aria-selected="false" tabindex="-1" role="tab">
                      <span class="opacity-50 fs-7 fw-semibold">We</span>
                      <span class="fs-6 fw-bolder">31</span>
                    </a>
                  </li>
                </ul>
                <div class="tab-content">
                  <div id="kt_schedule_day_0" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">12:00 - 13:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Sales Pitch Proposal</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Karina Clarke</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">12:00 - 13:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Creative Content
                          Initiative</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Walter White</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">12:00 - 13:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Weekly Team Stand-Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Karina Clarke</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_1" class="tab-pane fade show active" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Yannis Gloverson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Weekly Team Stand-Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Caleb Donaldson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">11:00 - 11:45
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Weekly Team Stand-Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Walter White</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Weekly Team Stand-Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">David Stevenson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_2" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Yannis Gloverson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">11:00 - 11:45
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Project Review &amp;
                          Testing</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Naomi Hayabusa</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Marketing Campaign
                          Discussion</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Kendell Trevor</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_3" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">11:00 - 11:45
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">9 Degree Project
                          Estimation
                          Meeting</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Walter White</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Peter Marcus</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Lunch &amp; Learn Catch
                          Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Bob Harris</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Project Review &amp;
                          Testing</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Sean Bean</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_4" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Sean Bean</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Weekly Team Stand-Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Mark Randall</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">12:00 - 13:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Development Team Capacity
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Peter Marcus</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">11:00 - 11:45
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Development Team Capacity
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Kendell Trevor</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_5" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">9:00 - 10:00
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Committee Review
                          Approvals</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Naomi Hayabusa</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Project Review &amp;
                          Testing</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Michael Walters</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Development Team Capacity
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Peter Marcus</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Marketing Campaign
                          Discussion</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Karina Clarke</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_6" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Project Review &amp;
                          Testing</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Walter White</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">9:00 - 10:00
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Lunch &amp; Learn Catch
                          Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Walter White</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Marketing Campaign
                          Discussion</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Yannis Gloverson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_7" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Creative Content
                          Initiative</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Bob Harris</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">9:00 - 10:00
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Sales Pitch Proposal</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Sean Bean</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Sales Pitch Proposal</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">David Stevenson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_8" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">9 Degree Project
                          Estimation
                          Meeting</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Terry Robins</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">9:00 - 10:00
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Naomi Hayabusa</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Walter White</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Committee Review
                          Approvals</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Karina Clarke</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_9" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Marketing Campaign
                          Discussion</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Bob Harris</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">13:00 - 14:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Sales Pitch Proposal</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">David Stevenson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">14:30 - 15:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">David Stevenson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">12:00 - 13:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Michael Walters</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                  <div id="kt_schedule_day_10" class="tab-pane fade show" role="tabpanel">
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">12:00 - 13:00
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Marketing Campaign
                          Discussion</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Caleb Donaldson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">11:00 - 11:45
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">9 Degree Project
                          Estimation
                          Meeting</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Caleb Donaldson</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">16:30 - 17:30
                          <span class="fs-7 text-muted text-uppercase">pm</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Dashboard UI/UX Design
                          Review</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Michael Walters</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                    <div class="d-flex flex-stack position-relative mt-6">
                      <div class="position-absolute h-100 w-4px bg-secondary rounded top-0 start-0"></div>
                      <div class="fw-semibold ms-5">
                        <div class="fs-7 mb-1">9:00 - 10:00
                          <span class="fs-7 text-muted text-uppercase">am</span></div>
                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">Lunch &amp; Learn Catch
                          Up</a>
                        <div class="fs-7 text-muted">Lead by
                          <a href="#">Karina Clarke</a></div>
                      </div>
                      <a href="#" class="btn btn-light bnt-active-light-primary btn-sm">View</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card card-flush mb-6 mb-xl-9">
              <div class="card-header mt-6">
                <div class="card-title flex-column">
                  <h2 class="mb-1">User's Tasks</h2>
                  <div class="fs-6 fw-semibold text-muted">Total 25 tasks in backlog</div>
                </div>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-light-primary btn-sm" data-bs-toggle="modal"
                          data-bs-target="#kt_modal_add_task">
                    <i class="ki-duotone ki-add-files fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>Add Task
                  </button>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-center position-relative mb-7">
                  <div class="position-absolute top-0 start-0 rounded h-100 bg-secondary w-4px"></div>
                  <div class="fw-semibold ms-5">
                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary">Create FureStibe branding logo</a>
                    <div class="fs-7 text-muted">Due in 1 day
                      <a href="#">Karina Clark</a></div>
                  </div>
                  <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <i class="ki-duotone ki-setting-3 fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true"
                       data-kt-menu-id="kt-users-tasks">
                    <div class="px-7 py-5">
                      <div class="fs-5 text-gray-900 fw-bold">Update Status</div>
                    </div>
                    <div class="separator border-gray-200"></div>
                    <form class="form px-7 py-5 fv-plugins-bootstrap5 fv-plugins-framework"
                          data-kt-menu-id="kt-users-tasks-form">
                      <div class="fv-row mb-10 fv-plugins-icon-container">
                        <label class="form-label fs-6 fw-semibold">Status:</label>
                        <select class="form-select form-select-solid select2-hidden-accessible" name="task_status"
                                data-kt-select2="true" data-placeholder="Select option" data-allow-clear="true"
                                data-hide-search="true" data-select2-id="select2-data-7-refi" tabindex="-1"
                                aria-hidden="true" data-kt-initialized="1">
                          <option data-select2-id="select2-data-9-ofah"></option>
                          <option value="1">Approved</option>
                          <option value="2">Pending</option>
                          <option value="3">In Process</option>
                          <option value="4">Rejected</option>
                        </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                                       data-select2-id="select2-data-8-oedz" style="width: 100%;"><span
                        class="selection"><span
                        class="select2-selection select2-selection--single form-select form-select-solid"
                        role="combobox"
                        aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                        aria-labelledby="select2-task_status-rx-container"
                        aria-controls="select2-task_status-rx-container"><span
                        class="select2-selection__rendered" id="select2-task_status-rx-container" role="textbox"
                        aria-readonly="true" title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
                        class="select2-selection__arrow" role="presentation"><b
                        role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                                           aria-hidden="true"></span></span>
                        <div
                          class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-light btn-active-light-primary me-2"
                                data-kt-users-update-task-status="reset">Reset
                        </button>
                        <button type="submit" class="btn btn-sm btn-primary" data-kt-users-update-task-status="submit">
                          <span class="indicator-label">Apply</span>
                          <span class="indicator-progress">Please wait...
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="d-flex align-items-center position-relative mb-7">
                  <div class="position-absolute top-0 start-0 rounded h-100 bg-secondary w-4px"></div>
                  <div class="fw-semibold ms-5">
                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary">Schedule a meeting with FireBear
                      CTO
                      John</a>
                    <div class="fs-7 text-muted">Due in 3 days
                      <a href="#">Rober Doe</a></div>
                  </div>
                  <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <i class="ki-duotone ki-setting-3 fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true"
                       data-kt-menu-id="kt-users-tasks">
                    <div class="px-7 py-5">
                      <div class="fs-5 text-gray-900 fw-bold">Update Status</div>
                    </div>
                    <div class="separator border-gray-200"></div>
                    <form class="form px-7 py-5 fv-plugins-bootstrap5 fv-plugins-framework"
                          data-kt-menu-id="kt-users-tasks-form">
                      <div class="fv-row mb-10 fv-plugins-icon-container">
                        <label class="form-label fs-6 fw-semibold">Status:</label>
                        <select class="form-select form-select-solid select2-hidden-accessible" name="task_status"
                                data-kt-select2="true" data-placeholder="Select option" data-allow-clear="true"
                                data-hide-search="true" data-select2-id="select2-data-10-zuuc" tabindex="-1"
                                aria-hidden="true" data-kt-initialized="1">
                          <option data-select2-id="select2-data-12-u1i1"></option>
                          <option value="1">Approved</option>
                          <option value="2">Pending</option>
                          <option value="3">In Process</option>
                          <option value="4">Rejected</option>
                        </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                                       data-select2-id="select2-data-11-8vo6" style="width: 100%;"><span
                        class="selection"><span
                        class="select2-selection select2-selection--single form-select form-select-solid"
                        role="combobox"
                        aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                        aria-labelledby="select2-task_status-5d-container"
                        aria-controls="select2-task_status-5d-container"><span
                        class="select2-selection__rendered" id="select2-task_status-5d-container" role="textbox"
                        aria-readonly="true" title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
                        class="select2-selection__arrow" role="presentation"><b
                        role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                                           aria-hidden="true"></span></span>
                        <div
                          class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-light btn-active-light-primary me-2"
                                data-kt-users-update-task-status="reset">Reset
                        </button>
                        <button type="submit" class="btn btn-sm btn-primary" data-kt-users-update-task-status="submit">
                          <span class="indicator-label">Apply</span>
                          <span class="indicator-progress">Please wait...
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="d-flex align-items-center position-relative mb-7">
                  <div class="position-absolute top-0 start-0 rounded h-100 bg-secondary w-4px"></div>
                  <div class="fw-semibold ms-5">
                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary">9 Degree Project Estimation</a>
                    <div class="fs-7 text-muted">Due in 1 week
                      <a href="#">Neil Owen</a></div>
                  </div>
                  <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <i class="ki-duotone ki-setting-3 fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true"
                       data-kt-menu-id="kt-users-tasks">
                    <div class="px-7 py-5">
                      <div class="fs-5 text-gray-900 fw-bold">Update Status</div>
                    </div>
                    <div class="separator border-gray-200"></div>
                    <form class="form px-7 py-5 fv-plugins-bootstrap5 fv-plugins-framework"
                          data-kt-menu-id="kt-users-tasks-form">
                      <div class="fv-row mb-10 fv-plugins-icon-container">
                        <label class="form-label fs-6 fw-semibold">Status:</label>
                        <select class="form-select form-select-solid select2-hidden-accessible" name="task_status"
                                data-kt-select2="true" data-placeholder="Select option" data-allow-clear="true"
                                data-hide-search="true" data-select2-id="select2-data-13-jg8i" tabindex="-1"
                                aria-hidden="true" data-kt-initialized="1">
                          <option data-select2-id="select2-data-15-a9tt"></option>
                          <option value="1">Approved</option>
                          <option value="2">Pending</option>
                          <option value="3">In Process</option>
                          <option value="4">Rejected</option>
                        </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                                       data-select2-id="select2-data-14-3vup" style="width: 100%;"><span
                        class="selection"><span
                        class="select2-selection select2-selection--single form-select form-select-solid"
                        role="combobox"
                        aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                        aria-labelledby="select2-task_status-t1-container"
                        aria-controls="select2-task_status-t1-container"><span
                        class="select2-selection__rendered" id="select2-task_status-t1-container" role="textbox"
                        aria-readonly="true" title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
                        class="select2-selection__arrow" role="presentation"><b
                        role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                                           aria-hidden="true"></span></span>
                        <div
                          class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-light btn-active-light-primary me-2"
                                data-kt-users-update-task-status="reset">Reset
                        </button>
                        <button type="submit" class="btn btn-sm btn-primary" data-kt-users-update-task-status="submit">
                          <span class="indicator-label">Apply</span>
                          <span class="indicator-progress">Please wait...
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="d-flex align-items-center position-relative mb-7">
                  <div class="position-absolute top-0 start-0 rounded h-100 bg-secondary w-4px"></div>
                  <div class="fw-semibold ms-5">
                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary">Dashboard UI &amp; UX for Leafr
                      CRM</a>
                    <div class="fs-7 text-muted">Due in 1 week
                      <a href="#">Olivia Wild</a></div>
                  </div>
                  <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <i class="ki-duotone ki-setting-3 fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true"
                       data-kt-menu-id="kt-users-tasks">
                    <div class="px-7 py-5">
                      <div class="fs-5 text-gray-900 fw-bold">Update Status</div>
                    </div>
                    <div class="separator border-gray-200"></div>
                    <form class="form px-7 py-5 fv-plugins-bootstrap5 fv-plugins-framework"
                          data-kt-menu-id="kt-users-tasks-form">
                      <div class="fv-row mb-10 fv-plugins-icon-container">
                        <label class="form-label fs-6 fw-semibold">Status:</label>
                        <select class="form-select form-select-solid select2-hidden-accessible" name="task_status"
                                data-kt-select2="true" data-placeholder="Select option" data-allow-clear="true"
                                data-hide-search="true" data-select2-id="select2-data-16-u51u" tabindex="-1"
                                aria-hidden="true" data-kt-initialized="1">
                          <option data-select2-id="select2-data-18-s4iz"></option>
                          <option value="1">Approved</option>
                          <option value="2">Pending</option>
                          <option value="3">In Process</option>
                          <option value="4">Rejected</option>
                        </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                                       data-select2-id="select2-data-17-nw41" style="width: 100%;"><span
                        class="selection"><span
                        class="select2-selection select2-selection--single form-select form-select-solid"
                        role="combobox"
                        aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                        aria-labelledby="select2-task_status-ew-container"
                        aria-controls="select2-task_status-ew-container"><span
                        class="select2-selection__rendered" id="select2-task_status-ew-container" role="textbox"
                        aria-readonly="true" title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
                        class="select2-selection__arrow" role="presentation"><b
                        role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                                           aria-hidden="true"></span></span>
                        <div
                          class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-light btn-active-light-primary me-2"
                                data-kt-users-update-task-status="reset">Reset
                        </button>
                        <button type="submit" class="btn btn-sm btn-primary" data-kt-users-update-task-status="submit">
                          <span class="indicator-label">Apply</span>
                          <span class="indicator-progress">Please wait...
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="d-flex align-items-center position-relative">
                  <div class="position-absolute top-0 start-0 rounded h-100 bg-secondary w-4px"></div>
                  <div class="fw-semibold ms-5">
                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary">Mivy App R&amp;D, Meeting with
                      clients</a>
                    <div class="fs-7 text-muted">Due in 2 weeks
                      <a href="#">Sean Bean</a></div>
                  </div>
                  <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <i class="ki-duotone ki-setting-3 fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true"
                       data-kt-menu-id="kt-users-tasks">
                    <div class="px-7 py-5">
                      <div class="fs-5 text-gray-900 fw-bold">Update Status</div>
                    </div>
                    <div class="separator border-gray-200"></div>
                    <form class="form px-7 py-5 fv-plugins-bootstrap5 fv-plugins-framework"
                          data-kt-menu-id="kt-users-tasks-form">
                      <div class="fv-row mb-10 fv-plugins-icon-container">
                        <label class="form-label fs-6 fw-semibold">Status:</label>
                        <select class="form-select form-select-solid select2-hidden-accessible" name="task_status"
                                data-kt-select2="true" data-placeholder="Select option" data-allow-clear="true"
                                data-hide-search="true" data-select2-id="select2-data-19-xxpo" tabindex="-1"
                                aria-hidden="true" data-kt-initialized="1">
                          <option data-select2-id="select2-data-21-mm0m"></option>
                          <option value="1">Approved</option>
                          <option value="2">Pending</option>
                          <option value="3">In Process</option>
                          <option value="4">Rejected</option>
                        </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                                       data-select2-id="select2-data-20-5wzq" style="width: 100%;"><span
                        class="selection"><span
                        class="select2-selection select2-selection--single form-select form-select-solid"
                        role="combobox"
                        aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
                        aria-labelledby="select2-task_status-3m-container"
                        aria-controls="select2-task_status-3m-container"><span
                        class="select2-selection__rendered" id="select2-task_status-3m-container" role="textbox"
                        aria-readonly="true" title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
                        class="select2-selection__arrow" role="presentation"><b
                        role="presentation"></b></span></span></span><span class="dropdown-wrapper"
                                                                           aria-hidden="true"></span></span>
                        <div
                          class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-light btn-active-light-primary me-2"
                                data-kt-users-update-task-status="reset">Reset
                        </button>
                        <button type="submit" class="btn btn-sm btn-primary" data-kt-users-update-task-status="submit">
                          <span class="indicator-label">Apply</span>
                          <span class="indicator-progress">Please wait...
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="kt_user_view_overview_security" role="tabpanel">
            <div class="card pt-4 mb-6 mb-xl-9">
              <div class="card-header border-0">
                <div class="card-title">
                  <h2>Profile</h2>
                </div>
              </div>
              <div class="card-body pt-0 pb-5">
                <div class="table-responsive">
                  <table class="table align-middle table-row-dashed gy-5" id="kt_table_users_login_session">
                    <tbody class="fs-6 fw-semibold text-gray-600">
                    <tr>
                      <td>Email</td>
                      <td>smithkpmg.com</td>
                      <td class="text-end">
                        <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                                data-bs-toggle="modal" data-bs-target="#kt_modal_update_email">
                          <i class="ki-duotone ki-pencil fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Password</td>
                      <td>******</td>
                      <td class="text-end">
                        <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                                data-bs-toggle="modal" data-bs-target="#kt_modal_update_password">
                          <i class="ki-duotone ki-pencil fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Role</td>
                      <td>Administrator</td>
                      <td class="text-end">
                        <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                                data-bs-toggle="modal" data-bs-target="#kt_modal_update_role">
                          <i class="ki-duotone ki-pencil fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="card pt-4 mb-6 mb-xl-9">
              <div class="card-header border-0">
                <div class="card-title flex-column">
                  <h2 class="mb-1">Two Step Authentication</h2>
                  <div class="fs-6 fw-semibold text-muted">Keep your account extra secure with a second authentication
                    step.
                  </div>
                </div>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-light-primary btn-sm" data-kt-menu-trigger="click"
                          data-kt-menu-placement="bottom-end">
                    <i class="ki-duotone ki-fingerprint-scanning fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>Add Authentication Step
                  </button>
                  <div
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-6 w-200px py-4"
                    data-kt-menu="true">
                    <div class="menu-item px-3">
                      <a href="#" class="menu-link px-3" data-bs-toggle="modal" data-bs-target="#kt_modal_add_auth_app">Use
                        authenticator app</a>
                    </div>
                    <div class="menu-item px-3">
                      <a href="#" class="menu-link px-3" data-bs-toggle="modal"
                         data-bs-target="#kt_modal_add_one_time_password">Enable one-time password</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body pb-5">
                <div class="d-flex flex-stack">
                  <div class="d-flex flex-column">
                    <span>SMS</span>
                    <span class="text-muted fs-6">+61 412 345 678</span>
                  </div>
                  <div class="d-flex justify-content-end align-items-center">
                    <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto me-5"
                            data-bs-toggle="modal" data-bs-target="#kt_modal_add_one_time_password">
                      <i class="ki-duotone ki-pencil fs-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </button>
                    <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                            id="kt_users_delete_two_step">
                      <i class="ki-duotone ki-trash fs-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                    </button>
                  </div>
                </div>
                <div class="separator separator-dashed my-5"></div>
                <div class="text-gray-600">If you lose your mobile device or security key, you can
                  <a href="#" class="me-1">generate a backup code</a>to sign in to your account.
                </div>
              </div>
            </div>
            <div class="card pt-4 mb-6 mb-xl-9">
              <div class="card-header border-0">
                <div class="card-title flex-column">
                  <h2>Email Notifications</h2>
                  <div class="fs-6 fw-semibold text-muted">Choose what messages you’d like to receive for each of your
                    accounts.
                  </div>
                </div>
              </div>
              <div class="card-body">
                <form class="form" id="kt_users_email_notification_form">
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_0" type="checkbox" value="0"
                             id="kt_modal_update_email_notification_0" checked="checked">
                      <label class="form-check-label" for="kt_modal_update_email_notification_0">
                        <div class="fw-bold">Successful Payments</div>
                        <div class="text-gray-600">Receive a notification for every successful payment.</div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_1" type="checkbox" value="1"
                             id="kt_modal_update_email_notification_1">
                      <label class="form-check-label" for="kt_modal_update_email_notification_1">
                        <div class="fw-bold">Payouts</div>
                        <div class="text-gray-600">Receive a notification for every initiated payout.</div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_2" type="checkbox" value="2"
                             id="kt_modal_update_email_notification_2">
                      <label class="form-check-label" for="kt_modal_update_email_notification_2">
                        <div class="fw-bold">Application fees</div>
                        <div class="text-gray-600">Receive a notification each time you collect a fee from an account.
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_3" type="checkbox" value="3"
                             id="kt_modal_update_email_notification_3" checked="checked">
                      <label class="form-check-label" for="kt_modal_update_email_notification_3">
                        <div class="fw-bold">Disputes</div>
                        <div class="text-gray-600">Receive a notification if a payment is disputed by a customer and for
                          dispute resolutions.
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_4" type="checkbox" value="4"
                             id="kt_modal_update_email_notification_4" checked="checked">
                      <label class="form-check-label" for="kt_modal_update_email_notification_4">
                        <div class="fw-bold">Payment reviews</div>
                        <div class="text-gray-600">Receive a notification if a payment is marked as an elevated risk.
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_5" type="checkbox" value="5"
                             id="kt_modal_update_email_notification_5">
                      <label class="form-check-label" for="kt_modal_update_email_notification_5">
                        <div class="fw-bold">Mentions</div>
                        <div class="text-gray-600">Receive a notification if a teammate mentions you in a note.</div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_6" type="checkbox" value="6"
                             id="kt_modal_update_email_notification_6">
                      <label class="form-check-label" for="kt_modal_update_email_notification_6">
                        <div class="fw-bold">Invoice Mispayments</div>
                        <div class="text-gray-600">Receive a notification if a customer sends an incorrect amount to pay
                          their invoice.
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_7" type="checkbox" value="7"
                             id="kt_modal_update_email_notification_7">
                      <label class="form-check-label" for="kt_modal_update_email_notification_7">
                        <div class="fw-bold">Webhooks</div>
                        <div class="text-gray-600">Receive notifications about consistently failing webhook endpoints.
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="separator separator-dashed my-5"></div>
                  <div class="d-flex">
                    <div class="form-check form-check-custom form-check-solid">
                      <input class="form-check-input me-3" name="email_notification_8" type="checkbox" value="8"
                             id="kt_modal_update_email_notification_8">
                      <label class="form-check-label" for="kt_modal_update_email_notification_8">
                        <div class="fw-bold">Trial</div>
                        <div class="text-gray-600">Receive helpful tips when you try out our products.</div>
                      </label>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end align-items-center mt-12">
                    <button type="button" class="btn btn-light me-5" id="kt_users_email_notification_cancel">Cancel
                    </button>
                    <button type="button" class="btn btn-primary" id="kt_users_email_notification_submit">
                      <span class="indicator-label">Save</span>
                      <span class="indicator-progress">Please wait...
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="kt_user_view_overview_events_and_logs_tab" role="tabpanel">
            <div class="card pt-4 mb-6 mb-xl-9">
              <div class="card-header border-0">
                <div class="card-title">
                  <h2>Login Sessions</h2>
                </div>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-sm btn-flex btn-light-primary" id="kt_modal_sign_out_sesions">
                    <i class="ki-duotone ki-entrance-right fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>Sign out all sessions
                  </button>
                </div>
              </div>
              <div class="card-body pt-0 pb-5">
                <div class="table-responsive">
                  <table class="table align-middle table-row-dashed gy-5" id="kt_table_users_login_session">
                    <thead class="border-bottom border-gray-200 fs-7 fw-bold">
                    <tr class="text-start text-muted text-uppercase gs-0">
                      <th class="min-w-100px">Location</th>
                      <th>Device</th>
                      <th>IP Address</th>
                      <th class="min-w-125px">Time</th>
                      <th class="min-w-70px">Actions</th>
                    </tr>
                    </thead>
                    <tbody class="fs-6 fw-semibold text-gray-600">
                    <tr>
                      <td>Australia</td>
                      <td>Chome - Windows</td>
                      <td>207.46.15.113</td>
                      <td>23 seconds ago</td>
                      <td>Current session</td>
                    </tr>
                    <tr>
                      <td>Australia</td>
                      <td>Safari - iOS</td>
                      <td>207.39.21.51</td>
                      <td>3 days ago</td>
                      <td>
                        <a href="#" data-kt-users-sign-out="single_user">Sign out</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Australia</td>
                      <td>Chrome - Windows</td>
                      <td>207.24.31.215</td>
                      <td>last week</td>
                      <td>Expired</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="card pt-4 mb-6 mb-xl-9">
              <div class="card-header border-0">
                <div class="card-title">
                  <h2>Logs</h2>
                </div>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-sm btn-light-primary">
                    <i class="ki-duotone ki-cloud-download fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>Download Report
                  </button>
                </div>
              </div>
              <div class="card-body py-0">
                <div class="table-responsive">
                  <table class="table align-middle table-row-dashed fw-semibold text-gray-600 fs-6 gy-5"
                         id="kt_table_users_logs">
                    <tbody>
                    <tr>
                      <td class="min-w-70px">
                        <div class="badge badge-light-success">200 OK</div>
                      </td>
                      <td>POST /v1/invoices/in_9933_4311/payment</td>
                      <td class="pe-0 text-end min-w-200px">22 Sep 2024, 11:30 am</td>
                    </tr>
                    <tr>
                      <td class="min-w-70px">
                        <div class="badge badge-light-danger">500 ERR</div>
                      </td>
                      <td>POST /v1/invoice/in_6954_1164/invalid</td>
                      <td class="pe-0 text-end min-w-200px">22 Sep 2024, 8:43 pm</td>
                    </tr>
                    <tr>
                      <td class="min-w-70px">
                        <div class="badge badge-light-success">200 OK</div>
                      </td>
                      <td>POST /v1/invoices/in_6682_2668/payment</td>
                      <td class="pe-0 text-end min-w-200px">25 Oct 2024, 2:40 pm</td>
                    </tr>
                    <tr>
                      <td class="min-w-70px">
                        <div class="badge badge-light-success">200 OK</div>
                      </td>
                      <td>POST /v1/invoices/in_6682_2668/payment</td>
                      <td class="pe-0 text-end min-w-200px">15 Apr 2024, 5:30 pm</td>
                    </tr>
                    <tr>
                      <td class="min-w-70px">
                        <div class="badge badge-light-success">200 OK</div>
                      </td>
                      <td>POST /v1/invoices/in_4650_7925/payment</td>
                      <td class="pe-0 text-end min-w-200px">19 Aug 2024, 10:10 pm</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="card pt-4 mb-6 mb-xl-9">
              <div class="card-header border-0">
                <div class="card-title">
                  <h2>Events</h2>
                </div>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-sm btn-light-primary">
                    <i class="ki-duotone ki-cloud-download fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>Download Report
                  </button>
                </div>
              </div>
              <div class="card-body py-0">
                <table class="table align-middle table-row-dashed fs-6 text-gray-600 fw-semibold gy-5"
                       id="kt_table_customers_events">
                  <tbody>
                  <tr>
                    <td class="min-w-400px">Invoice
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary me-1">#DER-45645</a>status has changed
                      from
                      <span class="badge badge-light-info me-1">In Progress</span>to
                      <span class="badge badge-light-primary">In Transit</span></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">25 Jul 2024, 9:23 pm</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">Invoice
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary me-1">#WER-45670</a>is
                      <span class="badge badge-light-info">In Progress</span></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">21 Feb 2024, 6:43 am</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">
                      <a href="#" class="text-gray-600 text-hover-primary me-1">Melody Macy</a>has made payment to
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary">#XRS-45670</a></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">10 Mar 2024, 10:30 am</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">Invoice
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary me-1">#SEP-45656</a>status has changed
                      from
                      <span class="badge badge-light-warning me-1">Pending</span>to
                      <span class="badge badge-light-info">In Progress</span></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">10 Nov 2024, 9:23 pm</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">Invoice
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary me-1">#SEP-45656</a>status has changed
                      from
                      <span class="badge badge-light-warning me-1">Pending</span>to
                      <span class="badge badge-light-info">In Progress</span></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">19 Aug 2024, 10:30 am</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">
                      <a href="#" class="text-gray-600 text-hover-primary me-1">Emma Smith</a>has made payment to
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary">#XRS-45670</a></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">05 May 2024, 10:10 pm</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">
                      <a href="#" class="text-gray-600 text-hover-primary me-1">Sean Bean</a>has made payment to
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary">#XRS-45670</a></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">15 Apr 2024, 10:30 am</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">Invoice
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary me-1">#KIO-45656</a>status has changed
                      from
                      <span class="badge badge-light-succees me-1">In Transit</span>to
                      <span class="badge badge-light-success">Approved</span></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">25 Jul 2024, 5:20 pm</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">
                      <a href="#" class="text-gray-600 text-hover-primary me-1">Brian Cox</a>has made payment to
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary">#OLP-45690</a></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">22 Sep 2024, 5:30 pm</td>
                  </tr>
                  <tr>
                    <td class="min-w-400px">
                      <a href="#" class="text-gray-600 text-hover-primary me-1">Sean Bean</a>has made payment to
                      <a href="#" class="fw-bold text-gray-900 text-hover-primary">#XRS-45670</a></td>
                    <td class="pe-0 text-gray-600 text-end min-w-200px">20 Jun 2024, 6:05 pm</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [UserFormComponent],
})
export class UserDetailComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<User>();
  key = input.required<string | undefined>();
  role = input.required<Role>();
}

@Component({
  selector: 'div[userEditView]',
  template: `
  <div userForm [use]="use()" [id]="id()" [view]="view()" [role]="role()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ UserFormComponent, ModalWrapperModule, ],
})
export class UserEditComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<User>();
  key = input.required<string | undefined>();
  role = input.required<Role>();
}


