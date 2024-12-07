import { Component, inject, input, NgModule, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Sections } from "src/app/_models/sections/sectionTypes";
import { SectionsService } from "src/app/_services/sections.service";

@Component({
  host: { class: "breadcrumb-item" },
  selector: "li[link]",
  template: `
    <a [routerLink]="route()">{{ label() }}</a>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class ListItemLinkComponent {
  route = input.required<string>();
  label = input.required<string>();
}

@Component({
  host: { class: "breadcrumb-item active", "aria-current": "page" },
  selector: "li[active]",
  template: `{{ label() }}`,
  standalone: true,
  imports: [RouterModule]
})
export class ListItemActiveComponent {
  label = input.required<string>();
}

@Component({
  host: { class: "mb-2", "aria-label": "Breadcrumbs" },
  selector: "nav[breadcrumbs]",
  template: `
    <ol class="breadcrumb mb-0">
      <ng-content></ng-content>
    </ol>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class BreadcrumbsComponent {
}

@Component({
  host: { class: "breadcrumb-item" },
  selector: "li[item]",
  template: `
    @if (loaded) {
      <a [routerLink]="route">{{ label }}</a>
    }
  `,
  standalone: true,
  imports: [RouterModule]
})
export class ListItemSectionComponent implements OnInit {
  service = inject(SectionsService);

  section = input.required<Sections | undefined>();
  inputRoute = input<string | undefined>(undefined, { alias: "route" });
  inputLabel = input<string | undefined>(undefined, { alias: "label" });

  route!: string;
  label!: string;
  loaded = false;

  ngOnInit(): void {
    if (this.section()) {
      this.route = this.service.get(this.section()!).route;
      this.label = this.service.get(this.section()!).label;
    } else {
      if (this.inputRoute()) this.route = this.inputRoute()!;
      if (this.inputLabel()) this.label = this.inputLabel()!;
    }
    this.loaded = true;
  }
}

@NgModule({
  imports: [ListItemSectionComponent, BreadcrumbsComponent, ListItemActiveComponent, ListItemLinkComponent, ],
  exports: [ListItemSectionComponent, BreadcrumbsComponent, ListItemActiveComponent, ListItemLinkComponent, ]
})
export class BreadcrumbsModule {
}
