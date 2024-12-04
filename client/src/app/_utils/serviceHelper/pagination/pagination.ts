
/**
 * Represents pagination details.
 *
 * @interface Pagination
 * @property {number} currentPage - The current page number.
 * @property {number} itemsPerPage - The number of items displayed per page.
 * @property {number} totalItems - The total number of items available.
 * @property {number} totalPages - The total number of pages available.
 */
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
