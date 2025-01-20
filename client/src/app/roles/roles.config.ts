import { Injectable } from "@angular/core";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { roleColumns, roleDictionary } from "src/app/_models/roles/roleConstants";
import { Role } from "src/app/_models/roles/role";
import { RoleParams } from "src/app/_models/roles/roleParams";
import { RoleFiltersForm } from "src/app/_models/roles/roleFiltersForm";

@Injectable({
  providedIn: "root",
})
export class RolesService extends ServiceHelper<Role, RoleParams, RoleFiltersForm> {
  constructor() {
    super(RoleParams, 'roles', roleDictionary, roleColumns);
  }
}
