import { CommonModule } from "@angular/common";
import { Component, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { View } from "src/app/_models/base/types";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { User } from "src/app/_models/users/user";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UserForm } from "src/app/_models/users/userForm";
import { UserParams } from "src/app/_models/users/userParams";
import { UsersService } from "src/app/users/users.config";

@Component({
  selector: "[userForm]",
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class UserFormComponent
  extends BaseForm<User, UserParams, UserFiltersForm, UserForm, UsersService>
  implements FormInputSignals<User>
{
  item: ModelSignal<User | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(UsersService, UserForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value as any);
      }
    });
  }
}
