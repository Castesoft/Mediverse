import { NgModule } from "@angular/core";
import { TemplateControlCheckRadioComponent } from 'src/app/_forms2/controls/template/template-control-check-radio.component';
import { TemplateControlCheckboxComponent } from 'src/app/_forms2/controls/template/template-control-checkbox.component';
import { TemplateControlDateComponent } from 'src/app/_forms2/controls/template/template-control-date.component';
import { TemplateControlSearchComponent } from "src/app/_forms2/controls/template/template-control-search.component";
import { TemplateControlTextComponent } from 'src/app/_forms2/controls/template/template-control-text.component';

@NgModule({
  imports: [
    TemplateControlSearchComponent,
    TemplateControlTextComponent,
    TemplateControlCheckboxComponent,
    TemplateControlCheckRadioComponent,
    TemplateControlDateComponent,
  ],
  exports: [
    TemplateControlSearchComponent,
    TemplateControlTextComponent,
    TemplateControlCheckboxComponent,
    TemplateControlCheckRadioComponent,
    TemplateControlDateComponent,
  ]
})
export class TemplateFormsModule {}
