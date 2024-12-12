import { Component, inject, output } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';

@Component({
  selector: 'app-card-overview',
  standalone: true,
  imports: [TemplateModule, ProfilePictureComponent],
  templateUrl: './card-overview.component.html',
  styleUrl: './card-overview.component.scss'
})
export class CardOverviewComponent {
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }
}
