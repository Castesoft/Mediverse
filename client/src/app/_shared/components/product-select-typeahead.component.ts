import { Component, computed, inject, input, model, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ControlTypeaheadComponent } from "src/app/_forms/control-typeahead.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ErrorsAlertComponent } from "src/app/_forms/helpers/errors-alert.component";
import { finalize, map, Observable, Subject, takeUntil } from "rxjs";
import { ProductsService } from "src/app/_services/products.service";
import { IconsService } from "src/app/_services/icons.service";
import { Product, ProductParams, ProductSummary } from "src/app/_models/product";
import { TypeaheadComplexOption } from "src/app/_models/types";
import { createId } from "@paralleldrive/cuid2";
import { AlertModule } from "ngx-bootstrap/alert";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { DatePipe, JsonPipe } from "@angular/common";
import { UserProfilePictureComponent } from "src/app/users/components/user-profile-picture/user-profile-picture.component";
import { ProductProfilePictureComponent } from "src/app/_shared/components/product-picture.component";

interface ProductTypeaheadOptions extends TypeaheadComplexOption {
  data: ProductSummary,
}

@Component({
  selector: '[productSelectTypeahead]',
  templateUrl: './product-select-typeahead.component.html',
  imports: [
    ControlTypeaheadComponent,
    FaIconComponent,
    PopoverModule,
    ReactiveFormsModule,
    ErrorsAlertComponent,
    AlertModule,
    JsonPipe,
    DatePipe,
    UserProfilePictureComponent,
    ProductProfilePictureComponent,
  ],
  standalone: true
})
export class ProductSelectTypeaheadComponent implements OnInit, OnChanges {
  private ngUnsubscribe = new Subject<void>();
  service = inject(ProductsService);
  icons = inject(IconsService);

  isProductSelected = computed(() => this.product() !== null);
  selectionErrors = input<string[]>([]);
  label = input<string>();
  isDisabled = input.required<boolean>();
  popover = input<string | undefined>();
  product = model.required<Product | null>();
  sex = input<string | undefined>();
  key = input<string>(createId());
  showCatalogButton = input<boolean>(true);

  submitted = false;
  loading = true;

  formGroup: FormGroup = new FormGroup({});
  productSummaries$: Observable<ProductTypeaheadOptions[]> = new Observable();
  products: ProductSummary[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.loading = false;
    this.initForm();
    this.subscribeToSelectedProduct();
    this.subscribeToFormValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isDisabled"]) {
      this.setInputDisabled(this.isDisabled());
    }
  }

  private subscribeToSelectedProduct(): void {
    this.service.selected$(this.key()).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (product) => {
        this.product.set(product || null);
        this.setInputStatusAndValue();
      }
    });
  }

  private initForm = (): void => {
    this.formGroup = new FormGroup({ productTypeahead: new FormControl("", Validators.required) });
    this.setInputDisabled(this.isDisabled());
  };

  private subscribeToSummaries = (formValue: any) => {
    const productParams: ProductParams = new ProductParams(this.key());

    productParams.search = formValue.productTypeahead;

    this.productSummaries$ = this.service.getSummaryByValue(this.key(), productParams)
      .pipe(map((response: ProductSummary[]) => {
        this.products = response;

        return response.map((product: ProductSummary) => {
            return { name: product.name, value: product.id, data: product };
          }
        );
      }));
  };

  private setInputStatusAndValue = () => {
    if (this.isProductSelected()) {
      this.submitted = true;
      const newValue = this.product()?.name || "";
      const currentValue = this.formGroup.controls["productTypeahead"].value;

      if (newValue !== currentValue) {
        this.formGroup.controls["productTypeahead"].setValue(newValue);
        this.submitted = true;
      }
    } else {
      if (this.formGroup.controls["productTypeahead"].value !== "") {
        this.formGroup.controls["productTypeahead"].setValue("");
        this.submitted = false;
      }
    }
  };

  private subscribeToFormValueChanges = () => {
    this.formGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (formValue) => {
        this.subscribeToSummaries(formValue);
      }
    });
  };

  private setInputDisabled = (isDisabled: boolean): void => {
    if (!this.formGroup.controls["productTypeahead"]) return;

    if (isDisabled) {
      this.formGroup.controls["productTypeahead"].disable();
    } else {
      this.formGroup.controls["productTypeahead"].enable();
    }
  };

  onInputFocus = () => {
    this.subscribeToSummaries({eventTypeahead: ''});
  };

  openCatalogModal = () => {
    this.service.showCatalogModal(new MouseEvent('click'), this.key(), 'select')
  }

  onTypeaheadSelect = (data: TypeaheadMatch): void => {
    if (!data.item.value) return;

    this.loading = true;
    this.service.getById(data.item.value)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((product) => {
        this.service.setSelected$(this.key(), product);
      });
  };

  onTypeaheadLoading = (loading: boolean) => this.loading = loading;
}
