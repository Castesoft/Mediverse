import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from "src/app/_models/products/product";
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'div[productPicture]',
  templateUrl: './product-picture.component.html',
  standalone: true,
  imports: [ CommonModule],
})
export class ProductProfilePictureComponent implements OnInit {
  private utilsService = inject(UtilsService);
  product = input.required<Product>();
  bootstrapClass = 'success';

  ngOnInit(): void {
    this.bootstrapClass = this.utilsService.getBootstrapClass(this.product().name!);
  }
}
