import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from './new.component';
import { newGuard } from './new.guard';
import { PatientsComponent } from './patients.component';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail.component';
import { EditComponent } from './edit.component';
import { editGuard } from './edit.guard';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      { path: '', component: CatalogComponent },
      { path: 'nuevo', component: NewComponent, canDeactivate: [newGuard] },
      { path: ':id', component: DetailComponent },
      { path: ':id/editar', component: EditComponent, canDeactivate: [editGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
