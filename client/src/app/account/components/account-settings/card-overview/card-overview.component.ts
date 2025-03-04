import { Component, inject, output } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-card-overview',
  standalone: true,
  imports: [TemplateModule, ProfilePictureComponent],
  templateUrl: './card-overview.component.html',
  styleUrl: './card-overview.component.scss'
})
export class CardOverviewComponent {
  readonly service = inject(AccountService);
  readonly onSelectSection = output<string>();
  readonly utilsService = inject(UtilsService);

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  protected readonly PhotoSize = PhotoSize;
  protected readonly PhotoShape = PhotoShape;
}
