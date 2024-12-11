import { NgModule } from "@angular/core";
import { ToolbarActionsComponent } from "src/app/_shared/template/components/toolbars/toolbar-actions.component";
import { ToolbarContainerComponent } from "src/app/_shared/template/components/toolbars/toolbar-container.component";
import { ToolbarInfoComponent } from "src/app/_shared/template/components/toolbars/toolbar-info.component";
import { ToolbarTitleComponent } from "src/app/_shared/template/components/toolbars/toolbar-title.component";
import { ToolbarComponent } from "src/app/_shared/template/components/toolbars/toolbar.component";

@NgModule({
  imports: [
    ToolbarActionsComponent,
    ToolbarContainerComponent,
    ToolbarInfoComponent,
    ToolbarTitleComponent,
    ToolbarComponent,
  ],
  exports: [
    ToolbarActionsComponent,
    ToolbarContainerComponent,
    ToolbarInfoComponent,
    ToolbarTitleComponent,
    ToolbarComponent,
  ],
})
export class ToolbarsModule {}
