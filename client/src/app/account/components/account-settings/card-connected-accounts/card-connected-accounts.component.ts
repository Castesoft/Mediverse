declare var google: any;
import { Component, inject, output, ViewChild, AfterViewInit  } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';

@Component({
  selector: 'app-card-connected-accounts',
  standalone: true,
  imports: [LayoutModule, ReactiveFormsModule, InputControlComponent],
  templateUrl: './card-connected-accounts.component.html',
  styleUrl: './card-connected-accounts.component.scss'
})
export class CardConnectedAccountsComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  @ViewChild('googleButton') googleButton!: any;
  
  submitted = false;
  hideSetPasswordForm = true;
  setPasswordForm = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [this.accountService.equalFields('password','confirmPassword')]
  } as AbstractControlOptions);

  ngAfterViewInit(): void {
    google.accounts.id.renderButton(document.getElementById('google-btn-link'), {
      theme: 'outline',
      size: 'large',
      text: 'signin',
      locale: 'es',
      width: '100',
      height: '80'
    });
  }

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  toggleSetPasswordForm() {
    this.hideSetPasswordForm = !this.hideSetPasswordForm;
  }

  linkEmail() {
    this.submitted = true;
    if (this.setPasswordForm.invalid) {
      return;
    }

    this.accountService.setPassword(this.setPasswordForm.value).subscribe({
      next: () => {
        this.submitted = false;
        this.toggleSetPasswordForm();
      }
    });
  }

  linkGoogle() {

  }
}
