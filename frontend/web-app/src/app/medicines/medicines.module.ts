import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicinesRoutingModule } from './medicines-routing.module';
import { MedicinesComponent } from './medicines.component';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail.component';
import { EditComponent } from './edit.component';
import { NewComponent } from './new.component';


@NgModule({
  declarations: [
    MedicinesComponent,
  ],
  imports: [
    CommonModule,
    MedicinesRoutingModule,

    CatalogComponent,
    DetailComponent,
    EditComponent,
    NewComponent,
  ]
})
export class MedicinesModule { }
