import { FormInfo } from "src/app/_models/forms/formTypes";
import { transform } from "src/app/_models/base/paramUtils";
import { SelectOption } from "src/app/_models/base/selectOption";
import { DateRange } from "src/app/_models/base/dateRange";
import { sortOptions } from "src/app/_models/forms/formConstants";
import { SiteSection } from "../sections/sectionTypes";


/**
 * Represents the parameters for an entity, including pagination, sorting, searching, and date range filtering.
 *
 * @template T - The type of the entity.
 */
export class EntityParams<T> {
  pageNumber: number | null = 1;
  pageSize: number | null = 10;
  search: string | null = null;
  sort: SelectOption | null = new SelectOption({ name: "ID", code: "id" });
  isSortAscending: boolean | null = true;
  dateRange: DateRange | null = new DateRange();
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  name: string | null = null;
  description: string | null = null;
  key: string | null = null;
  id: number | null = 0;
  fromSection: SiteSection | null = null;

  constructor(key: string | null, init?: Partial<EntityParams<T>>) {
    if (key === null) throw new Error('Key cannot be null');
    this.key = key;

    Object.assign(this, init);

    if (init?.sort) {
      this.sort = init.sort;
    }
  }

  /**
   * Gets the concatenated string of the transformed instance values.
   * The transformation is applied to the current instance (`this`), and the resulting values
   * are joined with a hyphen ('-') separator.
   *
   * @returns {string} The concatenated string of the transformed instance values.
   */
  get paramsValue(): string {
    const instanceValues = transform(this);
    return Object.values(instanceValues).join('-');
  }
}

export const baseFilterFormInfo: FormInfo<EntityParams<any>> = {
  search: { type: "text", label: "Buscar" },
  pageNumber: { type: "number", label: "Página" },
  pageSize: { type: "number", label: "Resultados por página" },
  sort: { label: 'Ordenar por', selectOptions: sortOptions, style: 'material', showCodeSpan: false, },
  isSortAscending: { type: 'slideToggle', label: 'Ordenar Ascendente', },
} as FormInfo<EntityParams<any>>;
