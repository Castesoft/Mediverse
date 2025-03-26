import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotFoundComponent } from "src/app/error/not-found/not-found.component";
import { ForbiddenComponent } from "src/app/error/forbidden/forbidden.component";

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '403',
      component: ForbiddenComponent,
      data: { title: 'DocHub | 403' }
    },
    {
      path: '404',
      component: NotFoundComponent,
      data: { title: 'DocHub | 404' }
    }
  ]) ],
  exports: [ RouterModule ]
})
export class ErrorRoutingModule {
}
