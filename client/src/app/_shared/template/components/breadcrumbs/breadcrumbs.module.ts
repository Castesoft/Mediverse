import { NgModule } from "@angular/core";
import { BreadcrumbLinkComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb-link.component";
import { BreadcrumbComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb.component";

@NgModule({
  imports: [
    BreadcrumbLinkComponent,
    BreadcrumbComponent,
  ],
  exports: [
    BreadcrumbLinkComponent,
    BreadcrumbComponent,
  ]
})
export class BreadcrumbsModule {}
