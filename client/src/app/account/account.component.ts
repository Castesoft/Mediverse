import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveFn, RouterModule } from '@angular/router';
import { Account } from 'src/app/_models/account';
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { LayoutModule } from "src/app/_shared/layout.module";
import { AccountCardComponent } from 'src/app/account/components/account-card.component';

@Component({
  selector: 'account-main-route',
  template: `
  <div root>
    <div page>
      <div aside></div>
      <div wrapper>
        <div header></div>
        <div content>
          <div toolbar>
            <div toolbarContainer>
              <div toolbarInfo>
                <h1 toolbarTitle [title]="'Mi Cuenta'"></h1>
                <ul breadcrumb>
                  <li breadcrumbLink [label]="'Inicio'" [url]="'/'"></li>
                  <li breadcrumbLink [label]="'Cuenta'" [url]="'/account'"></li>
                  @if(label){<li breadcrumbLink [label]="label" [active]="true">{{label}}</li>}
                </ul>
              </div>
              <div toolbarActions></div>
            </div>
          </div>
          <div post>
            @if(account && label !== 'Configuración'){<div card><div accountCard [account]="account"></div></div>}
            <router-outlet></router-outlet>
          </div>
        </div>
        <div footer></div>
      </div>
    </div>
  </div>`,
})
export class AccountComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}

