import { NgModule } from "@angular/core";
import { HeaderSearchComponent } from "src/app/_shared/template/components/headers/header-search.component";
import { HeaderComponent } from "src/app/_shared/template/components/headers/header.component";

@NgModule({
  imports: [
    HeaderSearchComponent,
    HeaderComponent,
  ],
  exports: [
    HeaderSearchComponent,
    HeaderComponent,
  ]
})
export class HeadersModule {}
