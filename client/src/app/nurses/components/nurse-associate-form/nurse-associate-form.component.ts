import { Component, inject, OnInit, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NursesService } from 'src/app/nurses/nurses.config';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Account } from "src/app/_models/account/account";
import { NurseAssociationRequest } from "src/app/_models/nurses/nurseConstants";

@Component({
  selector: 'div[nurseAssociateForm]',
  templateUrl: './nurse-associate-form.component.html',
  styleUrls: [ './nurse-associate-form.component.scss' ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class NurseAssociateFormComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private nursesService: NursesService = inject(NursesService);
  private toastr: ToastrService = inject(ToastrService);

  completed: OutputEmitterRef<Account | null> = output<Account | null>();
  cancelled: OutputEmitterRef<void> = output<void>();

  associateForm!: FormGroup;
  isSubmitting: boolean = false;
  generalError: string | null = null;

  controlErrors: { [key: string]: string[] } = {};

  ngOnInit(): void {
    this.associateForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.email, Validators.maxLength(500) ] ],
      firstName: [ '', [ Validators.maxLength(100) ] ],
      lastName: [ '', [ Validators.maxLength(100) ] ]
    });

    this.associateForm.statusChanges.subscribe(() => this.updateControlErrors());
  }

  onSubmit(): void {
    this.generalError = null;
    this.controlErrors = {};

    if (this.associateForm.invalid) {
      this.associateForm.markAllAsTouched();
      this.updateControlErrors();
      this.toastr.warning('Por favor, corrija los errores en el formulario.');
      return;
    }

    this.isSubmitting = true;
    const payload: NurseAssociationRequest = this.associateForm.value;

    this.nursesService.associateOrInviteNurse(payload)
      .pipe(
        finalize(() => this.isSubmitting = false),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          if ((response as any).message) {
            this.toastr.success((response as any).message);
            this.completed.emit(null);
          } else if ((response as Account).id) {
            const associatedNurse = response as Account;
            this.toastr.success(`Especialista ${associatedNurse.fullName} asociado/a correctamente.`);
            this.completed.emit(associatedNurse);
          } else {
            this.toastr.info("Operación completada.");
            this.completed.emit(null);
          }
        }
      });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private handleError(error: HttpErrorResponse): void {
    console.error("Error associating/inviting nurse:", error);
    this.generalError = 'Ocurrió un error inesperado. Por favor, intente de nuevo.';

    if (error.status === 409) {
      this.generalError = error.error?.message || error.error || 'Este/a especialista ya está asociado/a contigo.';
    } else if (error.status === 400) {
      const badRequest = new BadRequest(error);
      if (badRequest.type === "ValidationError" && badRequest.validationErrors.length > 0) {


        this.generalError = `Error(es) de validación: ${badRequest.validationErrors.join('. ')}`;
      } else {
        this.generalError = badRequest.message || 'Error en la solicitud. Verifique los datos ingresados.';
      }
    }
    this.toastr.error(this.generalError || 'Error desconocido.');
  }


  private updateControlErrors(): void {
    this.controlErrors = {};
    for (const controlName in this.associateForm.controls) {
      const control = this.associateForm.get(controlName);
      if (control && control.invalid && (control.dirty || control.touched)) {
        const messages: string[] = [];
        if (control.errors?.['required']) messages.push('Este campo es requerido.');
        if (control.errors?.['email']) messages.push('Ingrese un correo electrónico válido.');
        if (control.errors?.['maxlength']) messages.push(`No puede exceder ${control.errors['maxlength'].requiredLength} caracteres.`);

        this.controlErrors[controlName] = messages;
      }
    }
  }
}