@Component({
  selector: 'account-overview-tab',
  template: `
  <div card>
    <div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
      <a [routerLink]="['/account/settings']" class="btn btn-sm btn-primary align-self-center">Editar perfil</a>
    </div>
    <div cardBody>
      @if(account) {

        <div class="row mb-7">
          <label class="col-lg-4 fw-semibold text-muted">Nombre</label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">{{ account.fullName }}</span>
          </div>
        </div>
        <div class="row mb-7">
          <label class="col-lg-4 fw-semibold text-muted">Empresa</label>
          <div class="col-lg-8 fv-row">
            <span class="fw-semibold text-gray-800 fs-6">[empresa]</span>
          </div>
        </div>
        <div class="row mb-7">
          <label class="col-lg-4 fw-semibold text-muted">Celular
            <span class="ms-1" aria-label="Phone number must be active"
            >
												<i class="ki-duotone ki-information fs-7">
													<span class="path1"></span>
													<span class="path2"></span>
													<span class="path3"></span>
												</i>
											</span></label>
          <div class="col-lg-8 d-flex align-items-center">
            <span class="fw-bold fs-6 text-gray-800 me-2">{{account.phoneNumberCountryCode}} {{account.phoneNumber}}</span>
            <span class="badge badge-success">Verificado</span>
          </div>
        </div>
        <div class="row mb-7">
          <label class="col-lg-4 fw-semibold text-muted">Sitio</label>
          <div class="col-lg-8">
            <a [routerLink]="[]" class="fw-semibold fs-6 text-gray-800 text-hover-primary">[sitio web]</a>
          </div>
        </div>
        <div class="row mb-7">
          <label class="col-lg-4 fw-semibold text-muted">País
            <span class="ms-1" aria-label="Country of origination"
            >
												<i class="ki-duotone ki-information fs-7">
													<span class="path1"></span>
													<span class="path2"></span>
													<span class="path3"></span>
												</i>
											</span></label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">[pais]</span>
          </div>
        </div>
        <div class="row mb-7">
          <label class="col-lg-4 fw-semibold text-muted">Communication</label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">Email, Phone</span>
          </div>
        </div>
        <div class="row mb-10">
          <label class="col-lg-4 fw-semibold text-muted">Permitir cambios</label>
          <div class="col-lg-8">
            <span class="fw-semibold fs-6 text-gray-800">Sí</span>
          </div>
        </div>
        <div class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
          <i class="ki-duotone ki-information fs-2tx text-warning me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-stack flex-grow-1">
            <div class="fw-semibold">
              <h4 class="text-gray-900 fw-bold">¡Requerimos su atención!</h4>
              <div class="fs-6 text-gray-700">Su pago fue rechazado. Para comenzar a usar Mediverse, favor de
                <a class="fw-bold" [routerLink]="['/account/billing']">Agregar método de pago</a>.
              </div>
            </div>
          </div>
        </div>

      }
    </div>
    </div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountOverviewTabComponent implements OnInit {
  accountService = inject(AccountService);
  private route = inject(ActivatedRoute);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}

@Component({
  selector: 'account-settings-tab',
  template: `
  <div class="d-flex flex-column flex-lg-row">
  <div class="flex-column flex-md-row-auto w-100 w-lg-250px w-xxl-275px">
										<div class="card mb-6 mb-xl-9" style="animation-duration: 0.3s;">
											<div class="card-body py-10 px-6">
												<ul id="kt_account_settings" class="nav nav-flush menu menu-column menu-rounded menu-title-gray-600 menu-bullet-gray-300 menu-state-bg menu-state-bullet-primary fw-semibold fs-6 mb-2">
													<li class="menu-item px-3 pt-0 pb-1">
														<a href="#kt_account_settings_overview" class="menu-link px-3 nav-link active">
															<span class="menu-bullet">
																<span class="bullet bullet-dot"></span>
															</span>
															<span class="menu-title">Overview</span>
														</a>
													</li>
													<li class="menu-item px-3 pt-0 pb-1">
														<a href="#kt_account_settings_signin_method" class="menu-link px-3 nav-link">
															<span class="menu-bullet">
																<span class="bullet bullet-dot"></span>
															</span>
															<span class="menu-title">Sign-in Method</span>
														</a>
													</li>
													<li class="menu-item px-3 pt-0 pb-1">
														<a href="#kt_account_settings_profile_details" class="menu-link px-3 nav-link">
															<span class="menu-bullet">
																<span class="bullet bullet-dot"></span>
															</span>
															<span class="menu-title">Profile Details</span>
														</a>
													</li>
													<li class="menu-item px-3 pt-0 pb-1">
														<a href="#kt_account_settings_connected_accounts" class="menu-link px-3 nav-link">
															<span class="menu-bullet">
																<span class="bullet bullet-dot"></span>
															</span>
															<span class="menu-title">Connected Accounts</span>
														</a>
													</li>
													<li class="menu-item px-3 pt-0">
														<a href="#kt_account_settings_notifications" class="menu-link px-3 nav-link">
															<span class="menu-bullet">
																<span class="bullet bullet-dot"></span>
															</span>
															<span class="menu-title">Notifications</span>
														</a>
													</li>
													<li class="menu-item px-3 pt-0">
														<a href="#kt_account_settings_deactivate" class="menu-link px-3 nav-link">
															<span class="menu-bullet">
																<span class="bullet bullet-dot"></span>
															</span>
															<span class="menu-title">Deactivate Account</span>
														</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
                  <div class="flex-md-row-fluid ms-lg-12">
                  <div card><div cardHeader>
      <div cardTitle [title]="'Generales'"></div>
    </div>
    <div cardBody>
    <div class="d-flex align-items-start flex-wrap">
														<div class="d-flex flex-wrap">
															<div class="symbol symbol-125px mb-7 me-7 position-relative">
																<img src="media/avatars/300-1.jpg" alt="image">
															</div>
															<div class="d-flex flex-column">
																<div class="fs-2 fw-bold mb-1">Brad Dennis</div>
																<a href="#" class="text-gray-500 text-hover-primary fs-6 fw-semibold mb-5">supporteenthemes.com</a>
																<div class="badge badge-light-success text-success fw-bold fs-7 me-auto mb-3 px-4 py-3">Default</div>
															</div>
														</div>
														<a href="pages/user-profile/projects.html" class="btn btn-primary ms-auto mb-7">Projects (3)</a>
													</div>
													<div class="row mb-7">
														<div class="col-lg-5 text-gray-600 fs-4 mb-6 mb-lg-0">
															<div class="fw-semibold mb-1">
															<span class="fw-bold text-gray-800 me-1">$24.99</span>Per Month</div>
															<div class="fw-semibold fs-6 mb-2">Autopay on Dec 23, 2020</div>
															<a href="account/billing.html" class="fw-semibold">View Billing</a>
														</div>
														<div class="col-lg-7">
															<div class="d-flex text-muted fw-bold fs-4 pb-3">
																<span class="flex-grow-1 text-gray-800">Users</span>
																<span class="text-gray-800">86 of 100 Used</span>
															</div>
															<div class="progress h-8px bg-light-primary mb-3">
																<div class="progress-bar bg-primary" role="progressbar" style="width: 86%" aria-valuenow="86" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
															<div class="fw-semibold fs-6 text-muted">14 Users remaining until your plan requires update</div>
														</div>
													</div>
													<div class="notice d-flex bg-light-warning rounded border-warning border border-dashed rounded p-6">
														<i class="ki-duotone ki-information fs-2tx text-warning me-4">
															<span class="path1"></span>
															<span class="path2"></span>
															<span class="path3"></span>
														</i>
														<div class="d-flex flex-stack flex-grow-1">
															<div class="fw-semibold">
																<h4 class="text-gray-900 fw-bold">We need your attention!</h4>
																<div class="fs-6 text-gray-700">Your payment was declined. To start using tools, please
																<a href="account/billing.html">Add Payment Method</a></div>
															</div>
														</div>
													</div>
    </div></div>
  <div card><div cardHeader>
      <div cardTitle [title]="'Inicio de sesión'"></div>
    </div>
    <div cardBody>
    <div class="d-flex flex-wrap align-items-center">
														<div id="kt_signin_email">
															<div class="fs-6 fw-bold mb-1">Email Address</div>
															<div class="fw-semibold text-gray-600">supportkeenthemes.com</div>
														</div>
														<div id="kt_signin_email_edit" class="flex-row-fluid d-none">
															<form id="kt_signin_change_email" class="form fv-plugins-bootstrap5 fv-plugins-framework" novalidate="novalidate">
																<div class="row mb-6">
																	<div class="col-lg-6 mb-4 mb-lg-0">
																		<div class="fv-row mb-0 fv-plugins-icon-container">
																			<label for="emailaddress" class="form-label fs-6 fw-bold mb-3">Enter New Email Address</label>
																			<input type="email" class="form-control form-control-lg form-control-solid" id="emailaddress" placeholder="Email Address" name="emailaddress" value="support@keenthemes.com">
																		<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																	</div>
																	<div class="col-lg-6">
																		<div class="fv-row mb-0 fv-plugins-icon-container">
																			<label for="confirmemailpassword" class="form-label fs-6 fw-bold mb-3">Confirm Password</label>
																			<input type="password" class="form-control form-control-lg form-control-solid" name="confirmemailpassword" id="confirmemailpassword">
																		<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																	</div>
																</div>
																<div class="d-flex">
																	<button id="kt_signin_submit" type="button" class="btn btn-primary me-2 px-6">Update Email</button>
																	<button id="kt_signin_cancel" type="button" class="btn btn-color-gray-500 btn-active-light-primary px-6">Cancel</button>
																</div>
															</form>
														</div>
														<div id="kt_signin_email_button" class="ms-auto">
															<button class="btn btn-light btn-active-light-primary">Change Email</button>
														</div>
													</div>
													<div class="separator separator-dashed my-6"></div>
													<div class="d-flex flex-wrap align-items-center mb-10">
														<div id="kt_signin_password">
															<div class="fs-6 fw-bold mb-1">Password</div>
															<div class="fw-semibold text-gray-600">************</div>
														</div>
														<div id="kt_signin_password_edit" class="flex-row-fluid d-none">
															<form id="kt_signin_change_password" class="form fv-plugins-bootstrap5 fv-plugins-framework" novalidate="novalidate">
																<div class="row mb-1">
																	<div class="col-lg-4">
																		<div class="fv-row mb-0 fv-plugins-icon-container">
																			<label for="currentpassword" class="form-label fs-6 fw-bold mb-3">Current Password</label>
																			<input type="password" class="form-control form-control-lg form-control-solid" name="currentpassword" id="currentpassword">
																		<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																	</div>
																	<div class="col-lg-4">
																		<div class="fv-row mb-0 fv-plugins-icon-container">
																			<label for="newpassword" class="form-label fs-6 fw-bold mb-3">New Password</label>
																			<input type="password" class="form-control form-control-lg form-control-solid" name="newpassword" id="newpassword">
																		<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																	</div>
																	<div class="col-lg-4">
																		<div class="fv-row mb-0 fv-plugins-icon-container">
																			<label for="confirmpassword" class="form-label fs-6 fw-bold mb-3">Confirm New Password</label>
																			<input type="password" class="form-control form-control-lg form-control-solid" name="confirmpassword" id="confirmpassword">
																		<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																	</div>
																</div>
																<div class="form-text mb-5">Password must be at least 8 character and contain symbols</div>
																<div class="d-flex">
																	<button id="kt_password_submit" type="button" class="btn btn-primary me-2 px-6">Update Password</button>
																	<button id="kt_password_cancel" type="button" class="btn btn-color-gray-500 btn-active-light-primary px-6">Cancel</button>
																</div>
															</form>
														</div>
														<div id="kt_signin_password_button" class="ms-auto">
															<button class="btn btn-light btn-active-light-primary">Reset Password</button>
														</div>
													</div>
													<div class="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6">
														<i class="ki-duotone ki-shield-tick fs-2tx text-primary me-4">
															<span class="path1"></span>
															<span class="path2"></span>
														</i>
														<div class="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
															<div class="mb-3 mb-md-0 fw-semibold">
																<h4 class="text-gray-900 fw-bold">Secure Your Account</h4>
																<div class="fs-6 text-gray-700 pe-7">Two-factor authentication adds an extra layer of security to your account. To log in, in addition you'll need to provide a 6 digit code</div>
															</div>
															<a href="#" class="btn btn-primary px-6 align-self-center text-nowrap">Enable</a>
														</div>
													</div>

    </div></div>
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    <div class="row mb-6">
															<label class="col-lg-4 col-form-label fw-semibold fs-6">Avatar</label>
															<div class="col-lg-8">
																<div class="image-input image-input-outline" style="background-image: url('media/svg/avatars/blank.svg')">
																	<div class="image-input-wrapper w-125px h-125px" style="background-image: url(media/avatars/300-1.jpg)"></div>
																	<label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" aria-label="Change avatar">
																		<i class="ki-duotone ki-pencil fs-7">
																			<span class="path1"></span>
																			<span class="path2"></span>
																		</i>
																		<input type="file" name="avatar" accept=".png, .jpg, .jpeg">
																		<input type="hidden" name="avatar_remove">
																	</label>
																	<span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" aria-label="Cancel avatar">
																		<i class="ki-duotone ki-cross fs-2">
																			<span class="path1"></span>
																			<span class="path2"></span>
																		</i>
																	</span>
																	<span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" aria-label="Remove avatar">
																		<i class="ki-duotone ki-cross fs-2">
																			<span class="path1"></span>
																			<span class="path2"></span>
																		</i>
																	</span>
																</div>
																<div class="form-text">Allowed file types: png, jpg, jpeg.</div>
															</div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label required fw-semibold fs-6">Full Name</label>
															<div class="col-lg-8">
																<div class="row">
																	<div class="col-lg-6 fv-row fv-plugins-icon-container">
																		<input type="text" name="fname" class="form-control form-control-lg form-control-solid mb-3 mb-lg-0" placeholder="First name" value="Max">
																	<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																	<div class="col-lg-6 fv-row fv-plugins-icon-container">
																		<input type="text" name="lname" class="form-control form-control-lg form-control-solid" placeholder="Last name" value="Smith">
																	<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
																</div>
															</div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label required fw-semibold fs-6">Company</label>
															<div class="col-lg-8 fv-row fv-plugins-icon-container">
																<input type="text" name="company" class="form-control form-control-lg form-control-solid" placeholder="Company name" value="Keenthemes">
															<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label fw-semibold fs-6">
																<span class="required">Contact Phone</span>
																<span class="ms-1" aria-label="Phone number must be active">
																	<i class="ki-duotone ki-information-5 text-gray-500 fs-6">
																		<span class="path1"></span>
																		<span class="path2"></span>
																		<span class="path3"></span>
																	</i>
																</span>
															</label>
															<div class="col-lg-8 fv-row fv-plugins-icon-container">
																<input type="tel" name="phone" class="form-control form-control-lg form-control-solid" placeholder="Phone number" value="044 3276 454 935">
															<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label fw-semibold fs-6">Company Site</label>
															<div class="col-lg-8 fv-row">
																<input type="text" name="website" class="form-control form-control-lg form-control-solid" placeholder="Company website" value="keenthemes.com">
															</div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label fw-semibold fs-6">
																<span class="required">Country</span>
																<span class="ms-1" aria-label="Country of origination">
																	<i class="ki-duotone ki-information-5 text-gray-500 fs-6">
																		<span class="path1"></span>
																		<span class="path2"></span>
																		<span class="path3"></span>
																	</i>
																</span>
															</label>
															<div class="col-lg-8 fv-row fv-plugins-icon-container">
																<select name="country" aria-label="Select a Country" data-control="select2" data-placeholder="Select a country..." class="form-select form-select-solid form-select-lg fw-semibold select2-hidden-accessible" data-select2-id="select2-data-7-iesa" tabindex="-1" aria-hidden="true">
																	<option value="" data-select2-id="select2-data-9-bogz">Select a Country...</option>
																	<option value="AF">Afghanistan</option>
																	<option value="AX">Aland Islands</option>
																	<option value="AL">Albania</option>
																	<option value="DZ">Algeria</option>
																	<option value="AS">American Samoa</option>
																	<option value="AD">Andorra</option>
																	<option value="AO">Angola</option>
																	<option value="AI">Anguilla</option>
																	<option value="AG">Antigua and Barbuda</option>
																	<option value="AR">Argentina</option>
																	<option value="AM">Armenia</option>
																	<option value="AW">Aruba</option>
																	<option value="AU">Australia</option>
																	<option value="AT">Austria</option>
																	<option value="AZ">Azerbaijan</option>
																	<option value="BS">Bahamas</option>
																	<option value="BH">Bahrain</option>
																	<option value="BD">Bangladesh</option>
																	<option value="BB">Barbados</option>
																	<option value="BY">Belarus</option>
																	<option value="BE">Belgium</option>
																	<option value="BZ">Belize</option>
																	<option value="BJ">Benin</option>
																	<option value="BM">Bermuda</option>
																	<option value="BT">Bhutan</option>
																	<option value="BO">Bolivia, Plurinational State of</option>
																	<option value="BQ">Bonaire, Sint Eustatius and Saba</option>
																	<option value="BA">Bosnia and Herzegovina</option>
																	<option value="BW">Botswana</option>
																	<option value="BR">Brazil</option>
																	<option value="IO">British Indian Ocean Territory</option>
																	<option value="BN">Brunei Darussalam</option>
																	<option value="BG">Bulgaria</option>
																	<option value="BF">Burkina Faso</option>
																	<option value="BI">Burundi</option>
																	<option value="KH">Cambodia</option>
																	<option value="CM">Cameroon</option>
																	<option value="CA">Canada</option>
																	<option value="CV">Cape Verde</option>
																	<option value="KY">Cayman Islands</option>
																	<option value="CF">Central African Republic</option>
																	<option value="TD">Chad</option>
																	<option value="CL">Chile</option>
																	<option value="CN">China</option>
																	<option value="CX">Christmas Island</option>
																	<option value="CC">Cocos (Keeling) Islands</option>
																	<option value="CO">Colombia</option>
																	<option value="KM">Comoros</option>
																	<option value="CK">Cook Islands</option>
																	<option value="CR">Costa Rica</option>
																	<option value="CI">Côte d'Ivoire</option>
																	<option value="HR">Croatia</option>
																	<option value="CU">Cuba</option>
																	<option value="CW">Curaçao</option>
																	<option value="CZ">Czech Republic</option>
																	<option value="DK">Denmark</option>
																	<option value="DJ">Djibouti</option>
																	<option value="DM">Dominica</option>
																	<option value="DO">Dominican Republic</option>
																	<option value="EC">Ecuador</option>
																	<option value="EG">Egypt</option>
																	<option value="SV">El Salvador</option>
																	<option value="GQ">Equatorial Guinea</option>
																	<option value="ER">Eritrea</option>
																	<option value="EE">Estonia</option>
																	<option value="ET">Ethiopia</option>
																	<option value="FK">Falkland Islands (Malvinas)</option>
																	<option value="FJ">Fiji</option>
																	<option value="FI">Finland</option>
																	<option value="FR">France</option>
																	<option value="PF">French Polynesia</option>
																	<option value="GA">Gabon</option>
																	<option value="GM">Gambia</option>
																	<option value="GE">Georgia</option>
																	<option value="DE">Germany</option>
																	<option value="GH">Ghana</option>
																	<option value="GI">Gibraltar</option>
																	<option value="GR">Greece</option>
																	<option value="GL">Greenland</option>
																	<option value="GD">Grenada</option>
																	<option value="GU">Guam</option>
																	<option value="GT">Guatemala</option>
																	<option value="GG">Guernsey</option>
																	<option value="GN">Guinea</option>
																	<option value="GW">Guinea-Bissau</option>
																	<option value="HT">Haiti</option>
																	<option value="VA">Holy See (Vatican City State)</option>
																	<option value="HN">Honduras</option>
																	<option value="HK">Hong Kong</option>
																	<option value="HU">Hungary</option>
																	<option value="IS">Iceland</option>
																	<option value="IN">India</option>
																	<option value="ID">Indonesia</option>
																	<option value="IR">Iran, Islamic Republic of</option>
																	<option value="IQ">Iraq</option>
																	<option value="IE">Ireland</option>
																	<option value="IM">Isle of Man</option>
																	<option value="IL">Israel</option>
																	<option value="IT">Italy</option>
																	<option value="JM">Jamaica</option>
																	<option value="JP">Japan</option>
																	<option value="JE">Jersey</option>
																	<option value="JO">Jordan</option>
																	<option value="KZ">Kazakhstan</option>
																	<option value="KE">Kenya</option>
																	<option value="KI">Kiribati</option>
																	<option value="KP">Korea, Democratic People's Republic of</option>
																	<option value="KW">Kuwait</option>
																	<option value="KG">Kyrgyzstan</option>
																	<option value="LA">Lao People's Democratic Republic</option>
																	<option value="LV">Latvia</option>
																	<option value="LB">Lebanon</option>
																	<option value="LS">Lesotho</option>
																	<option value="LR">Liberia</option>
																	<option value="LY">Libya</option>
																	<option value="LI">Liechtenstein</option>
																	<option value="LT">Lithuania</option>
																	<option value="LU">Luxembourg</option>
																	<option value="MO">Macao</option>
																	<option value="MG">Madagascar</option>
																	<option value="MW">Malawi</option>
																	<option value="MY">Malaysia</option>
																	<option value="MV">Maldives</option>
																	<option value="ML">Mali</option>
																	<option value="MT">Malta</option>
																	<option value="MH">Marshall Islands</option>
																	<option value="MQ">Martinique</option>
																	<option value="MR">Mauritania</option>
																	<option value="MU">Mauritius</option>
																	<option value="MX">Mexico</option>
																	<option value="FM">Micronesia, Federated States of</option>
																	<option value="MD">Moldova, Republic of</option>
																	<option value="MC">Monaco</option>
																	<option value="MN">Mongolia</option>
																	<option value="ME">Montenegro</option>
																	<option value="MS">Montserrat</option>
																	<option value="MA">Morocco</option>
																	<option value="MZ">Mozambique</option>
																	<option value="MM">Myanmar</option>
																	<option value="NA">Namibia</option>
																	<option value="NR">Nauru</option>
																	<option value="NP">Nepal</option>
																	<option value="NL">Netherlands</option>
																	<option value="NZ">New Zealand</option>
																	<option value="NI">Nicaragua</option>
																	<option value="NE">Niger</option>
																	<option value="NG">Nigeria</option>
																	<option value="NU">Niue</option>
																	<option value="NF">Norfolk Island</option>
																	<option value="MP">Northern Mariana Islands</option>
																	<option value="NO">Norway</option>
																	<option value="OM">Oman</option>
																	<option value="PK">Pakistan</option>
																	<option value="PW">Palau</option>
																	<option value="PS">Palestinian Territory, Occupied</option>
																	<option value="PA">Panama</option>
																	<option value="PG">Papua New Guinea</option>
																	<option value="PY">Paraguay</option>
																	<option value="PE">Peru</option>
																	<option value="PH">Philippines</option>
																	<option value="PL">Poland</option>
																	<option value="PT">Portugal</option>
																	<option value="PR">Puerto Rico</option>
																	<option value="QA">Qatar</option>
																	<option value="RO">Romania</option>
																	<option value="RU">Russian Federation</option>
																	<option value="RW">Rwanda</option>
																	<option value="BL">Saint Barthélemy</option>
																	<option value="KN">Saint Kitts and Nevis</option>
																	<option value="LC">Saint Lucia</option>
																	<option value="MF">Saint Martin (French part)</option>
																	<option value="VC">Saint Vincent and the Grenadines</option>
																	<option value="WS">Samoa</option>
																	<option value="SM">San Marino</option>
																	<option value="ST">Sao Tome and Principe</option>
																	<option value="SA">Saudi Arabia</option>
																	<option value="SN">Senegal</option>
																	<option value="RS">Serbia</option>
																	<option value="SC">Seychelles</option>
																	<option value="SL">Sierra Leone</option>
																	<option value="SG">Singapore</option>
																	<option value="SX">Sint Maarten (Dutch part)</option>
																	<option value="SK">Slovakia</option>
																	<option value="SI">Slovenia</option>
																	<option value="SB">Solomon Islands</option>
																	<option value="SO">Somalia</option>
																	<option value="ZA">South Africa</option>
																	<option value="KR">South Korea</option>
																	<option value="SS">South Sudan</option>
																	<option value="ES">Spain</option>
																	<option value="LK">Sri Lanka</option>
																	<option value="SD">Sudan</option>
																	<option value="SR">Suriname</option>
																	<option value="SZ">Swaziland</option>
																	<option value="SE">Sweden</option>
																	<option value="CH">Switzerland</option>
																	<option value="SY">Syrian Arab Republic</option>
																	<option value="TW">Taiwan, Province of China</option>
																	<option value="TJ">Tajikistan</option>
																	<option value="TZ">Tanzania, United Republic of</option>
																	<option value="TH">Thailand</option>
																	<option value="TG">Togo</option>
																	<option value="TK">Tokelau</option>
																	<option value="TO">Tonga</option>
																	<option value="TT">Trinidad and Tobago</option>
																	<option value="TN">Tunisia</option>
																	<option value="TR">Turkey</option>
																	<option value="TM">Turkmenistan</option>
																	<option value="TC">Turks and Caicos Islands</option>
																	<option value="TV">Tuvalu</option>
																	<option value="UG">Uganda</option>
																	<option value="UA">Ukraine</option>
																	<option value="AE">United Arab Emirates</option>
																	<option value="GB">United Kingdom</option>
																	<option value="US">United States</option>
																	<option value="UY">Uruguay</option>
																	<option value="UZ">Uzbekistan</option>
																	<option value="VU">Vanuatu</option>
																	<option value="VE">Venezuela, Bolivarian Republic of</option>
																	<option value="VN">Vietnam</option>
																	<option value="VI">Virgin Islands</option>
																	<option value="YE">Yemen</option>
																	<option value="ZM">Zambia</option>
																	<option value="ZW">Zimbabwe</option>
																</select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr" data-select2-id="select2-data-8-acom" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single form-select form-select-solid form-select-lg fw-semibold" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-country-6e-container" aria-controls="select2-country-6e-container"><span class="select2-selection__rendered" id="select2-country-6e-container" role="textbox" aria-readonly="true" title="Select a country..."><span class="select2-selection__placeholder">Select a country...</span></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
															<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label required fw-semibold fs-6">Language</label>
															<div class="col-lg-8 fv-row fv-plugins-icon-container">
																<select name="language" aria-label="Select a Language" data-control="select2" data-placeholder="Select a language..." class="form-select form-select-solid form-select-lg select2-hidden-accessible" data-select2-id="select2-data-10-l06l" tabindex="-1" aria-hidden="true">
																	<option value="" data-select2-id="select2-data-12-e9zj">Select a Language...</option>
																	<option value="id">Bahasa Indonesia - Indonesian</option>
																	<option value="msa">Bahasa Melayu - Malay</option>
																	<option value="ca">Català - Catalan</option>
																	<option value="cs">Čeština - Czech</option>
																	<option value="da">Dansk - Danish</option>
																	<option value="de">Deutsch - German</option>
																	<option value="en">English</option>
																	<option value="en-gb">English UK - British English</option>
																	<option value="es">Español - Spanish</option>
																	<option value="fil">Filipino</option>
																	<option value="fr">Français - French</option>
																	<option value="ga">Gaeilge - Irish (beta)</option>
																	<option value="gl">Galego - Galician (beta)</option>
																	<option value="hr">Hrvatski - Croatian</option>
																	<option value="it">Italiano - Italian</option>
																	<option value="hu">Magyar - Hungarian</option>
																	<option value="nl">Nederlands - Dutch</option>
																	<option value="no">Norsk - Norwegian</option>
																	<option value="pl">Polski - Polish</option>
																	<option value="pt">Português - Portuguese</option>
																	<option value="ro">Română - Romanian</option>
																	<option value="sk">Slovenčina - Slovak</option>
																	<option value="fi">Suomi - Finnish</option>
																	<option value="sv">Svenska - Swedish</option>
																	<option value="vi">Tiếng Việt - Vietnamese</option>
																	<option value="tr">Türkçe - Turkish</option>
																	<option value="el">Ελληνικά - Greek</option>
																	<option value="bg">Български език - Bulgarian</option>
																	<option value="ru">Русский - Russian</option>
																	<option value="sr">Српски - Serbian</option>
																	<option value="uk">Українська мова - Ukrainian</option>
																	<option value="he">עִבְרִית - Hebrew</option>
																	<option value="ur">اردو - Urdu (beta)</option>
																	<option value="ar">العربية - Arabic</option>
																	<option value="fa">فارسی - Persian</option>
																	<option value="mr">मराठी - Marathi</option>
																	<option value="hi">हिन्दी - Hindi</option>
																	<option value="bn">বাংলা - Bangla</option>
																	<option value="gu">ગુજરાતી - Gujarati</option>
																	<option value="ta">தமிழ் - Tamil</option>
																	<option value="kn">ಕನ್ನಡ - Kannada</option>
																	<option value="th">ภาษาไทย - Thai</option>
																	<option value="ko">한국어 - Korean</option>
																	<option value="ja">日本語 - Japanese</option>
																	<option value="zh-cn">简体中文 - Simplified Chinese</option>
																	<option value="zh-tw">繁體中文 - Traditional Chinese</option>
																</select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr" data-select2-id="select2-data-11-8c3f" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single form-select form-select-solid form-select-lg" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-language-x5-container" aria-controls="select2-language-x5-container"><span class="select2-selection__rendered" id="select2-language-x5-container" role="textbox" aria-readonly="true" title="Select a language..."><span class="select2-selection__placeholder">Select a language...</span></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
																<div class="form-text">Please select a preferred language, including date, time, and number formatting.</div>
															<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label required fw-semibold fs-6">Time Zone</label>
															<div class="col-lg-8 fv-row fv-plugins-icon-container">
																<select name="timezone" aria-label="Select a Timezone" data-control="select2" data-placeholder="Select a timezone.." class="form-select form-select-solid form-select-lg select2-hidden-accessible" data-select2-id="select2-data-13-vgj1" tabindex="-1" aria-hidden="true">
																	<option value="" data-select2-id="select2-data-15-8s54">Select a Timezone..</option>
																	<option value="International Date Line West">(GMT-11:00) International Date Line West</option>
																	<option value="Midway Island">(GMT-11:00) Midway Island</option>
																	<option value="Samoa">(GMT-11:00) Samoa</option>
																	<option value="Hawaii">(GMT-10:00) Hawaii</option>
																	<option value="Alaska">(GMT-08:00) Alaska</option>
																	<option value="Pacific Time (US &amp; Canada)">(GMT-07:00) Pacific Time (US &amp; Canada)</option>
																	<option value="Tijuana">(GMT-07:00) Tijuana</option>
																	<option value="Arizona">(GMT-07:00) Arizona</option>
																	<option value="Mountain Time (US &amp; Canada)">(GMT-06:00) Mountain Time (US &amp; Canada)</option>
																	<option value="Chihuahua">(GMT-06:00) Chihuahua</option>
																	<option value="Mazatlan">(GMT-06:00) Mazatlan</option>
																	<option value="Saskatchewan">(GMT-06:00) Saskatchewan</option>
																	<option value="Central America">(GMT-06:00) Central America</option>
																	<option value="Central Time (US &amp; Canada)">(GMT-05:00) Central Time (US &amp; Canada)</option>
																	<option value="Guadalajara">(GMT-05:00) Guadalajara</option>
																	<option value="Mexico City">(GMT-05:00) Mexico City</option>
																	<option value="Monterrey">(GMT-05:00) Monterrey</option>
																	<option value="Bogota">(GMT-05:00) Bogota</option>
																	<option value="Lima">(GMT-05:00) Lima</option>
																	<option value="Quito">(GMT-05:00) Quito</option>
																	<option value="Eastern Time (US &amp; Canada)">(GMT-04:00) Eastern Time (US &amp; Canada)</option>
																	<option value="Indiana (East)">(GMT-04:00) Indiana (East)</option>
																	<option value="Caracas">(GMT-04:00) Caracas</option>
																	<option value="La Paz">(GMT-04:00) La Paz</option>
																	<option value="Georgetown">(GMT-04:00) Georgetown</option>
																	<option value="Atlantic Time (Canada)">(GMT-03:00) Atlantic Time (Canada)</option>
																	<option value="Santiago">(GMT-03:00) Santiago</option>
																	<option value="Brasilia">(GMT-03:00) Brasilia</option>
																	<option value="Buenos Aires">(GMT-03:00) Buenos Aires</option>
																	<option value="Newfoundland">(GMT-02:30) Newfoundland</option>
																	<option value="Greenland">(GMT-02:00) Greenland</option>
																	<option value="Mid-Atlantic">(GMT-02:00) Mid-Atlantic</option>
																	<option value="Cape Verde Is.">(GMT-01:00) Cape Verde Is.</option>
																	<option value="Azores">(GMT) Azores</option>
																	<option value="Monrovia">(GMT) Monrovia</option>
																	<option value="UTC">(GMT) UTC</option>
																	<option value="Dublin">(GMT+01:00) Dublin</option>
																	<option value="Edinburgh">(GMT+01:00) Edinburgh</option>
																	<option value="Lisbon">(GMT+01:00) Lisbon</option>
																	<option value="London">(GMT+01:00) London</option>
																	<option value="Casablanca">(GMT+01:00) Casablanca</option>
																	<option value="West Central Africa">(GMT+01:00) West Central Africa</option>
																	<option value="Belgrade">(GMT+02:00) Belgrade</option>
																	<option value="Bratislava">(GMT+02:00) Bratislava</option>
																	<option value="Budapest">(GMT+02:00) Budapest</option>
																	<option value="Ljubljana">(GMT+02:00) Ljubljana</option>
																	<option value="Prague">(GMT+02:00) Prague</option>
																	<option value="Sarajevo">(GMT+02:00) Sarajevo</option>
																	<option value="Skopje">(GMT+02:00) Skopje</option>
																	<option value="Warsaw">(GMT+02:00) Warsaw</option>
																	<option value="Zagreb">(GMT+02:00) Zagreb</option>
																	<option value="Brussels">(GMT+02:00) Brussels</option>
																	<option value="Copenhagen">(GMT+02:00) Copenhagen</option>
																	<option value="Madrid">(GMT+02:00) Madrid</option>
																	<option value="Paris">(GMT+02:00) Paris</option>
																	<option value="Amsterdam">(GMT+02:00) Amsterdam</option>
																	<option value="Berlin">(GMT+02:00) Berlin</option>
																	<option value="Bern">(GMT+02:00) Bern</option>
																	<option value="Rome">(GMT+02:00) Rome</option>
																	<option value="Stockholm">(GMT+02:00) Stockholm</option>
																	<option value="Vienna">(GMT+02:00) Vienna</option>
																	<option value="Cairo">(GMT+02:00) Cairo</option>
																	<option value="Harare">(GMT+02:00) Harare</option>
																	<option value="Pretoria">(GMT+02:00) Pretoria</option>
																	<option value="Bucharest">(GMT+03:00) Bucharest</option>
																	<option value="Helsinki">(GMT+03:00) Helsinki</option>
																	<option value="Kiev">(GMT+03:00) Kiev</option>
																	<option value="Kyiv">(GMT+03:00) Kyiv</option>
																	<option value="Riga">(GMT+03:00) Riga</option>
																	<option value="Sofia">(GMT+03:00) Sofia</option>
																	<option value="Tallinn">(GMT+03:00) Tallinn</option>
																	<option value="Vilnius">(GMT+03:00) Vilnius</option>
																	<option value="Athens">(GMT+03:00) Athens</option>
																	<option value="Istanbul">(GMT+03:00) Istanbul</option>
																	<option value="Minsk">(GMT+03:00) Minsk</option>
																	<option value="Jerusalem">(GMT+03:00) Jerusalem</option>
																	<option value="Moscow">(GMT+03:00) Moscow</option>
																	<option value="St. Petersburg">(GMT+03:00) St. Petersburg</option>
																	<option value="Volgograd">(GMT+03:00) Volgograd</option>
																	<option value="Kuwait">(GMT+03:00) Kuwait</option>
																	<option value="Riyadh">(GMT+03:00) Riyadh</option>
																	<option value="Nairobi">(GMT+03:00) Nairobi</option>
																	<option value="Baghdad">(GMT+03:00) Baghdad</option>
																	<option value="Abu Dhabi">(GMT+04:00) Abu Dhabi</option>
																	<option value="Muscat">(GMT+04:00) Muscat</option>
																	<option value="Baku">(GMT+04:00) Baku</option>
																	<option value="Tbilisi">(GMT+04:00) Tbilisi</option>
																	<option value="Yerevan">(GMT+04:00) Yerevan</option>
																	<option value="Tehran">(GMT+04:30) Tehran</option>
																	<option value="Kabul">(GMT+04:30) Kabul</option>
																	<option value="Ekaterinburg">(GMT+05:00) Ekaterinburg</option>
																	<option value="Islamabad">(GMT+05:00) Islamabad</option>
																	<option value="Karachi">(GMT+05:00) Karachi</option>
																	<option value="Tashkent">(GMT+05:00) Tashkent</option>
																	<option value="Chennai">(GMT+05:30) Chennai</option>
																	<option value="Kolkata">(GMT+05:30) Kolkata</option>
																	<option value="Mumbai">(GMT+05:30) Mumbai</option>
																	<option value="New Delhi">(GMT+05:30) New Delhi</option>
																	<option value="Sri Jayawardenepura">(GMT+05:30) Sri Jayawardenepura</option>
																	<option value="Kathmandu">(GMT+05:45) Kathmandu</option>
																	<option value="Astana">(GMT+06:00) Astana</option>
																	<option value="Dhaka">(GMT+06:00) Dhaka</option>
																	<option value="Almaty">(GMT+06:00) Almaty</option>
																	<option value="Urumqi">(GMT+06:00) Urumqi</option>
																	<option value="Rangoon">(GMT+06:30) Rangoon</option>
																	<option value="Novosibirsk">(GMT+07:00) Novosibirsk</option>
																	<option value="Bangkok">(GMT+07:00) Bangkok</option>
																	<option value="Hanoi">(GMT+07:00) Hanoi</option>
																	<option value="Jakarta">(GMT+07:00) Jakarta</option>
																	<option value="Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
																	<option value="Beijing">(GMT+08:00) Beijing</option>
																	<option value="Chongqing">(GMT+08:00) Chongqing</option>
																	<option value="Hong Kong">(GMT+08:00) Hong Kong</option>
																	<option value="Kuala Lumpur">(GMT+08:00) Kuala Lumpur</option>
																	<option value="Singapore">(GMT+08:00) Singapore</option>
																	<option value="Taipei">(GMT+08:00) Taipei</option>
																	<option value="Perth">(GMT+08:00) Perth</option>
																	<option value="Irkutsk">(GMT+08:00) Irkutsk</option>
																	<option value="Ulaan Bataar">(GMT+08:00) Ulaan Bataar</option>
																	<option value="Seoul">(GMT+09:00) Seoul</option>
																	<option value="Osaka">(GMT+09:00) Osaka</option>
																	<option value="Sapporo">(GMT+09:00) Sapporo</option>
																	<option value="Tokyo">(GMT+09:00) Tokyo</option>
																	<option value="Yakutsk">(GMT+09:00) Yakutsk</option>
																	<option value="Darwin">(GMT+09:30) Darwin</option>
																	<option value="Adelaide">(GMT+09:30) Adelaide</option>
																	<option value="Canberra">(GMT+10:00) Canberra</option>
																	<option value="Melbourne">(GMT+10:00) Melbourne</option>
																	<option value="Sydney">(GMT+10:00) Sydney</option>
																	<option value="Brisbane">(GMT+10:00) Brisbane</option>
																	<option value="Hobart">(GMT+10:00) Hobart</option>
																	<option value="Vladivostok">(GMT+10:00) Vladivostok</option>
																	<option value="Guam">(GMT+10:00) Guam</option>
																	<option value="Port Moresby">(GMT+10:00) Port Moresby</option>
																	<option value="Solomon Is.">(GMT+10:00) Solomon Is.</option>
																	<option value="Magadan">(GMT+11:00) Magadan</option>
																	<option value="New Caledonia">(GMT+11:00) New Caledonia</option>
																	<option value="Fiji">(GMT+12:00) Fiji</option>
																	<option value="Kamchatka">(GMT+12:00) Kamchatka</option>
																	<option value="Marshall Is.">(GMT+12:00) Marshall Is.</option>
																	<option value="Auckland">(GMT+12:00) Auckland</option>
																	<option value="Wellington">(GMT+12:00) Wellington</option>
																	<option value="Nuku'alofa">(GMT+13:00) Nuku'alofa</option>
																</select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr" data-select2-id="select2-data-14-nkpt" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single form-select form-select-solid form-select-lg" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-timezone-6g-container" aria-controls="select2-timezone-6g-container"><span class="select2-selection__rendered" id="select2-timezone-6g-container" role="textbox" aria-readonly="true" title="Select a timezone.."><span class="select2-selection__placeholder">Select a timezone..</span></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
															<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label fw-semibold fs-6">Currency</label>
															<div class="col-lg-8 fv-row">
																<select name="currnecy" aria-label="Select a Currency" data-control="select2" data-placeholder="Select a currency.." class="form-select form-select-solid form-select-lg select2-hidden-accessible" data-select2-id="select2-data-16-b1b8" tabindex="-1" aria-hidden="true">
																	<option value="" data-select2-id="select2-data-18-slmo">Select a currency..</option>
																	<option value="USD">
																	USD&nbsp;-&nbsp;USA dollar</option>
																	<option value="GBP">
																	GBP&nbsp;-&nbsp;British pound</option>
																	<option value="AUD">
																	AUD&nbsp;-&nbsp;Australian dollar</option>
																	<option value="JPY">
																	JPY&nbsp;-&nbsp;Japanese yen</option>
																	<option value="SEK">
																	SEK&nbsp;-&nbsp;Swedish krona</option>
																	<option value="CAD">
																	CAD&nbsp;-&nbsp;Canadian dollar</option>
																	<option value="CHF">
																	CHF&nbsp;-&nbsp;Swiss franc</option>
																</select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr" data-select2-id="select2-data-17-6mju" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single form-select form-select-solid form-select-lg" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-currnecy-af-container" aria-controls="select2-currnecy-af-container"><span class="select2-selection__rendered" id="select2-currnecy-af-container" role="textbox" aria-readonly="true" title="Select a currency.."><span class="select2-selection__placeholder">Select a currency..</span></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
															</div>
														</div>
														<div class="row mb-6">
															<label class="col-lg-4 col-form-label required fw-semibold fs-6">Communication</label>
															<div class="col-lg-8 fv-row fv-plugins-icon-container">
																<div class="d-flex align-items-center mt-3">
																	<label class="form-check form-check-custom form-check-inline form-check-solid me-5">
																		<input class="form-check-input" name="communication[]" type="checkbox" value="1">
																		<span class="fw-semibold ps-2 fs-6">Email</span>
																	</label>
																	<label class="form-check form-check-custom form-check-inline form-check-solid">
																		<input class="form-check-input" name="communication[]" type="checkbox" value="2">
																		<span class="fw-semibold ps-2 fs-6">Phone</span>
																	</label>
																</div>
															<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
														</div>
														<div class="row mb-0">
															<label class="col-lg-4 col-form-label fw-semibold fs-6">Allow Marketing</label>
															<div class="col-lg-8 d-flex align-items-center">
																<div class="form-check form-check-solid form-switch form-check-custom fv-row">
																	<input class="form-check-input w-45px h-30px" type="checkbox" id="allowmarketing" checked="checked">
																	<label class="form-check-label" for="allowmarketing"></label>
																</div>
															</div>
														</div>
    </div>
    <div cardFooter>
    <button type="reset" class="btn btn-light btn-active-light-primary me-2">Cancelar</button>
    <button type="submit" class="btn btn-primary" id="kt_account_profile_details_submit">Guardar cambios</button>
    </div>
  </div>
  <div card>
    <div cardHeader>
      <div cardTitle [title]="'Cuentas conectadas'"></div>
    </div>
    <div cardBody>
    <div class="notice d-flex bg-light-primary rounded border-primary border border-dashed mb-9 p-6">
														<i class="ki-duotone ki-design-1 fs-2tx text-primary me-4"></i>
														<div class="d-flex flex-stack flex-grow-1">
															<div class="fw-semibold">
																<div class="fs-6 text-gray-700">Two-factor authentication adds an extra layer of security to your account. To log in, in you'll need to provide a 4 digit amazing code.
																<a href="#" class="fw-bold">Learn More</a></div>
															</div>
														</div>
													</div>
													<div class="py-2">
														<div class="d-flex flex-stack">
															<div class="d-flex">
																<img src="media/svg/brand-logos/google-icon.svg" class="w-30px me-6" alt="">
																<div class="d-flex flex-column">
																	<a href="#" class="fs-5 text-gray-900 text-hover-primary fw-bold">Google</a>
																	<div class="fs-6 fw-semibold text-gray-500">Plan properly your workflow</div>
																</div>
															</div>
															<div class="d-flex justify-content-end">
																<div class="form-check form-check-solid form-check-custom form-switch">
																	<input class="form-check-input w-45px h-30px" type="checkbox" id="googleswitch" checked="checked">
																	<label class="form-check-label" for="googleswitch"></label>
																</div>
															</div>
														</div>
														<div class="separator separator-dashed my-5"></div>
														<div class="d-flex flex-stack">
															<div class="d-flex">
																<img src="media/svg/brand-logos/github.svg" class="w-30px me-6" alt="">
																<div class="d-flex flex-column">
																	<a href="#" class="fs-5 text-gray-900 text-hover-primary fw-bold">Github</a>
																	<div class="fs-6 fw-semibold text-gray-500">Keep eye on on your Repositories</div>
																</div>
															</div>
															<div class="d-flex justify-content-end">
																<div class="form-check form-check-solid form-check-custom form-switch">
																	<input class="form-check-input w-45px h-30px" type="checkbox" id="githubswitch" checked="checked">
																	<label class="form-check-label" for="githubswitch"></label>
																</div>
															</div>
														</div>
														<div class="separator separator-dashed my-5"></div>
														<div class="d-flex flex-stack">
															<div class="d-flex">
																<img src="media/svg/brand-logos/slack-icon.svg" class="w-30px me-6" alt="">
																<div class="d-flex flex-column">
																	<a href="#" class="fs-5 text-gray-900 text-hover-primary fw-bold">Slack</a>
																	<div class="fs-6 fw-semibold text-gray-500">Integrate Projects Discussions</div>
																</div>
															</div>
															<div class="d-flex justify-content-end">
																<div class="form-check form-check-solid form-check-custom form-switch">
																	<input class="form-check-input w-45px h-30px" type="checkbox" id="slackswitch">
																	<label class="form-check-label" for="slackswitch"></label>
																</div>
															</div>
														</div>
													</div>
    </div>
    <div cardFooter>
    <button type="reset" class="btn btn-light btn-active-light-primary me-2">Cancelar</button>
    <button type="submit" class="btn btn-primary" id="kt_account_profile_details_submit">Guardar cambios</button>
    </div>
  </div>
  <div card>
    <div cardHeader>
      <div cardTitle [title]="'Notificaciones'"></div>
    </div>
    <div cardBody>
    <div class="table-responsive">
															<table class="table table-row-dashed border-gray-300 align-middle gy-6">
																<tbody class="fs-6 fw-semibold">
																	<tr>
																		<td class="min-w-250px fs-4 fw-bold">Notifications</td>
																		<td class="w-125px">
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="kt_settings_notification_email" checked="checked">
																				<label class="form-check-label ps-2" for="kt_settings_notification_email">Email</label>
																			</div>
																		</td>
																		<td class="w-125px">
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="kt_settings_notification_phone" checked="checked">
																				<label class="form-check-label ps-2" for="kt_settings_notification_phone">Phone</label>
																			</div>
																		</td>
																	</tr>
																	<tr>
																		<td>Billing Updates</td>
																		<td>
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="1" id="billing1" checked="checked">
																				<label class="form-check-label ps-2" for="billing1"></label>
																			</div>
																		</td>
																		<td>
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="billing2" checked="checked">
																				<label class="form-check-label ps-2" for="billing2"></label>
																			</div>
																		</td>
																	</tr>
																	<tr>
																		<td>New Team Members</td>
																		<td>
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="team1" checked="checked">
																				<label class="form-check-label ps-2" for="team1"></label>
																			</div>
																		</td>
																		<td>
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="team2">
																				<label class="form-check-label ps-2" for="team2"></label>
																			</div>
																		</td>
																	</tr>
																	<tr>
																		<td>Completed Projects</td>
																		<td>
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="project1">
																				<label class="form-check-label ps-2" for="project1"></label>
																			</div>
																		</td>
																		<td>
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="project2" checked="checked">
																				<label class="form-check-label ps-2" for="project2"></label>
																			</div>
																		</td>
																	</tr>
																	<tr>
																		<td class="border-bottom-0">Newsletters</td>
																		<td class="border-bottom-0">
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="newsletter1">
																				<label class="form-check-label ps-2" for="newsletter1"></label>
																			</div>
																		</td>
																		<td class="border-bottom-0">
																			<div class="form-check form-check-custom form-check-solid">
																				<input class="form-check-input" type="checkbox" value="" id="newsletter2">
																				<label class="form-check-label ps-2" for="newsletter2"></label>
																			</div>
																		</td>
																	</tr>
																</tbody>
															</table>
														</div>
    </div>
    <div cardFooter>
    <button type="reset" class="btn btn-light btn-active-light-primary me-2">Cancelar</button>
    <button type="submit" class="btn btn-primary" id="kt_account_profile_details_submit">Guardar cambios</button>
    </div>
  </div>
  <div card>
    <div cardHeader>
      <div cardTitle [title]="'Desactivar cuenta'"></div>
    </div>
    <div cardBody>
    <div class="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-9 p-6">
															<i class="ki-duotone ki-information fs-2tx text-warning me-4">
																<span class="path1"></span>
																<span class="path2"></span>
																<span class="path3"></span>
															</i>
															<div class="d-flex flex-stack flex-grow-1">
																<div class="fw-semibold">
																	<h4 class="text-gray-900 fw-bold">You Are Deactivating Your Account</h4>
																	<div class="fs-6 text-gray-700">For extra security, this requires you to confirm your email or phone number when you reset yousignr password.
																	<br>
																	<a class="fw-bold" href="#">Learn more</a></div>
																</div>
															</div>
														</div>
														<div class="form-check form-check-solid fv-row fv-plugins-icon-container">
															<input name="deactivate" class="form-check-input" type="checkbox" value="" id="deactivate">
															<label class="form-check-label fw-semibold ps-2 fs-6" for="deactivate">I confirm my account deactivation</label>
														<div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div></div>
    </div>
    <div cardFooter>
    <button id="kt_account_deactivate_account_submit" type="submit" class="btn btn-danger fw-semibold">Desactivar cuenta</button>
    </div>
  </div>
                  </div>
  </div>

  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountSettingsTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

@Component({
  selector: 'account-security-tab',
  template: `
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    </div></div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountSecurityTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

@Component({
  selector: 'account-billing-tab',
  template: `
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    </div></div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountBillingTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

@Component({
  selector: 'account-statements-tab',
  template: `
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    </div></div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountStatementsTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

@Component({
  selector: 'account-referrals-tab',
  template: `
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    </div></div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountReferralsTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

@Component({
  selector: 'account-api-keys-tab',
  template: `
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    </div></div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountApiKeysTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

@Component({
  selector: 'account-logs-tab',
  template: `
  <div card><div cardHeader>
      <div cardTitle [title]="'Detalles de perfil'"></div>
    </div>
    <div cardBody>
    </div></div>
  `,
  standalone: true,
  imports: [ LayoutModule, RouterModule, ],
})
export class AccountLogsTabComponent implements OnInit {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}

export const itemResolver: ResolveFn<Account | null> = (route, state) => {
  const service = inject(AccountService);
  return service.current();
};

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AccountComponent, resolve: { item: itemResolver },
      children: [
        { path: '', component: AccountOverviewTabComponent, data: { breadcrumb: 'Mi Cuenta', }, title: 'Mi Cuenta',  },
        { path: 'settings', component: AccountSettingsTabComponent, data: { breadcrumb: 'Configuración', }, title: 'Configuración', },
        { path: 'security', component: AccountSecurityTabComponent, data: { breadcrumb: 'Seguridad', }, title: 'Seguridad', },
        { path: 'billing', component: AccountBillingTabComponent, data: { breadcrumb: 'Facturación', }, title: 'Facturación', },
        { path: 'statements', component: AccountStatementsTabComponent, data: { breadcrumb: 'Resultados', }, title: 'Resultados', },
        { path: 'referrals', component: AccountReferralsTabComponent, data: { breadcrumb: 'Recomendaciones', }, title: 'Recomendaciones', },
        { path: 'api-keys', component: AccountApiKeysTabComponent, data: { breadcrumb: 'API Keys', }, title: 'API Keys', },
        { path: 'logs', component: AccountLogsTabComponent, data: { breadcrumb: 'Logs', }, title: 'Logs', },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule {}

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    AccountRoutingModule, BootstrapModule, CdkModule, RouterModule, CommonModule,
    LayoutModule, CurrencyPipe, AccountCardComponent, LayoutModule,
  ]
})
export class AccountModule { }
