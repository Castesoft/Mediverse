import { Component } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[aside]',
  templateUrl: './aside.component.html'
})
export class AsideComponent {

  constructor(public utils: UtilsService) {

  }

}
