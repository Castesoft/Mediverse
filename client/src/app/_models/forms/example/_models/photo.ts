
/**
 * Represents a photo with a URL and a caption.
 *
 * @property {string | null} url - The URL of the photo.
 * @property {string | null} caption - The caption for the photo.
 */
export class Photo {
  id?: number;
  url?: string;
  file?: File;
  isMain: boolean = false;

  constructor(init?: Partial<Photo>) {
    Object.assign(this, init);
  }
}
