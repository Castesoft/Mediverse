import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { JsonPipe } from "@angular/common";
import { ControlsModule } from "src/app/_forms/controls.module";

@Component({
  selector: 'div[userForm]',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, AlertModule, RouterModule, JsonPipe, ControlsModule, ],
})
export class UserFormComponent {

}
