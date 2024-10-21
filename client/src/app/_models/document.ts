import { FormInfo } from "src/app/_forms/form2";

export class Document {
  url: string | null = null;
  publicId: string | null = null;
  size: number | null = null;
  thumbnailUrl: string | null = null;
  thumbnailPublicId: string | null = null;;
  thumbnailSize: number | null = null;
  name: string | null = null;
  description: string | null = null;
  id: number | null = null;
  createdAt: Date | null = null;

  constructor(init?: Partial<Document>) {
    Object.assign(this, init);
  }
}

export const documentInfo: FormInfo<Document> = {
  createdAt: { label: 'Creado en', type: 'date' },
  description: { label: 'Descripción', type: 'textarea' },
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
  publicId: { label: 'ID público', type: 'text' },
  size: { label: 'Tamaño', type: 'number' },
  thumbnailPublicId: { label: 'ID público de miniatura', type: 'text' },
  thumbnailSize: { label: 'Tamaño de miniatura', type: 'number' },
  thumbnailUrl: { label: 'URL de miniatura', type: 'text' },
  url: { label: 'URL', type: 'text' },
} as FormInfo<Document>;
