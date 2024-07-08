import { Component } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: '[aside]',
  templateUrl: './aside.component.html',
  standalone: true,
  imports: [ RouterModule, ],
})
export class AsideComponent {

  constructor(public utils: UtilsService) {

  }

}
