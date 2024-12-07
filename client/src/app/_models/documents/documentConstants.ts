import { Document } from "src/app/_models/documents/document";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const documentFormInfo: FormInfo<Document> = {
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
