import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EMPTY, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { InvitationAcceptAuthRequiredResponse, InvitationService } from 'src/app/_services/invitation.service';
import { AccountService } from 'src/app/_services/account.service';
import { AuthNavigationService } from 'src/app/_services/auth-navigation.service';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { MaterialModule } from 'src/app/_shared/material.module';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

type InvitationState = 'loading' | 'requires_auth' | 'success' | 'error' | 'idle';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [ CommonModule, RouterModule, MaterialModule ],
  templateUrl: './accept-invitation.component.html',
  styleUrls: [ './accept-invitation.component.scss' ]
})
export class AcceptInvitationComponent implements OnInit {
  private authNavigation:AuthNavigationService = inject(AuthNavigationService);
  private invitationService: InvitationService = inject(InvitationService);
  private accountService: AccountService = inject(AccountService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastr: ToastrService = inject(ToastrService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);

  private routeSub: Subscription | null = null;
  private acceptSub: Subscription | null = null;

  currentState: WritableSignal<InvitationState> = signal('idle');
  message: WritableSignal<string | null> = signal(null);
  token: WritableSignal<string | null> = signal(null);

  readonly STATE_LOADING = 'loading';
  readonly STATE_REQUIRES_AUTH = 'requires_auth';
  readonly STATE_SUCCESS = 'success';
  readonly STATE_ERROR = 'error';

  ngOnInit(): void {
    this.currentState.set('loading');
    this.message.set('Validando invitación...');

    this.routeSub = this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const currentToken = params.get('token');
      this.token.set(currentToken);

      if (!currentToken) {
        this.handleErrorState('Token de invitación inválido o ausente en la URL.');
        return;
      }

      const pendingToken = localStorage.getItem('pendingInvitationToken');
      if (pendingToken && pendingToken === currentToken) {
        localStorage.removeItem('pendingInvitationToken');
        if (this.accountService.current()) {
          console.log("Retrying invitation acceptance after authentication.");
          this.attemptAcceptInvitation(currentToken);
        } else {
          console.warn("Pending token found, but user is not logged in. Requiring auth again.");
          this.handleRequiresAuth(currentToken, 'Hubo un problema al verificar tu sesión. Por favor, inicia sesión de nuevo.');
        }
      } else if (this.accountService.current()) {

        console.log("User already logged in. Attempting invitation acceptance.");
        this.attemptAcceptInvitation(currentToken);
      } else {

        console.log("User not logged in. Requiring authentication.");
        this.handleRequiresAuth(currentToken);
      }
    });
  }

  private attemptAcceptInvitation(token: string): void {
    this.currentState.set('loading');
    this.message.set('Procesando invitación...');

    this.acceptSub?.unsubscribe();

    this.acceptSub = this.invitationService.acceptInvitation(token)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && error.error?.requiresAuthentication === true) {
            this.handleRequiresAuth(token, error.error.message || 'Por favor, inicia sesión o regístrate para aceptar.');
          } else {

            this.handleApiError(error);
          }
          return EMPTY;
        })
      )
      .subscribe((response) => {

        if (this.isAuthRequiredResponse(response)) {

          this.handleRequiresAuth(response.token, response.message);
        } else {

          this.handleSuccessState(response.message);
        }
      });
  }

  private isAuthRequiredResponse(response: any): response is InvitationAcceptAuthRequiredResponse {
    return response && typeof response === 'object' && response.requiresAuthentication === true;
  }

  private handleRequiresAuth(token: string, msg?: string): void {
    this.currentState.set(this.STATE_REQUIRES_AUTH);
    this.message.set(msg || 'Necesitas iniciar sesión o registrarte para aceptar esta invitación.');

    localStorage.setItem('pendingInvitationToken', token);
    console.log(`Stored pending token: ${token}. Redirecting to sign-in.`);

    const returnUrl = `/auth/accept-invitation?token=${encodeURIComponent(token)}`;
    this.authNavigation.navigateToSignIn({ returnUrl: returnUrl }).catch(err => {
      console.error("Failed to navigate to sign-in:", err);
      this.handleErrorState("No se pudo redirigir a la página de inicio de sesión.");
    });
  }

  private handleSuccessState(successMessage: string): void {
    this.currentState.set(this.STATE_SUCCESS);
    this.message.set(successMessage || '¡Invitación aceptada con éxito!');
    this.toastr.success(this.message()!);

    setTimeout(() => {
      this.authNavigation.navigateToAccount().catch(err => {
        console.error("Failed to navigate to account page:", err);

      });
    }, 3000);
  }

  private handleApiError(error: HttpErrorResponse): void {
    console.error("API Error accepting invitation:", error);
    let displayMessage = 'Ocurrió un error al procesar la invitación.';

    if (error.status === 404) {
      displayMessage = 'La invitación no fue encontrada o ya no es válida.';
    } else if (error.status === 409) {
      displayMessage = 'Esta invitación ya ha sido procesada anteriormente.';
    } else if (error.status === 400) {
      const badRequest = new BadRequest(error);
      if (badRequest.type === "ValidationError" && badRequest.validationErrors.length > 0) {
        displayMessage = `Error: ${badRequest.validationErrors.join('. ')}`;
      } else {
        displayMessage = badRequest.message || 'Error en la solicitud. Verifica que la invitación sea para tu cuenta.';
      }
    } else if (error.status === 403) {
      displayMessage = "No tienes permiso para realizar esta acción.";
    }

    this.handleErrorState(displayMessage);
  }

  private handleErrorState(errorMessage: string): void {
    this.currentState.set(this.STATE_ERROR);
    this.message.set(errorMessage);
    this.toastr.error(errorMessage);
  }

  goToHome(): void {
    this.router.navigate([ '/' ]).catch(console.error);
  }
}
