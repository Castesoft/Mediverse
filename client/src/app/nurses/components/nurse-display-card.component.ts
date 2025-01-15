import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { ProfilePictureComponent } from "src/app/users/components/profile-picture/profile-picture.component";
import Nurse from "src/app/_models/nurses/nurse";

@Component({
  selector: "div[nurseDisplayCard]",
  templateUrl: "./nurse-display-card.component.html",
  styleUrls: [ "./nurse-display-card.component.scss" ],
  imports: [
    ProfilePictureComponent
  ],
  standalone: true
})
export class NurseDisplayCardComponent {
  nurse: InputSignal<Nurse> = input.required<Nurse>();
  onDelete: OutputEmitterRef<void> = output<void>();
}
