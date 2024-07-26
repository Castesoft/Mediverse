import { Component, input, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';

@Component({
  selector: '[productPicture]',
  standalone: true,
  imports: [],
  templateUrl: './product-picture.component.html',
  styleUrl: './product-picture.component.scss'
})
export class ProductProfilePictureComponent implements OnInit {

  product = input.required<Product>();
  bootstrapClass = 'success';

  ngOnInit(): void {
    this.bootstrapClass = this.getBootstrapClass(this.product().name);
  }

  bootstrapClasses = [
    'success',
    'danger',
    'info',
    'primary',
    'warning',
    'light',
    'dark'
  ];

  getBootstrapClass(name: string) {
    const asciiSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const classIndex = asciiSum % this.bootstrapClasses.length;
    return this.bootstrapClasses[classIndex];
  }
}
