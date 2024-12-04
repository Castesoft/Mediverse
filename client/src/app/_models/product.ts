import { HttpParams } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { BadRequest, baseInfo, baseParamsInfo, Entity, EntityParams, IParams } from "src/app/_models/types";
import { ProductsService } from "src/app/_services/products.service";
import { buildHttpParams, getPaginationHeaders, omitKeys } from "src/app/_utils/util";

export class Product extends Entity {
  quantity: number | null = null;
  unit: string | null = null;
  discount: number | null = null;
  dosage: string | null = null;
  price: number | null = null;
  lotNumber: string | null = null;
  manufacturer: string | null = null;
  photoUrl: string | null = null;
  isInternal: boolean | null = false;

  constructor(init?: Partial<Product>) {
    super();

    Object.assign(this, init);
  }
}

export const productInfo: FormInfo<Product> = {
  ...baseInfo,
  discount: { label: 'Descuento', type: 'number', },
  dosage: { label: 'Dosis', type: 'text', },
  isInternal: { label: 'Interno', type: 'checkbox', },
  lotNumber: { label: 'Número de lote', type: 'text', },
  manufacturer: { label: 'Fabricante', type: 'text', },
  photoUrl: { label: 'URL de la foto', type: 'text', },
  price: { label: 'Precio', type: 'number', },
  quantity: { label: 'Cantidad', type: 'number', },
  unit: { label: 'Unidad', type: 'text', },
} as FormInfo<Product>;

export class ProductForm extends FormGroup2<Product> {
  constructor() {
    super(Product, new Product(), productInfo);
  }
}

export class ProductParams extends EntityParams<Product> {
  constructor(key: string) {
    super(key);
  }

  get httpParams(): HttpParams {
    return buildHttpParams(omitKeys(this, ['key', 'httpParams', 'id']));
  }
}

export const productParamsInfo: FormInfo<ProductParams> = {
  ...baseParamsInfo,
} as FormInfo<ProductParams>;

export class ProductsFilterForm extends FormGroup2<ProductParams> {
  constructor() {
    super(ProductParams as any, new ProductParams(createId()), productParamsInfo);
  }
}
