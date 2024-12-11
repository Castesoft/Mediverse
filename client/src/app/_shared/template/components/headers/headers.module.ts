import { NgModule } from "@angular/core";
import { HeaderContainerComponent } from "src/app/_shared/template/components/headers/header-container.component";
import { HeaderLogoComponent } from "src/app/_shared/template/components/headers/header-logo.component";
import { HeaderSearchComponent } from "src/app/_shared/template/components/headers/header-search.component";
import { HeaderTopbarComponent } from "src/app/_shared/template/components/headers/header-topbar.component";
import { HeaderComponent } from "src/app/_shared/template/components/headers/header.component";

@NgModule({
  imports: [
    HeaderContainerComponent,
    HeaderLogoComponent,
    HeaderTopbarComponent,
    HeaderSearchComponent,
    HeaderComponent,
  ],
  exports: [
    HeaderContainerComponent,
    HeaderLogoComponent,
    HeaderTopbarComponent,
    HeaderSearchComponent,
    HeaderComponent,
  ]
})
export class HeadersModule {}
