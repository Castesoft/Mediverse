import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: '[productPicture]',
  standalone: true,
  imports: [],
  templateUrl: './product-picture.component.html',
})
export class ProductProfilePictureComponent implements OnInit {
  private utilsService = inject(UtilsService);
  product = input.required<Product>();
  bootstrapClass = 'success';

  ngOnInit(): void {
    this.bootstrapClass = this.utilsService.getBootstrapClass(this.product().name);
  }
}
