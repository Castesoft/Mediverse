
export class Document {
  url: string | null = null;
  publicId: string | null = null;
  size: number | null = null;
  thumbnailUrl: string | null = null;
  thumbnailPublicId: string | null = null;
  thumbnailSize: number | null = null;
  name: string | null = null;
  description: string | null = null;
  id: number | null = null;
  createdAt: Date | null = null;

  constructor(init?: Partial<Document>) {
    Object.assign(this, init);
  }
}
