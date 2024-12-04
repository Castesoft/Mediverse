import { Articles, ArticlesBySex, ArticleSexes } from "src/app/_models/base/namingSubjectTypes";

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
 * console.log(namingSubject.catalogRoute); // Outputs: /api/products/productos
 * console.log(namingSubject.createRoute); // Outputs: /api/products/productos/nuevo
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
  route: string[];

  private baseUrl: string;

  constructor(
    sex: ArticleSexes,
    singular: string,
    plural: string,
    title: string,
    controller: string,
    route: string[],
    path?: string,
    init?: Partial<Omit<
      NamingSubject, 'articles' |
      'articleSex' |
      'singular' |
      'plural' |
      'singularTitlecase' |
      'pluralTitlecase' |
      'baseUrl' |
      'catalogRoute' |
      'createRoute'
    >>
  ) {
    Object.assign(this, init);

    this.articleSex = sex;
    this.singular = singular;
    this.plural = plural;
    this.title = title;
    this.controller = controller;
    this.route = route;
    this.articles = ArticlesBySex[sex];

    this.singularTitlecase = this.capitalizeFirstLetter(singular);
    this.pluralTitlecase = this.capitalizeFirstLetter(plural);

    this.baseUrl = '/' + this.route.join('/');

    const pluralRouteSegment = path ?? this.cleanStringAndCreateRoute(this.plural.toLowerCase());
    this.catalogRoute = `${this.baseUrl}/${pluralRouteSegment}`;
    this.createRoute = `${this.baseUrl}/${pluralRouteSegment}/nuevo`;
  }

  /**
   * Cleans a given string by normalizing it, removing diacritical marks,
   * replacing spaces and slashes with hyphens, and converting it to lowercase.
   * This is useful for creating URL-friendly routes from arbitrary strings.
   *
   * @param str - The input string to be cleaned and transformed.
   * @returns The cleaned and transformed string suitable for use in URLs.
   */
  private cleanStringAndCreateRoute(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "-")
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
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
