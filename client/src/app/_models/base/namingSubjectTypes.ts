

/**
 * Represents the type of articles based on their sex.
 * The type is derived from the `ArticlesBySex` object using the `ArticleSexes` keys.
 */
export type Articles = (typeof ArticlesBySex)[ArticleSexes];

/**
 * Represents the keys of the `ArticlesBySex` object.
 * This type is used to define the possible sexes for articles.
 */
export type ArticleSexes = keyof typeof ArticlesBySex;

export const ArticlesBySex = {
  masculine: {
    undefinedSingular: 'un',
    definedSingular: 'el',
    undefinedPlural: 'unos',
    definedPlural: 'los',
  },
  feminine: {
    undefinedSingular: 'una',
    definedSingular: 'la',
    undefinedPlural: 'unas',
    definedPlural: 'las',
  },
} as const;

