import { Component, OnInit, inject, model } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  host: { class: 'text-gray-900 fw-bold my-1 fs-2', },
  selector: 'h1[toolbarTitle]',
  template: `{{title()}}`,
  standalone: true,
})
export class ToolbarTitleComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  title = model<string>();

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event: any) => {
        if (this.title() !== this.route.snapshot.title) {
          this.title.set(this.route.snapshot.title);
        }
      }
    });
  }
}
