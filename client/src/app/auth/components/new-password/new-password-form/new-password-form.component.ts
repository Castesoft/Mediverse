import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-new-password-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, InputControlComponent],
  templateUrl: './new-password-form.component.html',
  styleUrl: './new-password-form.component.scss'
})
export class NewPasswordFormComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private matSnackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    password    : [ '', [Validators.required, Validators.pattern(this.accountService.passwordPattern)] ],
    confirm     : [ '', [Validators.required] ],
  },{
    validators: [
      this.accountService.equalFields('password','confirm')
    ]
  });

  id: string = `newPasswordForm${createId()}`;
  submitted = false;
  email = '';
  resetToken = '';

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const paramEmail = params.get('email');
      const paramToken = params.get('resetToken');

      if (!paramEmail || !paramToken) {
        this.matSnackBar.open(`Operación inválida, intentalo de nuevo`, 'Cerrar', { duration: 3000 });
        this.router.navigateByUrl('/auth/sign-in/basic');
      }

      this.email = paramEmail!;
      this.resetToken = paramToken!;
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }

    this.accountService.resetPasswordWithToken(this.resetToken, this.form.get('password')?.value, this.email).subscribe(response => {
      this.matSnackBar.open(`Contraseña reestablecida`, 'Cerrar', { duration: 3000 });
      this.form.reset();
      this.submitted = false;
      this.router.navigateByUrl('/auth/sign-in/basic');
    });
  }
}
