import { Component, inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import {
  TermsAndConditionsModalComponent
} from 'src/app/auth/components/terms-and-conditions-modal/terms-and-conditions-modal.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
  imports: [ ReactiveFormsModule, InputControlComponent, ControlCheckComponent ],
})
export class AccountSettingsComponent implements OnInit {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  readonly controlContainer: ControlContainer = inject(ControlContainer);

  myForm!: FormGroup;

  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;
  }

  openTermsAndConditionsModal() {
    this.bsModalService.show(TermsAndConditionsModalComponent);
  }
}
