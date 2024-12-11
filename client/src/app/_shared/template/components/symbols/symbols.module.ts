import { NgModule } from "@angular/core";
import { SymbolLabelComponent } from "src/app/_shared/template/components/symbols/symbol-label.component";
import { SymbolComponent } from "src/app/_shared/template/components/symbols/symbol.component";

@NgModule({
  imports: [
    SymbolComponent,
    SymbolLabelComponent,
  ],
  exports: [
    SymbolComponent,
    SymbolLabelComponent,
  ],
})
export class SymbolsModule {}
