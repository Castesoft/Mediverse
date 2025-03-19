import { Component, effect, inject, input, model, OnInit, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { Router } from '@angular/router';
import { Account } from 'src/app/_models/account/account';
import { User } from 'src/app/_models/users/user';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { UsersService } from 'src/app/users/users.config';

@Component({
  selector: 'div[patientSummaryCard]',
  templateUrl: 'patient-summary-card.component.html',
  imports: [
    BootstrapModule,
    DatePipe,
    ProfilePictureComponent
],
  standalone: true,
})
export class PatientSummaryCardComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  private usersService = inject(UsersService);
  private router = inject(Router);

  key = model.required<string>();
  item = model.required<User>();
  headerTitle = input<string>();

  account = signal<Account | null>(null);

  isDetailsCollapsed = true;
  photoUrl = 'https://i.pravatar.cc/300';

  constructor() {
    effect(() => {
      this.account.set(new Account({
        id: this.item().id,
        firstName: this.item().firstName,
        photoUrl: this.item().photoUrl,
      }));
    })
  }

  ngOnInit(): void {
    this.subscribeToSelectedPatient(this.key());
  }

  private subscribeToSelectedPatient = (key: string) => {
    // this.usersService.selected$(key).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((patient) => {
    //   if (patient) {
    //     if (!patient.photoUrl) {
    //       this.fetchNewPhotoUrl().then((url) => {
    //         this.photoUrl = url;
    //         patient.photoUrl = url;
    //       });
    //     } else {
    //       this.photoUrl = patient.photoUrl;
    //     }
    //     this.item.set(patient);
    //   }
    // });
  }

  private async fetchNewPhotoUrl(): Promise<string> {
    // Call to the service that generates a new photo URL
    // Here it's just a simulated async call returning a URL
    return 'https://i.pravatar.cc/300?' + new Date().getTime();
  }

  goToPatient() {
    this.router.navigate(['/inicio/pacientes', this.item().id]);
  }
}
