import { Component, inject, input, model, OnInit, output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Product } from "src/app/_models/product";
import { FormUse, View } from "src/app/_models/types";
import { ProductsService } from "src/app/_services/products.service";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  host: { class: 'row align-items-center justify-content-between g-3 mb-4', },
  selector: 'div[productHeader]',
  template: `
    <div class="col-12 col-md-auto">
      <h1>
        @if (use() === "create") {
          Crear {{ service.dictionary.singular }}
          @if (!validation) {
            <span class="fs--1 badge badge-phoenix badge-phoenix-info me-2"
              >Validación desactivada</span
            >
            @if (use() === "create") {
              <button class="btn btn-sm btn-phoenix-info" (click)="fillForm.emit()">
                Llenar con {{ service.dictionary.singular }} aleatorio
              </button>
            }
          }
        } @else if (use() === "edit") {
          Actualizar {{ service.dictionary.singular }}
          @if (!validation) {
            <span class="fs--1 badge badge-phoenix badge-phoenix-info me-2"
              >Validación desactivada</span
            >
          }
        } @else if (use() === "detail" && item !== null) {
          {{ service.dictionary.singularTitlecase }} #{{ item()!.id }}
        }
      </h1>
    </div>
    <div class="col-12 col-md-auto d-flex">
      <div>
        @if (use() === "detail") {
          <a
            class="btn btn-phoenix-secondary px-3 px-sm-5 me-2"
            (click)="service.clickLink(item()!, key(), use(), view())"
          >
            <fa-icon class="me-sm-2" [icon]="icons.faPenToSquare"></fa-icon>
            <span class="d-none d-sm-inline">Editar</span>
          </a>
        }
        @if (use() === "detail" || use() === "edit") {
          <button class="btn btn-phoenix-danger me-2" (click)="service.delete$(item()!)">
            <fa-icon [icon]="icons.faTrashCan" class="me-2" />Eliminar
            {{ service.dictionary.singular }}
          </button>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [ FontAwesomeModule, ],
})
export class ProductHeaderComponent implements OnInit {
  service = inject(ProductsService);
  icons = inject(IconsService);
  private forms = inject(FormsService);

  use = model.required<FormUse>();
  view = model.required<View>();
  key = model.required<string | null>();
  item = model.required<Product | null>();

  fillForm = output<void>();

  validation = false;

  ngOnInit(): void {
    this.forms.mode$.subscribe({ next: mode => this.validation = mode });
  }

}
