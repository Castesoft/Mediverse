import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionsRoutingModule } from './prescriptions-routing.module';
import { PrescriptionsComponent } from './prescriptions.component';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail.component';
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';


@NgModule({
  declarations: [
    PrescriptionsComponent,
  ],
  imports: [
    CommonModule,
    PrescriptionsRoutingModule,

    CatalogComponent,
    DetailComponent,
    EditComponent,
    NewComponent,
  ]
})
export class PrescriptionsModule { }
