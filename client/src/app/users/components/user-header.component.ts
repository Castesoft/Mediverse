import { Component, inject, input, OnInit, output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { User } from "src/app/_models/user";
import { FormUse, Role, View } from "src/app/_models/types";
import { UsersService } from "src/app/_services/users.service";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  host: { class: 'row align-items-center justify-content-between g-3 mb-4', },
  selector: 'div[userHeader]',
  template: `
    <div class="col-12 col-md-auto">
      <h1>
        @if (use() === "create") {
          Crear {{ service.namingDictionary.get(role())!.singular }}
          @if (!validation) {
            <span class="fs--1 badge badge-phoenix badge-phoenix-info me-2"
              >Validación desactivada</span
            >
            @if (use() === "create") {
              <button class="btn btn-sm btn-phoenix-info" (click)="fillForm.emit()">
                Llenar con {{ service.namingDictionary.get(role())!.singular }} aleatorio
              </button>
            }
          }
        } @else if (use() === "edit") {
          Actualizar {{ service.namingDictionary.get(role())!.singular }}
          @if (!validation) {
            <span class="fs--1 badge badge-phoenix badge-phoenix-info me-2"
              >Validación desactivada</span
            >
          }
        } @else if (use() === "detail" && item !== null) {
          {{ service.namingDictionary.get(role())!.singularTitlecase }} #{{ item()!.id }}
        }
      </h1>
    </div>
    <div class="col-12 col-md-auto d-flex">
      <div>
        @if (use() === "detail") {
          <a
            class="btn btn-phoenix-secondary px-3 px-sm-5 me-2"
            (click)="service.clickLink(role(), item()!.id, item()!, key() ?? null, 'edit', view())"
          >
            <fa-icon class="me-sm-2" [icon]="icons.faPenToSquare"></fa-icon>
            <span class="d-none d-sm-inline">Editar</span>
          </a>
        }
        @if (use() === "detail" || use() === "edit") {
          <button class="btn btn-phoenix-danger me-2" (click)="service.delete$(item()!, role())">
            <fa-icon [icon]="icons.faTrashCan" class="me-2" />Eliminar
            {{ service.namingDictionary.get(role())!.singular }}
          </button>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [ FontAwesomeModule, ],
})
export class UserHeaderComponent implements OnInit {
  service = inject(UsersService);
  icons = inject(IconsService);
  private forms = inject(FormsService);

  use = input.required<FormUse>();
  view = input.required<View>();
  key = input.required<string | undefined>();
  item = input.required<User | null>();
  role = input.required<Role>();

  fillForm = output<void>();

  validation = false;

  ngOnInit(): void {
    this.forms.mode$.subscribe({ next: mode => this.validation = mode });
  }

}
