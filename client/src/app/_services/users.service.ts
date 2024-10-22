import { Injectable } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup2 } from "src/app/_forms/form2";
import { NamingSubject } from "src/app/_models/types";
import { User, UserParams } from "src/app/_models/user";
import { ServiceHelper } from "src/app/_services/serviceHelper";
import {
  UserDetailModalComponent,
  UserEditModalComponent,
  UserNewModalComponent,
  UsersCatalogModalComponent,
  UsersFilterModalComponent
} from "src/app/users/modals";

@Injectable({
  providedIn: "root",
})
export class UsersService extends ServiceHelper<User, UserParams, FormGroup2<UserParams>> {
  private detailModalRef: BsModalRef<UserDetailModalComponent> = new BsModalRef<UserDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private editModalRef: BsModalRef<UserEditModalComponent> = new BsModalRef<UserEditModalComponent>();
  hideEditModal = () => this.editModalRef.hide();
  private newModalRef: BsModalRef<UserNewModalComponent> = new BsModalRef<UserNewModalComponent>();
  hideNewModal = () => this.newModalRef.hide();
  private filterModalRef: BsModalRef<UsersFilterModalComponent> = new BsModalRef<UsersFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<UsersCatalogModalComponent> = new BsModalRef<UsersCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  constructor() {
    super(UserParams, 'users', new NamingSubject(
      'masculine',
      'usuario',
      'usuarios',
      'Usuarios',
      'users',
      ['home', 'patients'],
    ), [
      { name: 'id', label: 'ID' },
      { name: 'email', label: 'Correo electrónico' },
      { name: 'name', label: 'Nombre' },
      { name: 'lastName', label: 'Apellido' },
      { name: 'role', label: 'Rol' },
      { name: 'enabled', label: 'Habilitado' },
      { name: 'createdAt', label: 'Creado' },
    ])
  }

}
