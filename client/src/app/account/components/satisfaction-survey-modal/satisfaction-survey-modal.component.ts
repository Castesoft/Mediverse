import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SatisfactionSurvey } from 'src/app/_models/satisfactionSurvey';
import { AccountService } from 'src/app/_services/account.service';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { ControlTextareaComponent } from 'src/app/_forms/control-textarea.component';

@Component({
  selector: 'app-satisfaction-survey-modal',
  standalone: true,
  imports: [ModalWrapperModule, InputControlComponent, ReactiveFormsModule, ControlCheckComponent, ControlTextareaComponent],
  templateUrl: './satisfaction-survey-modal.component.html',
  styleUrl: './satisfaction-survey-modal.component.scss'
})
export class SatisfactionSurveyModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  bsModalRef = inject(BsModalRef);

  submitted = false;
  loading = false;
  surveyForm!: FormGroup;
  satisfactionSurvey: SatisfactionSurvey | null = null;

  ngOnInit(): void {
    console.log(this.satisfactionSurvey);
    this.initForm();
  }

  initForm(): void {
    this.surveyForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]],
      eventId: [this.satisfactionSurvey?.eventId, [Validators.required]],
      isServiceRecommended: [false, [Validators.required]],
    });
  }

  rateExperience(star: number): void {
    this.surveyForm.patchValue({ rating: star });
  }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    if (this.surveyForm.valid) {
      const survey: SatisfactionSurvey = this.surveyForm.value;

      console.log(survey);
      
      this.accountService.submitReview(survey).subscribe({
        next: () => {
          this.bsModalRef.hide();
        },
        error: (error: any) => {
          this.submitted = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  skip(): void {
    this.accountService.skipSatisfactionSurvey(this.satisfactionSurvey?.eventId!).subscribe({
      next: () => {
        this.bsModalRef.hide();
      }
    });
  }
}
