import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail.component';
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';


@NgModule({
  declarations: [
    PatientsComponent,
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,

    CatalogComponent,
    DetailComponent,
    EditComponent,
    NewComponent,
  ]
})
export class PatientsModule { }
