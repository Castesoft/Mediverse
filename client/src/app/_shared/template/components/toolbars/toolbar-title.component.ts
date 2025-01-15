import { Component, OnInit, inject, model, input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  host: { class: 'text-gray-900 fw-bold my-1 fs-2', },
  selector: 'h1[toolbarTitle]',
  template: `{{ title() }}`,
  standalone: true,
})
export class ToolbarTitleComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  title = input<string>()
}
