import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ProfilePictureComponent } from "src/app/users/components/profile-picture/profile-picture.component";
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import {
  InvitationDetailsResponse,
  InvitationService,
  InvitingDoctorSummary
} from "src/app/_services/invitation.service";
import { catchError, of } from "rxjs";
import { LogoIconComponent } from "src/app/_shared/components/logo-icon/logo-icon.component";

type DetailsState = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-invitation-details',
  templateUrl: './invitation-details.component.html',
  styleUrls: [ './invitation-details.component.scss' ],
  imports: [ CommonModule, MaterialModule, ProfilePictureComponent, LogoIconComponent ],
})
export class InvitationDetailsComponent {
  private invitationService: InvitationService = inject(InvitationService);

  invitationToken: InputSignal<string | null> = input.required<string | null>();

  acceptClicked: OutputEmitterRef<void> = output<void>();
  cancelClicked: OutputEmitterRef<void> = output<void>();

  state: WritableSignal<DetailsState> = signal('loading');
  errorMessage: WritableSignal<string | null> = signal(null);
  doctorDetails: WritableSignal<InvitingDoctorSummary | null> = signal(null);
  roleInvitedAs: WritableSignal<string | null> = signal(null);

  readonly STATE_LOADING: DetailsState = 'loading';
  readonly STATE_LOADED: DetailsState = 'loaded';
  readonly STATE_ERROR: DetailsState = 'error';
  protected readonly PhotoSize = PhotoSize;

  constructor() {
    effect(() => {
      const token: string | null = this.invitationToken();
      if (token) {
        this.fetchDetails(token);
      } else {
        this.state.set(this.STATE_ERROR);
        this.errorMessage.set('No se proporcionó un token de invitación.');
      }
    });
  }

  fetchDetails(token: string): void {
    this.state.set(this.STATE_LOADING);
    this.errorMessage.set(null);
    this.doctorDetails.set(null);
    this.roleInvitedAs.set(null);

    this.invitationService.getInvitationDetails(token)
      .pipe(
        catchError((errorResponse: InvitationDetailsResponse) => {
          this.state.set(this.STATE_ERROR);
          this.errorMessage.set(errorResponse.message || 'Error desconocido al cargar detalles.');
          return of(null);
        })
      )
      .subscribe((response: InvitationDetailsResponse | null) => {
        if (response) {
          if (response.isValid && response.invitingDoctor) {
            this.doctorDetails.set(response.invitingDoctor);
            this.roleInvitedAs.set(response.roleInvitedAs);
            this.state.set(this.STATE_LOADED);
          } else {
            this.state.set(this.STATE_ERROR);
            this.errorMessage.set(response.message || 'La invitación no es válida o ha expirado.');
          }
        }
      });
  }

  onAccept(): void {
    this.acceptClicked.emit();
  }

  onCancel(): void {
    this.cancelClicked.emit();
  }

  getRoleDisplayName(): string {
    switch (this.roleInvitedAs()) {
      case 'Nurse':
        return 'Especialista';

      default:
        return 'colaborador';
    }
  }
}
