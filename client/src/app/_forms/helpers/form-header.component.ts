import { DecimalPipe, NgClass } from "@angular/common";
import { Component, HostBinding, HostListener, inject, input, model, output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormUse, NamingSubject, View } from "src/app/_models/types";
import { EnvService } from "src/app/_services/env.service";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";

export type DetailActions = 'edit' | 'cancel' | 'delete' | 'create';

@Component({
  selector: 'a[detailLink]',
  template: `
  @switch(type()) {
    @case('edit') {
      <fa-icon class="me-sm-2" [icon]="icons.faPenToSquare"></fa-icon>
      <span class="d-none d-sm-inline">Editar</span>
    }
    @case('cancel') {
      <fa-icon class="me-sm-2" [icon]="icons.faCancel"></fa-icon>
      <span class="d-none d-sm-inline">Cancelar</span>
    }
    @case('delete') {
      <fa-icon [icon]="icons.faTrashCan" class="me-2" />
        Eliminar
        {{ dictionary().singular }}
    }
    @case('create') {
      <fa-icon [icon]="icons.faPlus" class="me-2" />
      Nuevo
    }
  }
  `,
  standalone: true,
  imports: [FontAwesomeModule, RouterModule,],
})
export class DetailLinkComponent {
  router = inject(Router);
  icons = inject(IconsService);
  bsModalService = inject(BsModalService);

  type = input.required<DetailActions>();
  use = model.required<FormUse>();
  dictionary = input.required<NamingSubject>();
  view = model.required<View>();
  id = input.required<number | undefined>();

  onDelete = output<void>();

  @HostBinding('class') get class() {
    switch (this.type()) {
      case 'edit': return 'btn btn-phoenix-secondary px-3 px-sm-5 me-2';
      case 'cancel': return 'btn btn-phoenix-secondary px-3 px-sm-5 me-2';
      case 'delete': return 'btn btn-phoenix-danger px-3 px-sm-5 me-2';
      case 'create': return 'btn btn-primary me-2';
    }
  }

  @HostBinding('href') get href() {
    switch (this.type()) {
      case 'edit': return this.dictionary().catalogRoute + '/' + this.id() + '/editar';
      case 'cancel':
        if (this.use() === 'create') {
          return this.dictionary().catalogRoute;
        }
        return this.dictionary().catalogRoute + '/' + this.id();
      case 'delete': return this.dictionary().catalogRoute + '/' + this.id();
      case 'create': return this.dictionary().createRoute!;
    }
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    switch (this.type()) {
      case 'edit':
        this.view() === 'modal' ? this.use.set('edit') : this.router.navigate([this.dictionary().catalogRoute, this.id()!, 'editar']);
        break;
      case 'cancel':
        if (this.use() === 'create') {
          if (this.view() === 'page') {
            this.router.navigate([this.dictionary().catalogRoute]);
          } else if (this.view() === 'modal') {
            this.bsModalService.hide();
          }
        }
        if (this.use() === 'edit') {
          if (this.view() === 'modal') {
            this.use.set('detail');
          }
          else {
            this.router.navigate([this.dictionary().catalogRoute, this.id()!]);
          }
        }
        break;
      case 'delete':
        this.onDelete.emit();
        break;
      case 'create':
        this.view() === 'modal' ? this.use.set('create') : this.router.navigate([this.dictionary().createRoute]);
        break;
    }
    event.preventDefault();
  }
}

@Component({
  selector: 'h4[formHeader]',
  template: `
  @switch(use()) {
    @case("create") {
      Crear {{ dictionary().singular }}
    }
    @case("edit") {
      Editar {{ dictionary().singular }} #{{ id() | number }}
    }
    @case("detail") {
      @if(id()) {
        {{ dictionary().singularTitlecase }} #{{ id() | number }}
      }
    }
  }
  `,
  standalone: true,
  imports: [FontAwesomeModule, DecimalPipe, DetailLinkComponent,],
})
export class FormHeaderComponent {
  dictionary = input.required<NamingSubject>();
  use = model.required<FormUse>();
  id = input.required<number | undefined>();
}

@Component({
  host: { class: 'row align-items-center justify-content-between g-3 mb-2', },
  selector: 'div[detailHeader]',
  template: `
  <div class="col-12 col-md-auto">
  <h4 formHeader [dictionary]="dictionary()" [id]="id()" [use]="use()"></h4>
</div>
<div class="col-12 col-md-auto d-flex">
    @if(use() === 'create') {
      <a detailLink [type]="'cancel'" [dictionary]="dictionary()" [(use)]="use" [view]="view()" [id]="id()"></a>
    }
    @if (use() !== 'create') {
      <a detailLink [type]="'create'" [dictionary]="dictionary()" [(use)]="use" [view]="view()" [id]="id()"></a>
    }
    @if (use() === "detail") {
      <a detailLink [type]="'edit'" [dictionary]="dictionary()" [(use)]="use" [view]="view()" [id]="id()"></a>
    }
    @if (use() === "edit") {
      <a detailLink [type]="'cancel'" [dictionary]="dictionary()" [(use)]="use" [view]="view()" [id]="id()"></a>
    }
    @if (use() !== 'create') {
      <a detailLink [type]="'delete'" [dictionary]="dictionary()" [(use)]="use" [view]="view()" [id]="id()" (onDelete)="onDelete.emit();"></a>
    }
</div>`,
  standalone: true,
  imports: [FontAwesomeModule, FormHeaderComponent, DetailLinkComponent,],
})
export class DetailHeaderComponent {
  icons = inject(IconsService);
  router = inject(Router);

  use = model.required<FormUse>();
  view = model.required<View>();
  id = input.required<number | undefined>();
  dictionary = input.required<NamingSubject>();

  onDelete = output<void>();
}

@Component({
  host: { class: 'd-flex align-items-center mt-2', },
  selector: 'div[detailFooter]',
  template: `

  @if(dev) {
    <span class="badge badge-phoenix me-2 badge-phoenix-primary">Validación</span>
    <div class="d-flex align-items-center flex-1">
      <fa-icon [icon]="icons.faCircle" class="me-1 pointer" [ngClass]="validation ? 'text-success' : 'text-danger'" (click)="form.toggle()"></fa-icon>
      <span class="fw-bold fs-9 text-body pointer" (click)="form.toggle()">{{label}}</span>
    </div>
  } @else {
    <div class="d-flex flex-1"></div>
  }

  <button class="btn btn-phoenix-primary" [attr.form]="formId()" type="submit">
    <fa-icon [icon]="icons.faSave" class="me-2 d-none d-sm-inline-block"></fa-icon>
    @if (use() === "create") {
      Crear {{ dictionary().singular }}
    } @else if (use() === "edit") {
      Guardar cambios
    }
  </button>
  `,
  standalone: true,
  imports: [FontAwesomeModule, NgClass,],
})
export class DetailFooterComponent {
  icons = inject(IconsService);
  router = inject(Router);
  env = inject(EnvService);
  form = inject(FormsService);

  use = model.required<FormUse>();
  view = model.required<View>();
  id = input.required<number | undefined>();
  dictionary = input.required<NamingSubject>();
  formId = input.required<string>();

  dev = false;
  validation = false;
  label: 'Desactivado' | 'Activado' = 'Desactivado';

  constructor() {
    this.env.mode$.subscribe({ next: mode => {
      this.dev = mode;
    } });
    this.form.mode$.subscribe({ next: validation => {
      this.validation = validation;
      this.label = validation ? 'Activado' : 'Desactivado';
    }});
  }
}
