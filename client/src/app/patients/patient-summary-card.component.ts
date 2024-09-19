import {Component, inject, input, model, OnInit} from "@angular/core";
import {BootstrapModule} from "../_shared/bootstrap.module";
import {DatePipe} from "@angular/common";
import {User} from "../_models/user";
import {UsersService} from "../_services/users.service";
import {Subject, takeUntil} from "rxjs";
import { UserProfilePictureComponent } from "../users/components/user-profile-picture/user-profile-picture.component";
import { Router } from '@angular/router';

@Component({
  selector: 'div[patientSummaryCard]',
  templateUrl: 'patient-summary-card.component.html',
  imports: [
    BootstrapModule,
    DatePipe,
    UserProfilePictureComponent
],
  standalone: true,
})
export class PatientSummaryCardComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  private usersService = inject(UsersService);
  private router = inject(Router);

  key = input.required<string>();
  item = model.required<User>();
  headerTitle = input<string>();

  isDetailsCollapsed = true;
  photoUrl = 'https://i.pravatar.cc/300';

  ngOnInit(): void {
    this.subscribeToSelectedPatient(this.key());
  }

  private subscribeToSelectedPatient = (key: string) => {
    this.usersService.selected$(key).pipe(takeUntil(this.ngUnsubscribe)).subscribe((patient) => {
      if (patient) {
        if (!patient.photoUrl) {
          this.fetchNewPhotoUrl().then((url) => {
            this.photoUrl = url;
            patient.photoUrl = url;
          });
        } else {
          this.photoUrl = patient.photoUrl;
        }
        this.item.set(patient);
      }
    });
  }

  private async fetchNewPhotoUrl(): Promise<string> {
    // Call to the service that generates a new photo URL
    // Here it's just a simulated async call returning a URL
    return 'https://i.pravatar.cc/300?' + new Date().getTime();
  }

  goToPatient() {
    this.router.navigate(['/home/patients', this.item().id]);
  }
}
