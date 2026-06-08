import { z } from 'zod';

const normalizeTextList = (values: string[]) =>
  values.map((value) => value.trim()).filter(Boolean);

const MAX_PRODUCT_IMAGES = 8;
const MAX_PRODUCT_IMAGE_LENGTH = 2_000;

const isProductImageReference = (value: string) => {
  if (value === '') {
    return true;
  }

  if (value.startsWith('/')) {
    return true;
  }

  if (/^https?:\/\/\S+$/i.test(value)) {
    return true;
  }

  return false;
};

const couleursSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .default('')
  .transform((value) => (Array.isArray(value) ? normalizeTextList(value).join(', ') : value.trim()))
  .pipe(z.string().max(500, 'La liste des couleurs est trop longue'));

const productImageSchema = z
  .string()
  .trim()
  .max(MAX_PRODUCT_IMAGE_LENGTH, 'La photo est trop volumineuse')
  .refine(isProductImageReference, 'Le format de la photo est invalide');

export const createProductSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255, 'Le nom est trop long'),
  prix: z.number().int().min(0, 'Le prix doit etre positif').default(0),
  categorie: z.string().min(1, 'La categorie est requise').max(120, 'La categorie est trop longue'),
  couleurs: couleursSchema,
  description: z.string().max(5000, 'La description est trop longue').optional().default(''),
  badge: z.string().max(120, 'Le badge est trop long').optional().default('Aucun'),
  image_url: productImageSchema.optional().default(''),
  image_urls: z
    .array(productImageSchema)
    .max(MAX_PRODUCT_IMAGES, `Vous pouvez ajouter ${MAX_PRODUCT_IMAGES} photos au maximum`)
    .optional()
    .default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export interface Product {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  couleurs: string;
  description: string;
  badge: string;
  image_url: string;
  image_urls: string[];
  date_ajout: Date;
  updated_at: Date;
}
