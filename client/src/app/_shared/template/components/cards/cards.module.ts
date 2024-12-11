import { NgModule } from "@angular/core";
import { CardBodyComponent } from "src/app/_shared/template/components/cards/card-body.component";
import { CardFooterComponent } from "src/app/_shared/template/components/cards/card-footer.component";
import { CardHeaderComponent } from "src/app/_shared/template/components/cards/card-header.component";
import { CardTitleComponent } from "src/app/_shared/template/components/cards/card-title.component";
import { CardComponent } from "src/app/_shared/template/components/cards/card.component";

@NgModule({
  imports: [
    CardBodyComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardComponent,
  ],
  exports: [
    CardBodyComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardComponent,
  ],
})
export class CardsModule {}
