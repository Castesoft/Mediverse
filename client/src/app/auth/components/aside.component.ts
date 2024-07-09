import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: '[aside]',
  templateUrl: './aside.component.html',
  standalone: true,
  imports: [ RouterModule, ],
})
export class AsideComponent {
  utils = inject(UtilsService);
}
