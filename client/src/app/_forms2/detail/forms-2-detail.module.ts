import { NgModule } from "@angular/core";
import { DetailFooter2Component } from "src/app/_forms2/detail/detail-footer-2.component";
import { DetailHeaderComponent } from "src/app/_forms2/detail/detail-header.component";
import { DetailLink2Component } from "src/app/_forms2/detail/detail-link-2.component";
import { FormHeader2Component } from "src/app/_forms2/detail/form-header-2.component";
import { FormHeaderComponent } from "src/app/_forms2/detail/form-header.component";


@NgModule({
  imports: [
    DetailLink2Component,
    FormHeader2Component,
    DetailFooter2Component,
    FormHeaderComponent,
    DetailHeaderComponent,
  ],
  exports: [
    DetailLink2Component,
    FormHeader2Component,
    DetailFooter2Component,
    FormHeaderComponent,
    DetailHeaderComponent,
  ],
})
export class Forms2DetailModule {
}
