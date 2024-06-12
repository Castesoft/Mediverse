import { Component } from '@angular/core';

@Component({
  selector: 'sign-in-basic-route',
  host: { class: 'd-flex flex-column flex-root h-100' },
  template: `
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <div
        aside
        class="d-flex flex-column flex-lg-row-auto bg-primary w-xl-600px positon-xl-relative"
      ></div>
      <div class="d-flex flex-column flex-lg-row-fluid py-10">
        <div class="d-flex flex-center flex-column flex-column-fluid">
          <div class="w-lg-500px p-10 p-lg-15 mx-auto">
            <div signInBasicForm></div>
          </div>
        </div>
        <div
          class="d-flex flex-center flex-wrap fs-6 p-5 pb-0"
          bottomLinks
        ></div>
      </div>
    </div>
  `,
})
export class BasicComponent {}
