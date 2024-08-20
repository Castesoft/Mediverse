import { Component } from '@angular/core';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';

@Component({
  selector: 'app-doctor-reviews-tab',
  standalone: true,
  imports: [UserProfilePictureComponent],
  templateUrl: './doctor-reviews-tab.component.html',
  styleUrl: './doctor-reviews-tab.component.scss'
})
export class DoctorReviewsTabComponent {
  reviews = [
    {
      name: "John Doe",
      rating: 5,
      date: "12 de enero de 2021",
      review: "Excelente doctor, muy profesional y atento. Me ayudó a resolver mi problema de salud."
    },
    {
      name: "Jane Doe",
      rating: 4,
      date: "5 de febrero de 2021",
      review: "Muy buen doctor, me explicó todo muy bien y me dio un tratamiento efectivo."
    },
    {
      name: "Juan Pérez",
      rating: 3,
      date: "20 de marzo de 2021",
      review: "Buen doctor, pero la consulta fue un poco cara."
    },
    {
      name: "John Doe",
      rating: 5,
      date: "12 de enero de 2021",
      review: "Excelente doctor, muy profesional y atento. Me ayudó a resolver mi problema de salud."
    },
    {
      name: "Jane Doe",
      rating: 4,
      date: "5 de febrero de 2021",
      review: "Muy buen doctor, me explicó todo muy bien y me dio un tratamiento efectivo."
    },
    {
      name: "Juan Pérez",
      rating: 3,
      date: "20 de marzo de 2021",
      review: "Buen doctor, pero la consulta fue un poco cara."
    },
    {
      name: "John Doe",
      rating: 5,
      date: "12 de enero de 2021",
      review: "Excelente doctor, muy profesional y atento. Me ayudó a resolver mi problema de salud."
    },
    {
      name: "Jane Doe",
      rating: 4,
      date: "5 de febrero de 2021",
      review: "Muy buen doctor, me explicó todo muy bien y me dio un tratamiento efectivo."
    },
    {
      name: "Juan Pérez",
      rating: 3,
      date: "20 de marzo de 2021",
      review: "Buen doctor, pero la consulta fue un poco cara."
    }
  ]

  convertToStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
