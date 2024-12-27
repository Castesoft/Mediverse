import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from 'src/app/admin/admin.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          // {

          // }
        ]
      }
    ])
  ],
  exports: [
    RouterModule,
  ]
})
export class AdminRoutingModule {}
