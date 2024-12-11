import { Component, inject, output } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';

@Component({
  selector: 'app-card-deactivate',
  standalone: true,
  imports: [TemplateModule],
  templateUrl: './card-deactivate.component.html',
  styleUrl: './card-deactivate.component.scss'
})
export class CardDeactivateComponent {
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }
}
