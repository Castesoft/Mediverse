import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  host: {class: '',},
  selector: 'div[addressesFilterMenu], addresses-filter-menu',
  template: `
    <div class="menu menu-sub menu-sub-dropdown w-300px w-md-325px">
      <div class="px-7 py-5">
        <div class="fs-5 text-gray-900 fw-bold">Filter Options</div>
      </div>
      <div class="separator border-gray-200"></div>
      <div class="px-7 py-5">
        <div class="mb-10">
          <label class="form-label fs-6 fw-semibold">Role:</label>
          <select class="form-select form-select-solid fw-bold select2-hidden-accessible"
                  data-placeholder="Select option" data-allow-clear="true" data-hide-search="true"
                  data-select2-id="select2-data-7-slz0" tabindex="-1" aria-hidden="true">
            <option data-select2-id="select2-data-9-kgjl"></option>
            <option value="Administrator">Administrator</option>
            <option value="Analyst">Analyst</option>
            <option value="Developer">Developer</option>
            <option value="Support">Support</option>
            <option value="Trial">Trial</option>
          </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                         data-select2-id="select2-data-8-ui35" style="width: 100%;"><span class="selection"><span
          class="select2-selection select2-selection--single form-select form-select-solid fw-bold" role="combobox"
          aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
          aria-labelledby="select2-4nd3-container" aria-controls="select2-4nd3-container"><span
          class="select2-selection__rendered" id="select2-4nd3-container" role="textbox" aria-readonly="true"
          title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
          class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span
          class="dropdown-wrapper" aria-hidden="true"></span></span>
        </div>
        <div class="mb-10">
          <label class="form-label fs-6 fw-semibold">Two Step Verification:</label>
          <select class="form-select form-select-solid fw-bold select2-hidden-accessible"
                  data-placeholder="Select option" data-allow-clear="true" data-hide-search="true"
                  data-select2-id="select2-data-10-gh8x" tabindex="-1" aria-hidden="true">
            <option data-select2-id="select2-data-12-dsv4"></option>
            <option value="Enabled">Enabled</option>
          </select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr"
                         data-select2-id="select2-data-11-1tsh" style="width: 100%;"><span class="selection"><span
          class="select2-selection select2-selection--single form-select form-select-solid fw-bold" role="combobox"
          aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false"
          aria-labelledby="select2-8lz5-container" aria-controls="select2-8lz5-container"><span
          class="select2-selection__rendered" id="select2-8lz5-container" role="textbox" aria-readonly="true"
          title="Select option"><span class="select2-selection__placeholder">Select option</span></span><span
          class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span
          class="dropdown-wrapper" aria-hidden="true"></span></span>
        </div>
        <div class="d-flex justify-content-end">
          <button type="reset" class="btn btn-light btn-active-light-primary fw-semibold me-2 px-6">Reset</button>
          <button type="submit" class="btn btn-primary fw-semibold px-6">Apply</button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
})
export class AddressesFilterMenuComponent {}
