import {Component, OnInit, OnDestroy, inject, input, output, HostBinding} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";
import { User, CreateForm, EditForm, DetailForm } from "src/app/_models/user";
import {BadRequest, FormControlStyles, FormUse, Role, View} from "src/app/_models/types";
import { createId } from "@paralleldrive/cuid2";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { JsonPipe } from "@angular/common";
import { ControlsModule } from "src/app/_forms/controls.module";
import { UsersService } from "src/app/_services/users.service";

@Component({
  selector: 'div[userForm]',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, AlertModule, RouterModule, JsonPipe, ControlsModule, ],
})
export class UserFormComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private formsService = inject(FormsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  service = inject(UsersService);
  icons = inject(IconsService);

  id = input.required<number | null>();
  use = input.required<FormUse>();
  view = input.required<View>();
  role = input.required<Role>();
  key = input<string>();
  style = input<FormControlStyles>('solid');

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') return 'card-body pt-9 pb-0';
    else return '';
  }

  user = output<User>();

  item: User | null = null;
  _key = createId();

  form!: CreateForm | EditForm | DetailForm;
  returnUrl: string | null = null;
  private ngUnsubscribe = new Subject<void>();

  isDetail = false;

  constructor() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        if (params['returnUrl']) this.returnUrl = params['returnUrl'];
      },
    });
  }

  ngOnInit(): void {
    if (this.key()) this._key = this.key()!;

    if (this.use() === 'create') {
      this.form = new CreateForm();
    } else if (this.use() === 'edit') {
      this.form = new EditForm();
    } else if (this.use() === 'detail') {
      this.form = new DetailForm();
    }

    if (this.use() === 'edit' || this.use() === 'detail') {
      this.service.current$.subscribe({
        next: (item) => {
          if (item) {
              this.item = item;
              if (this.form instanceof EditForm) this.form.patchValues(item);
              if (this.form instanceof DetailForm) this.form.patchValues(item);
              if (this.form instanceof CreateForm) this.form.group.patchValue(item);
          }
        },
      });
    }

    if (this.use() === 'detail') {
      this.isDetail = true;
    }

    this.formsService.mode$.subscribe({
      next: (mode) => {
        this.form.validation = mode;
        this.applyValidationsToForm(mode);
      },
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.form.submitted = true;
    if (this.use() === 'create') {
      this.create();
    } else {
      this.update();
    }
  }

  private applyValidationsToForm(mode: boolean) {
    if (this.form) {
      if (this.use() === 'create' && this.form instanceof CreateForm) {
        this.form.setValidators(mode);
      } else if (this.use() === 'edit' && this.form instanceof EditForm) {
        this.form.setValidators(mode);
      }
    }
  }

  onCancel() {
    this.form.submitted = false;
    if (this.use() === 'create') {
      this.form.group.reset();
      this.form.group.markAsPristine();
      this.router.navigate([`${this.service.namingDictionary.get(this.role())!.catalogRoute}/${this.service.namingDictionary.get(this.role())!.plural}`]);
    } else if (this.use() === 'edit') {
      this.form.group.reset();
      this.form.group.markAsPristine();
      this.router.navigate([`${this.service.namingDictionary.get(this.role())!.catalogRoute}/${this.item!.id}`]);
    }
  }

  fillForm() {
    if (this.use() === 'create' && this.form instanceof CreateForm) {
      // this.form.patchWithSample();
    }
  }

  create() {
    const formValues = this.form.group.value;
    if (this.form.group.valid || !this.form.validation) {
      this.service.create(formValues, this.role(), this.view(), this._key).subscribe({
        next: item => {
          this.user.emit(item);
          this.form.submitted = false;
          this.form.group.reset();
          this.form.group.markAsPristine();
        },
        error: (error: BadRequest) => {
          console.log('error from component',error)
          this.form.error = error;
        },
      });
    }
  }

  update() {
    const formValues = this.form.group.value;
    if (this.form.group.valid || !this.form.validation) {
      this.service.update(this.item!.id, formValues, this.role()).subscribe({
        next: () => {
          this.form.submitted = false;
          this.toastr.success(
            this.service.namingDictionary.get(this.role())!.singularTitlecase + ' actualizado',
            'Éxito',
          );
          this.form.group.reset();
          this.form.group.markAsPristine();
          this.router.navigate([`${this.service.namingDictionary.get(this.role())!.catalogRoute}/${this.item!.id}`]);
          this.service.hideEditModal();
        },
        error: (error: any) => {
          this.form.error = error;
        },
      });
    }
  }
}
