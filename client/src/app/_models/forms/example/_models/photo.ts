
/**
 * Represents a photo with a URL and a caption.
 *
 * @property {string | null} url - The URL of the photo.
 * @property {string | null} caption - The caption for the photo.
 */
export class Photo {
  id: number | null = null;
  url: string | null = null;
  isMain: boolean = false;
  file: File | null = null;

  constructor(init?: Partial<Photo>) {
    Object.assign(this, init);
  }
}
