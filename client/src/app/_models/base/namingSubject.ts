import { Articles, ArticlesBySex, ArticleSexes } from "src/app/_models/base/namingSubjectTypes";
import { FormUse } from "src/app/_models/forms/formTypes";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

/**
 * Represents a subject with naming conventions and routing information.
 * This class is used to manage singular and plural forms of a subject,
 * generate title-cased versions, and create URL routes for catalog and creation pages.
 *
 * @remarks
 * The class also provides utility methods for cleaning strings to create URL-friendly routes
 * and capitalizing the first letter of words.
 *
 * @example
 * ```typescript
 * const namingSubject = new NamingSubject(
 *   ArticleSexes.Masculine,
 *   'producto',
 *   'productos',
 *   'Productos',
 *   'ProductController',
 *   ['api', 'products']
 * );
 * console.log(namingSubject.catalogRoute); // e.g. 'api-products/productos'
 * console.log(namingSubject.createRoute);  // e.g. 'api-products/productos/nuevo'
 * ```
 *
 * @public
 */
export class NamingSubject {
  singular: string;
  plural: string;
  singularTitlecase: string;
  pluralTitlecase: string;
  createRoute: string;
  catalogRoute: string;
  title: string;
  articles: Articles;
  articleSex: ArticleSexes;
  controller: string;

  /**
   * Constructs a new NamingSubject instance.
   *
   * @param sex         - The grammatical article sex to be used (masculine/feminine/neutral).
   * @param singular    - The singular noun form (e.g. 'producto').
   * @param plural      - The plural noun form (e.g. 'productos').
   * @param title       - A title or label for this subject (e.g. 'Productos').
   * @param controller  - Associated controller name (e.g. 'ProductController').
   * @param path        - Optional path segment or array of segments used to build the catalog route.
   * @param init        - Optional partial initializer for other properties.
   */
  constructor(
    sex: ArticleSexes,
    singular: string,
    plural: string,
    title: string,
    controller: string,
    path?: string,
    init?: Partial<Omit<
      NamingSubject,
      'articles' |
      'articleSex' |
      'singular' |
      'plural' |
      'singularTitlecase' |
      'pluralTitlecase' |
      'catalogRoute' |
      'createRoute'
    >>
  ) {
    // Assign optional initializer fields first.
    Object.assign(this, init);

    this.articleSex = sex;
    this.singular = singular;
    this.plural = plural;
    this.title = title;
    this.controller = controller;
    this.articles = ArticlesBySex[sex];

    // Generate title-cased versions.
    this.singularTitlecase = this.capitalizeFirstLetter(singular);
    this.pluralTitlecase = this.capitalizeFirstLetter(plural);

    // Build catalog and create routes.
    const pluralRouteSegment = path ?? this.cleanStringAndCreateRoute(this.plural.toLowerCase());
    this.catalogRoute = pluralRouteSegment;
    this.createRoute = `${pluralRouteSegment}/nuevo`;
  }

  /**
   * Builds a URL path based on the specified site section, usage (CREATE, EDIT, DETAIL), and optional ID.
   *
   * @param use         - The usage context of the form (CREATE, EDIT, DETAIL, etc.).
   * @param id          - The optional numeric ID for EDIT or DETAIL routes.
   * @param siteSection - The site section (LANDING, ADMIN, HOME, etc.).
   * @returns A string representing the route for the given site section and usage.
   */
  buildFromSiteSection(
    use: FormUse = FormUse.DETAIL,
    id?: number | null,
    siteSection?: SiteSection
  ): string {
    switch (siteSection) {
      case SiteSection.LANDING:
        return this.handleLandingSiteSection(use, id);
      case SiteSection.ADMIN:
        return this.handleAdminSiteSection(use, id);
      case SiteSection.HOME:
      default:
        return this.handleHomeSiteSection(use, id);
    }
  }

  /**
   * Creates a consistent route URL based on a base prefix, form usage, and optional ID.
   *
   * @param prefix - A path prefix (e.g. '/landing', '/admin', '/inicio', or '').
   * @param use    - The usage (CREATE, EDIT, DETAIL).
   * @param id     - Optional ID for the route.
   * @returns The constructed route string.
   */
  private buildRoute(prefix: string, use: FormUse, id?: number | null): string {
    const idSegment = id ? `/${id}` : '';
    console.log(prefix, this.catalogRoute);
    switch (use) {
      case FormUse.CREATE:
        return `${prefix}/${this.createRoute}`;
      case FormUse.EDIT:
        return `${prefix}/${this.catalogRoute}${idSegment}/editar`;
      case FormUse.DETAIL:
        return `${prefix}/${this.catalogRoute}${idSegment}`;
      default:
        // Fallback: treat unknown usage as EDIT
        return `${prefix}/${this.catalogRoute}${idSegment}/editar`;
    }
  }

  /**
   * Handles route-building logic for the LANDING section.
   *
   * @param use - The usage (CREATE, EDIT, DETAIL).
   * @param id  - Optional ID for building routes.
   * @returns The route string for the landing section.
   */
  private handleLandingSiteSection(use: FormUse, id?: number | null): string {
    const prefix = '/landing';
    return this.buildRoute(prefix, use, id);
  }

  /**
   * Handles route-building logic for the ADMIN section.
   *
   * @param use - The usage (CREATE, EDIT, DETAIL).
   * @param id  - Optional ID for building routes.
   * @returns The route string for the admin section.
   */
  private handleAdminSiteSection(use: FormUse, id?: number | null): string {
    const prefix = '/admin';
    return this.buildRoute(prefix, use, id);
  }

  /**
   * Handles route-building logic for the HOME section.
   *
   * @param use - The usage (CREATE, EDIT, DETAIL).
   * @param id  - Optional ID for building routes.
   * @returns The route string for the home section.
   */
  private handleHomeSiteSection(use: FormUse, id?: number | null): string {
    const prefix = '/inicio';
    return this.buildRoute(prefix, use, id);
  }

  /**
   * Cleans a given string by normalizing it, removing diacritical marks,
   * replacing spaces and slashes with hyphens, and converting it to lowercase.
   *
   * @param str - The input string to be cleaned and transformed.
   * @returns The cleaned and transformed string suitable for use in URLs.
   */
  private cleanStringAndCreateRoute(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")
      .toLowerCase();
  }

  /**
   * Capitalizes the first letter of the given word.
   *
   * @param word - The word to capitalize.
   * @returns The word with the first letter capitalized.
   */
  private capitalizeFirstLetter(word: string): string {
    return word.length
      ? word.charAt(0).toUpperCase() + word.slice(1)
      : word;
  }
}
