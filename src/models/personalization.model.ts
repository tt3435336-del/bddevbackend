import { z } from 'zod';

export const personalizationStatuses = [
  'nouvelle',
  'en_cours',
  'terminee',
  'annulee',
] as const;

export const createPersonalizationSchema = z.object({
  entreprise: z.string().min(1, 'Le nom de l entreprise est requis').max(255, 'Le nom de l entreprise est trop long'),
  telephone: z.string().min(1, 'Le telephone est requis').max(60, 'Le telephone est trop long'),
  details: z.string().max(5000, 'Les details sont trop longs').optional().nullable(),
  logo_url: z.string().optional().nullable(),
});

export const updatePersonalizationStatusSchema = z.object({
  statut: z.enum(personalizationStatuses, { message: 'Statut invalide' }),
});

export type CreatePersonalizationInput = z.infer<typeof createPersonalizationSchema>;
export type UpdatePersonalizationStatusInput = z.infer<typeof updatePersonalizationStatusSchema>;

export interface PersonalizationRequest {
  id: string;
  entreprise: string;
  telephone: string;
  details: string;
  logo_url: string;
  statut: string;
  created_at: Date;
  updated_at: Date;
}
