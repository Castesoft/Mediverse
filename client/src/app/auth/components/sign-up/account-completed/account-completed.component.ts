import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-account-completed',
  templateUrl: './account-completed.component.html',
  styleUrl: './account-completed.component.scss'
})
export class AccountCompletedComponent {
  name: InputSignal<string | undefined> = input.required();
}
