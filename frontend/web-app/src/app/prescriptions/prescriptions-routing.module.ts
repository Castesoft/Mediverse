import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from './new.component';
import { newGuard } from './new.guard';
import { PrescriptionsComponent } from './prescriptions.component';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail.component';
import { EditComponent } from './edit.component';
import { editGuard } from './edit.guard';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionsComponent,
    children: [
      { path: '', component: CatalogComponent },
      { path: 'new', component: NewComponent, canDeactivate: [newGuard] },
      { path: ':id', component: DetailComponent },
      { path: ':id/edit', component: EditComponent, canDeactivate: [editGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionsRoutingModule { }
