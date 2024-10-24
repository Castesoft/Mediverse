import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DoctorResult } from 'src/app/_models/doctorResult';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html'
})
export class ShareModalComponent {
  copyFeedback: string = '';
  @Input() doctor: DoctorResult | null = null;
  @Input() shareUrl: string = '';

  constructor(public bsModalRef: BsModalRef) {}

  shareProfile(platform: string) {
    const doctorName = `Dr. ${this.doctor!.firstName} ${this.doctor!.lastName}`;
    const specialty = this.doctor!.specialties[0].name;
    const text = `¡Descubre a un excelente especialista en ${specialty}! Te recomiendo al ${doctorName}. Su experiencia y atención son excepcionales. Agenda tu cita fácilmente a través de Mediverse y cuida tu salud con lo mejor.`;
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + this.shareUrl)}`;
        break;
      case 'email':
        const subject = `Te recomiendo a un excelente especialista en ${specialty}: ${doctorName}`;
        url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text + '\n\nMás información y agenda tu cita: ' + this.shareUrl)}`;
        break;
    }

    window.open(url, '_blank');
  }

  copyShareUrl(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);

    this.copyFeedback = '¡Enlace copiado!';
    setTimeout(() => {
      this.copyFeedback = '';
    }, 2000); // Message disappears after 2 seconds
  }
}
