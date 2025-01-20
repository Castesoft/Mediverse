import { FormInfo } from "src/app/_models/forms/formTypes";
import { RoleParams } from "src/app/_models/roles/roleParams";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { Column } from "src/app/_models/base/column";
import { NamingSubject } from "src/app/_models/base/namingSubject";

export const roleFiltersFormInfo: FormInfo<RoleParams> = {
  ...baseFilterFormInfo,
} as FormInfo<RoleParams>;

export const roleColumns: Column[] = [];

export const roleDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'rol',
  'roles',
  'Roles',
  'roles',
);
